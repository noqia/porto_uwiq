import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionReveal } from '../components/shared/SectionReveal'
import { supabase } from '../services/supabaseClient'

export const Work = () => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorks(data || [])
    } catch (error) {
      console.error('Error fetching works:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* HEADER — Centered */}
        <SectionReveal>
          <div className="text-center mb-24">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
              Work
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Selected projects that define my craft in storytelling and brand narrative.
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-purple to-transparent mx-auto mt-8" />
          </div>
        </SectionReveal>

        {works.length === 0 ? (
          <SectionReveal>
            <div className="text-center py-20">
              <ImageIcon size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-700" />
              <h3 className="text-2xl font-bold mb-2">No projects yet</h3>
              <p className="text-slate-500">Projects will appear here once published from admin panel.</p>
            </div>
          </SectionReveal>
        ) : (
          <div className="space-y-32">
            {works.map((work, index) => {
              const isEven = index % 2 === 0
              
              return (
                <SectionReveal key={work.id}>
                  <motion.article
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.4 }}
                    className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                  >
                    {/* Image Side */}
                    <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group bg-slate-100 dark:bg-slate-800">
                        {work.image ? (
                          <img 
                            src={work.image} 
                            alt={work.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon size={64} className="text-slate-300 dark:text-slate-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-medium">
                          {work.category}
                        </span>
                        <span className="text-sm text-slate-400">{work.year}</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        {work.title}
                      </h2>
                      
                      <p 
                        className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: work.description || '' }}
                      />

                      <div className="flex flex-wrap gap-2 mb-8">
                        {(work.tags || []).slice(0, 4).map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/work/${work.id}`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:scale-105 transition-transform group"
                      >
                        View Detail 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                </SectionReveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}