import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'
import toast from 'react-hot-toast'

export const ManageBlog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlogs(data || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return
    
    setDeletingId(id)
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id)
      if (error) throw error
      toast.success('Article deleted successfully')
      setBlogs(prev => prev.filter(b => b.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete article')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      
      setBlogs(prev => prev.map(b => 
        b.id === id ? { ...b, status: newStatus } : b
      ))
      
      toast.success(`Article ${newStatus === 'published' ? 'published' : 'unpublished'}`)
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Blogs</h1>
          <p className="text-slate-500 mt-1">{blogs.length} articles total</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-accent-purple/25 hover:scale-105 transition-all"
        >
          <Plus size={18} /> New Article
        </Link>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <ImageIcon size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No articles yet</h3>
          <p className="text-slate-500 mb-6">Start writing your first story</p>
          <Link
            to="/admin/blogs/new"
            className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus size={18} /> Create Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${blog.thumbnail ? 'hidden' : 'flex'}`}
                >
                  <ImageIcon size={48} className="text-slate-300 dark:text-slate-600" />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    blog.status === 'published'
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {blog.status === 'published' ? '● Live' : '○ Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-md bg-accent-purple/10 text-accent-purple text-xs font-medium">
                    {blog.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(blog.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent-purple transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/blogs/edit/${blog.id}`}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-accent-purple hover:text-white transition-all"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => toggleStatus(blog.id, blog.status)}
                      className={`p-2 rounded-lg transition-all ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                      title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {blog.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    disabled={deletingId === blog.id}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-all disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === blog.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}