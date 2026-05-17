import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2, Star } from 'lucide-react'
import { supabase, uploadFile } from '../../services/supabaseClient'
import toast from 'react-hot-toast'

export const ManageWork = () => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorks(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteWork = async (id) => {
    if (!confirm('Delete this project?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('works').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      fetchWorks()
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleStatus = async (id, current) => {
    const next = current === 'published' ? 'draft' : 'published'
    try {
      await supabase.from('works').update({ status: next }).eq('id', id)
      fetchWorks()
    } catch (error) {
      toast.error('Failed')
    }
  }

  const toggleFeatured = async (id, current) => {
    try {
      await supabase.from('works').update({ is_featured: !current }).eq('id', id)
      fetchWorks()
      toast.success(current ? 'Removed from featured' : 'Set as featured')
    } catch (error) {
      toast.error('Failed')
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Works</h1>
          <p className="text-slate-500 mt-1">{works.length} projects</p>
        </div>
        <Link
          to="/admin/works/new"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <motion.div
            key={work.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl overflow-hidden group"
          >
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
              {work.image ? (
                <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon size={40} className="text-slate-300" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                  work.status === 'published' ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  {work.status}
                </span>
                {work.is_featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-accent-purple text-white flex items-center gap-1">
                    <Star size={10} /> Featured
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg mb-1">{work.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{work.category} • {work.year}</p>

              <div className="flex gap-2">
                <Link
                  to={`/admin/works/edit/${work.id}`}
                  className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-center text-sm font-medium hover:bg-accent-purple hover:text-white transition-colors"
                >
                  <Pencil size={14} className="inline mr-1" /> Edit
                </Link>
                <button
                  onClick={() => toggleStatus(work.id, work.status)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  title="Toggle status"
                >
                  {work.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => toggleFeatured(work.id, work.is_featured)}
                  className={`p-2 rounded-lg transition-colors ${work.is_featured ? 'bg-accent-purple text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                  title="Toggle featured"
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={() => deleteWork(work.id)}
                  disabled={deletingId === work.id}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deletingId === work.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}