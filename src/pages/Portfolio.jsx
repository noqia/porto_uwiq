import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { SectionReveal } from '../components/shared/SectionReveal'
import { supabase } from '../services/supabaseClient'

const filters = ['All', 'Photography', 'Writing', 'Design', 'Video']

export const Portfolio = () => {
  const [items, setItems] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.category === activeFilter)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <SectionReveal>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Creative Portfolio</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mb-12">
            Visual stories, campaigns, and creative explorations.
          </p>
        </SectionReveal>

        <SectionReveal>
          <div className="flex gap-3 flex-wrap mb-12">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </SectionReveal>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                  index % 3 === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url || item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                  <div>
                    <span className="text-accent-cyan text-xs font-medium uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-white text-xl font-bold mt-1">{item.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white">
                    <ZoomIn size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-5xl max-h-[90vh] w-full"
                onClick={e => e.stopPropagation()}
              >
                {selectedItem.type === 'video' ? (
                  <video src={selectedItem.url} controls className="w-full rounded-2xl" />
                ) : (
                  <img src={selectedItem.url || selectedItem.thumbnail} alt={selectedItem.title} className="w-full h-full object-contain rounded-2xl" />
                )}
                <div className="mt-4 text-center">
                  <h3 className="text-white text-2xl font-bold">{selectedItem.title}</h3>
                  <p className="text-white/60 mt-2">{selectedItem.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}