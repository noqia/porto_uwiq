import { createContext, useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'

export const AuthContext = createContext(null)

const IDLE_TIMEOUT = 5 * 60 * 1000 // 5 menit

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const idleTimerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    
    if (user) {
      idleTimerRef.current = setTimeout(() => {
        console.log('Idle timeout - logging out')
        logout()
      }, IDLE_TIMEOUT)
    }
  }, [user])

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    
    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  // Idle detection
  useEffect(() => {
    if (!user) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      resetIdleTimer()
    }

    events.forEach(e => window.addEventListener(e, handleActivity))
    resetIdleTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [user, resetIdleTimer])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}