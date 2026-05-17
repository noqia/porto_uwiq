import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const TypingEffect = ({ 
  texts = ['Stories', 'Ideas', 'Dreams', 'Worlds'], 
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const text = texts[currentTextIndex]
    
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false)
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        return
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(text.substring(0, currentText.length - 1))
      }, deletingSpeed)
      return () => clearTimeout(timeout)
    }

    if (currentText === text) {
      setIsPaused(true)
      return
    }

    const timeout = setTimeout(() => {
      setCurrentText(text.substring(0, currentText.length + 1))
    }, typingSpeed)
    
    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className="inline-flex items-baseline">
      <span className="gradient-text">{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1em] bg-accent-purple ml-1 align-middle"
      />
    </span>
  )
}