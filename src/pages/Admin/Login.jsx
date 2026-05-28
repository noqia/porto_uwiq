import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // --- STATE UNTUK SISTEM COOLDOWN ---
  const [attempts, setAttempts] = useState(0)
  const [penaltyLevel, setPenaltyLevel] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  // 1. Ambil data dari LocalStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem('login_attempts') || '0')
    const storedPenalty = parseInt(localStorage.getItem('login_penalty_level') || '0')
    const storedLockout = parseInt(localStorage.getItem('login_lockout_until') || '0')

    setAttempts(storedAttempts)
    setPenaltyLevel(storedPenalty)

    // Jika waktu saat ini masih di bawah waktu buka kunci, set state lockout
    if (storedLockout > Date.now()) {
      setLockoutUntil(storedLockout)
    } else if (storedLockout !== 0) {
      // Waktu hukuman sudah habis, hapus kuncian tapi biarkan level penalty-nya
      localStorage.removeItem('login_lockout_until')
    }
  }, [])

  // 2. Timer Countdown (Menghitung mundur jika sedang di-lock)
  useEffect(() => {
    if (!lockoutUntil) return

    const timer = setInterval(() => {
      const now = Date.now()
      if (now >= lockoutUntil) {
        setLockoutUntil(null)
        setTimeLeft('')
        localStorage.removeItem('login_lockout_until')
        setErrorMessage('') // Bersihkan pesan error saat terbuka
        clearInterval(timer)
      } else {
        // Kalkulasi waktu tersisa
        const diff = lockoutUntil - now
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((diff % (1000 * 60)) / 1000)

        if (hours > 0) {
          setTimeLeft(`${hours} Jam ${mins} Menit ${secs} Detik`)
        } else {
          setTimeLeft(`${mins} Menit ${secs} Detik`)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockoutUntil])

  // 3. Fungsi untuk menentukan durasi hukuman berdasarkan level
  const getPenaltyDuration = (level) => {
    switch (level) {
      case 1: return 5 * 60 * 1000;         // 5 Menit
      case 2: return 15 * 60 * 1000;        // 15 Menit
      case 3: return 60 * 60 * 1000;        // 1 Jam
      case 4: return 24 * 60 * 60 * 1000;   // 24 Jam
      default: return 5 * 60 * 1000;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Proteksi tambahan jika tombol dipaksa klik saat sedang cooldown
    if (lockoutUntil && Date.now() < lockoutUntil) return

    setLoading(true)
    setErrorMessage('')

    try {
      await login(email, password)

      // BERHASIL LOGIN: Reset semua hitungan hukuman
      localStorage.removeItem('login_attempts')
      localStorage.removeItem('login_penalty_level')
      localStorage.removeItem('login_lockout_until')

      toast.success('Welcome back!')
      navigate('/admin')
    } catch (error) {
      // GAGAL LOGIN
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem('login_attempts', newAttempts.toString())

      if (newAttempts >= 3) {
        // Naikkan level hukuman (maksimal level 4 = 24 jam)
        const newLevel = Math.min(penaltyLevel + 1, 4) 
        const duration = getPenaltyDuration(newLevel)
        const unlockTime = Date.now() + duration

        setPenaltyLevel(newLevel)
        setLockoutUntil(unlockTime)
        setAttempts(0) // Reset hitungan 3 kali untuk ronde berikutnya setelah tunggu

        // Simpan ke storage
        localStorage.setItem('login_penalty_level', newLevel.toString())
        localStorage.setItem('login_lockout_until', unlockTime.toString())
        localStorage.setItem('login_attempts', '0')

      } else {
        setErrorMessage(`Username atau password salah. Sisa percobaan: ${3 - newAttempts}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-accent-purple/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">IstawaFaqih</h1>
            <p className="text-slate-400">Admin Dashboard</p>
          </div>

          {/* TAMPILAN ERROR ATAU COOLDOWN */}
          {(errorMessage || lockoutUntil) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl border text-sm font-medium text-center flex flex-col items-center gap-2 ${
                lockoutUntil 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
            >
              {lockoutUntil ? (
                <>
                  <AlertTriangle size={24} className="mb-1" />
                  <span>Akses diblokir sementara karena terlalu banyak kegagalan.</span>
                  <span className="font-bold text-base mt-1">Coba lagi dalam: {timeLeft}</span>
                </>
              ) : (
                errorMessage
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={lockoutUntil !== null} // Disable input saat dilock
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-accent-purple outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockoutUntil !== null} // Disable input saat dilock
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-accent-purple outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={lockoutUntil !== null}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutUntil !== null}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold hover:shadow-lg hover:shadow-accent-purple/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : lockoutUntil ? 'Locked' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}