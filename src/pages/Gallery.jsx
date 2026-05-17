import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Video } from 'lucide-react'
import { SectionReveal } from '../components/shared/SectionReveal'
import { supabase } from '../services/supabaseClient'

export const Gallery = () => {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // all, photo, video
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
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

  const filtered = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <SectionReveal>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Gallery</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mb-12">
            Moments captured through the lens and motion.
          </p>
        </SectionReveal>

        <SectionReveal>
          <div className="flex gap-4 mb-12">
            {[
              { key: 'all', label: 'All', icon: ImageIcon },
              { key: 'photo', label: 'Photos', icon: ImageIcon },
              { key: 'video', label: 'Videos', icon: Video }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  filter === key
                    ? 'bg-accent-purple text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filtered.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'video' ? (
                  <div className="relative aspect-video bg-slate-900">
                    <video src={item.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Video className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.caption || 'Gallery item'} 
                    className="w-full rounded-2xl transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-medium">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                <X size={24} />
              </button>
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
                onClick={e => e.stopPropagation()}
              >
                {selectedItem.type === 'video' ? (
                  <video src={selectedItem.url} controls className="max-h-[80vh] rounded-2xl" />
                ) : (
                  <img src={selectedItem.url} alt="" className="max-h-[80vh] object-contain rounded-2xl" />
                )}
                {selectedItem.caption && (
                  <p className="text-white/80 mt-4 text-lg">{selectedItem.caption}</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}