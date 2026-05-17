import { Link } from 'react-router-dom'
import { Github, Twitter, Instagram, Linkedin, Heart } from 'lucide-react'
import { SectionReveal } from '../shared/SectionReveal'

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
              {['Home', 'About', 'Work', 'Blog', 'Portfolio'].map((item) => (
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
              {[Twitter, Instagram, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-accent-purple hover:scale-110 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p> {new Date().getFullYear()} <a href="https://www.linkedin.com/in/ulqianurhusna/" className="hover:text-accent-purple" target="_blank">Ulqia Nurhusna</a>. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-accent-pink fill-accent-pink" /> using React & Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}