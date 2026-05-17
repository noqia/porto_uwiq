import { motion } from 'framer-motion'

export const AnimatedUnderline = ({ children, className = '' }) => {
  return (
    <span className={`relative inline-block group ${className}`}>
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-purple to-accent-blue"
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </span>
  )
}