import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Eye, Share2, Twitter, Facebook, Linkedin } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import profileImage from '../assets/profile.jpg'

export const BlogDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      
      // 1. Ambil data blog saat ini
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      // 2. Logika Hitung Tayangan (View Counter)
      // Tambahkan nilai view saat ini dengan 1
      const currentViews = data.views || 0
      const updatedViews = currentViews + 1

      // Update data views yang baru ke Supabase
      await supabase
        .from('blogs')
        .update({ views: updatedViews })
        .eq('id', id)

      // Simpan ke state komponen (gunakan updatedViews agar angka terbaru langsung muncul)
      setPost({ ...data, views: updatedViews })

      // 3. Ambil data artikel terkait
      const { data: relatedData } = await supabase
        .from('blogs')
        .select('id, title, thumbnail, category')
        .eq('category', data.category)
        .neq('id', id)
        .limit(3)

      setRelated(relatedData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="pt-32 text-center">Loading...</div>
  if (!post) return <div className="pt-32 text-center">Post not found</div>

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-purple to-accent-blue origin-left z-50"
        style={{ scaleX }}
      />

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent-purple mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <span className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-slate-500 mb-12 pb-12 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <img 
                src={profileImage} 
                alt={post.author || 'Author'} 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm"
              />
              <div>
                <div className="font-medium text-slate-900 dark:text-white">{post.author || 'Anonymous'}</div>
                <div className="text-sm">Content Writer</div>
              </div>
            </div>
            
            <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {post.read_time || '5 min read'}</span>
            
            {/* TAMBAHAN: Menampilkan Jumlah Total Views di Sebelah Menit Read */}
            <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full text-sm">
              <Eye size={16} className="text-slate-400" /> {post.views || 0} views
            </span>
          </div>

          {post.thumbnail && (
            <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-accent-purple hover:prose-a:text-accent-blue prose-img:rounded-2xl clean-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="font-medium flex items-center gap-2"><Share2 size={18} /> Share this article</span>
              <div className="flex gap-3">
                {[Twitter, Facebook, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-accent-purple hover:text-white transition-all">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-24">
            <h3 className="text-2xl font-bold mb-8">Related Stories</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} to={`/blog/${item.id}`} className="group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                    <img src={item.thumbnail || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80'} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-accent-purple text-xs font-medium">{item.category}</span>
                  <h4 className="font-bold mt-1 group-hover:text-accent-purple transition-colors">{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments UI */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold mb-8">Comments</h3>
          <div className="glass rounded-2xl p-6 mb-6">
            <textarea
              placeholder="Share your thoughts..."
              className="w-full bg-transparent border-none resize-none h-24 focus:outline-none text-slate-700 dark:text-slate-300"
            />
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 rounded-full bg-accent-purple text-white text-sm font-medium hover:scale-105 transition-transform">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}