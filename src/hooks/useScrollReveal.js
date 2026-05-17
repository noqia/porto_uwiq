import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAnimation } from 'framer-motion'

export const useScrollReveal = (threshold = 0.1) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [inView, controls])

  return { ref, controls }
}