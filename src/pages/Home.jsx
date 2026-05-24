import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Calendar, Clock, Image as ImageIcon, Loader2 } from 'lucide-react'
import { SectionReveal } from '../components/shared/SectionReveal'
import { Particles } from '../components/shared/Particles'
import { TypingEffect } from '../components/shared/TypingEffect'
import { fadeInUp, staggerContainer } from '../animations/variants'
import { supabase } from '../services/supabaseClient'

export const Home = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const [featuredWork, setFeaturedWork] = useState(null)
  const [latestBlogs, setLatestBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Ambil 1 featured work (is_featured = true, published)
      const { data: workData, error: workError } = await supabase
        .from('works')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!workError) setFeaturedWork(workData)

      // Ambil 4 latest blogs
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!blogError) setLatestBlogs(blogData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  return (
    <div ref={containerRef}>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80)' 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950 dark:from-slate-950/80 dark:via-slate-950/60 dark:to-slate-950" />
        </motion.div>

        <Particles count={25} />

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-accent-cyan border border-accent-cyan/20">
                Creative Writer & Content Strategist
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
            >
              Words That <br />
              <span className="gradient-text">
                <TypingEffect 
                  texts={['Move Worlds', 'Inspire Change', 'Tell Stories', 'Build Brands']} 
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={2500}
                />
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              I craft compelling narratives, build immersive brand stories, and transform complex ideas into words that resonate and inspire action.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/work"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold hover:shadow-lg hover:shadow-accent-purple/25 hover:scale-105 transition-all"
              >
                View My Work
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                About Me <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ArrowDown size={24} />
        </motion.div>
      </section>

      {/* FEATURED PROJECT — Dari Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionReveal>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">Featured Project</h2>
              <Link to="/work" className="hidden md:flex items-center gap-2 text-accent-purple hover:gap-3 transition-all">
                View All Work <ArrowRight size={18} />
              </Link>
            </div>
          </SectionReveal>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
            </div>
          ) : featuredWork ? (
            <SectionReveal>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="glass rounded-3xl p-8 md:p-12 overflow-hidden relative"
              >
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-purple/30 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-blue/30 rounded-full blur-3xl" />
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div>
                    <span className="text-accent-purple font-medium text-sm tracking-wider uppercase mb-4 block">
                      {featuredWork.category}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-bold mb-6">
                      {featuredWork.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg line-clamp-3">{stripHtml(featuredWork.description)}
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {(featuredWork.tags || []).slice(0, 4).map(tag => (
                        <span key={tag} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/work/${featuredWork.id}`}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:scale-105 transition-transform"
                    >
                      View Detail <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
                      {featuredWork.image ? (
                        <img 
                          src={featuredWork.image} 
                          alt={featuredWork.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon size={64} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </SectionReveal>
          ) : (
            <div className="glass rounded-3xl p-16 text-center">
              <p className="text-slate-500">No featured project yet. Mark a work as featured in admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* LATEST WRITINGS — Dari Blogs */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <SectionReveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Latest Writings</h2>
          </SectionReveal>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
            </div>
          ) : latestBlogs.length === 0 ? (
            <SectionReveal>
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg">No articles published yet.</p>
              </div>
            </SectionReveal>
          ) : (
            <div className="space-y-24">
              {latestBlogs.map((blog, index) => (
                <SectionReveal key={blog.id} variants={index % 2 === 0 ? { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.6 } } } : { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.6 } } }}>
                  <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                    <div className="flex-1">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative group">
                        {blog.thumbnail ? (
                          <img 
                            src={blog.thumbnail} 
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center ${blog.thumbnail ? 'hidden' : 'flex'}`}>
                          <span className="text-6xl font-serif italic text-slate-400">"</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-medium mb-4">
                        {blog.category}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-accent-purple transition-colors">
                        <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(blog.created_at)}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {blog.read_time || '5 min read'}</span>
                      </div>
                      <Link 
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-2 mt-6 text-accent-purple font-medium hover:gap-3 transition-all"
                      >
                        Read Article <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          )}

          {!loading && latestBlogs.length > 0 && (
            <SectionReveal>
              <div className="text-center mt-16">
                <Link 
                  to="/blog"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass font-semibold hover:bg-accent-purple hover:text-white transition-all"
                >
                  View All Articles <ArrowRight size={18} />
                </Link>
              </div>
            </SectionReveal>
          )}
        </div>
      </section>
    </div>
  )
}