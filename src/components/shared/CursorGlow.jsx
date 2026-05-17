import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 hidden lg:block"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.06), transparent 40%)`
      }}
    />
  )
}