import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react'
import { SectionReveal } from '../components/shared/SectionReveal'
import { supabase } from '../services/supabaseClient'

export const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()

      if (error) throw error
      if (!data) {
        navigate('/work')
        return
      }
      
      setProject(data)

      // Fetch related (same category, exclude current)
      const { data: relatedData } = await supabase
        .from('works')
        .select('*')
        .eq('status', 'published')
        .eq('category', data.category)
        .neq('id', id)
        .limit(2)

      setRelated(relatedData || [])
    } catch (error) {
      console.error('Error:', error)
      navigate('/work')
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

  if (!project) return null

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/work')}
          className="flex items-center gap-2 text-slate-500 hover:text-accent-purple mb-12 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Work
        </motion.button>

        {/* HERO IMAGE */}
        <SectionReveal>
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl bg-slate-100 dark:bg-slate-800">
            {project.image ? (
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={80} className="text-slate-300 dark:text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-sm font-medium mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{project.title}</h1>
              <p className="text-white/80 text-lg">{project.client} • {project.year}</p>
            </div>
          </div>
        </SectionReveal>

        {/* PROJECT META */}
        <SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Client', value: project.client },
              { label: 'Duration', value: project.duration },
              { label: 'Role', value: project.role },
              { label: 'Year', value: project.year }
            ].map((meta, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{meta.label}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{meta.value || '-'}</div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-12">
            
            {/* OVERVIEW / DESCRIPTION — Render HTML dengan benar */}
            <SectionReveal>
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <div 
                  /* --- TAMBAHKAN 'clean-content' DI BARIS INI --- */
                  className="prose prose-slate dark:prose-invert max-w-none text-lg clean-content"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            </SectionReveal>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SectionReveal>
              <div className="glass rounded-2xl p-6 sticky top-32">
                <h3 className="font-bold mb-4">Services</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(project.tags || []).map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* TOMBOL VIEW LIVE PROJECT — Hanya muncul jika live_link diisi */}
                {project.live_link && (
                  <a 
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> View Live Project
                  </a>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* RELATED PROJECTS */}
        {related.length > 0 && (
          <SectionReveal>
            <div className="pt-16 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold mb-12">Related Projects</h2>
                <div className="grid md:grid-cols-2 gap-8">
                {related.map((rel) => (
                  <motion.div
                    key={rel.id}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/work/${rel.id}`)}
                  >
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                      {rel.image ? (
                        <img 
                          src={rel.image} 
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon size={48} className="text-slate-300 dark:text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <ArrowRight size={20} className="text-slate-900" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-accent-purple text-sm font-medium">{rel.category}</span>
                      <span className="text-slate-400 text-sm">{rel.year}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-accent-purple transition-colors">
                      {rel.title}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionReveal>
        )}
      </div>
    </div>
  )
}