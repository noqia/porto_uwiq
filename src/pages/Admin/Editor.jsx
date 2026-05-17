import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react'
import TipTapEditor from '../../components/shared/TipTapEditor'
import { supabase } from '../../services/supabaseClient'
import toast from 'react-hot-toast'

export const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Creative Writing',
    status: 'draft',
    read_time: '5 min',
    author: 'Admin'
  })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)

  useEffect(() => {
    if (isEditing) fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
      if (error) throw error
      setForm({
        title: data.title || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: data.category || 'Creative Writing',
        status: data.status || 'draft',
        read_time: data.read_time || '5 min',
        author: data.author || 'Admin'
      })
      setThumbnailPreview(data.thumbnail || '')
    } catch (error) {
      toast.error('Failed to load')
      navigate('/admin/blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image')
      return
    }

    // <-- LOGIKA MAKSIMAL 500KB -->
    if (file.size > 500 * 1024) { 
      toast.error('File terlalu besar! Maksimal 500KB.')
      e.target.value = '' 
      return
    }

    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return thumbnailPreview || null
    const ext = thumbnailFile.name.split('.').pop()
    const path = `thumbnails/blog-${Date.now()}.${ext}`
    
    const { error } = await supabase.storage
      .from('portfolio')
      .upload(path, thumbnailFile)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(path)
    
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!form.title.trim()) {
        toast.error('Title is required')
        setSaving(false)
        return
      }

      const thumbnailUrl = await uploadThumbnail()
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        category: form.category,
        status: form.status,
        read_time: form.read_time,
        author: form.author,
        thumbnail: thumbnailUrl,
        updated_at: new Date().toISOString()
      }

      if (isEditing) {
        await supabase.from('blogs').update(payload).eq('id', id)
        toast.success('Article updated!')
      } else {
        await supabase.from('blogs').insert([{ ...payload, created_at: new Date().toISOString() }])
        toast.success('Article published!')
      }

      navigate('/admin/blogs')
    } catch (error) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field, value) => setForm(p => ({ ...p, [field]: value }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/blogs" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Article' : 'New Article'}</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Article'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none text-lg font-bold"
              placeholder="Article title..."
              required
            />
          </div>

          {/* Excerpt */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              value={form.excerpt}
              onChange={e => updateField('excerpt', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none h-24 resize-none"
              placeholder="Short description..."
              required
            />
          </div>

          {/* TIPTAP CONTENT */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-medium mb-2">Content</label>
            <TipTapEditor
              content={form.content}
              onChange={(html) => updateField('content', html)}
              placeholder="Write your article content here... You can paste HTML directly!"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Thumbnail */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-medium mb-3">Thumbnail</label>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-accent-purple transition-colors">
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <span className="text-white text-sm">Change</span>
                    {/* <-- TAMBAHAN: Teks max size saat hover --> */}
                    <span className="text-white/80 text-xs mt-1 font-medium">Maximum filesize 500KB</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-sm">Click to upload</span>
                  {/* <-- TAMBAHAN: Teks max size saat kosong --> */}
                  <span className="text-xs mt-1 font-medium text-slate-500">Maximum filesize 500KB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold">Settings</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => updateField('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
              >
                {['Creative Writing', 'Content Strategy', 'UX Writing', 'Fiction', 'SEO', 'Technical'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('status', 'draft')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    form.status === 'draft'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-2 border-amber-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  📝 Draft
                </button>
                <button
                  type="button"
                  onClick={() => updateField('status', 'published')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    form.status === 'published'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-2 border-green-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  🚀 Published
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Read Time</label>
              <input
                type="text"
                value={form.read_time}
                onChange={e => updateField('read_time', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                placeholder="5 min read"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={e => updateField('author', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}