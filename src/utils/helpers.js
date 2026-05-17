import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge tailwind classes dengan benar
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date ke format lokal Indonesia
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Estimate read time dari konten
export function estimateReadTime(content) {
  const wordsPerMinute = 200
  const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Truncate text dengan ellipsis
export function truncate(str, length = 100) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

// Generate slug dari string
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// Debounce function untuk search
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}