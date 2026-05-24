import { Link } from 'react-router-dom'
import { Twitter, Instagram, Linkedin, Facebook, Github, Heart } from 'lucide-react'
import { SectionReveal } from '../shared/SectionReveal'

const MediumIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const socialLinks = [
  { icon: Twitter, label: 'Twitter', url: 'https://x.com/FaqihAtthoriq', color: 'hover:text-sky-400', Target: '_blank' },
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/faqihatthoriq/', color: 'hover:text-pink-500', Target: '_blank' },
  { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/faqihatthoriq/', color: 'hover:text-blue-600', Target: '_blank' },
  { icon: MediumIcon, label: 'Medium', url: 'https://medium.com/@faqihatthoriq', color: 'hover:text-slate-800 dark:hover:text-white', Target: '_blank' },
]

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-slate-900/50 pointer-events-none" />
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 gradient-text">IstawaFaqih</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Crafting narratives that resonate, inspire, and transform ideas into compelling stories. 
              Specialized in creative writing, brand storytelling, and content strategy.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Navigation</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Work', 'Blog'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-accent-purple transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon; 
                return (
                  <a
                    key={i}
                    href={social.url}
                    target={social.Target}
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full glass flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all hover:scale-110 ${social.color}`}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p> {new Date().getFullYear()} <a href="https://www.linkedin.com/in/ulqianurhusna/" className="hover:text-accent-purple" target="_blank" rel="noopener noreferrer">Ulqia Nurhusna</a>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}