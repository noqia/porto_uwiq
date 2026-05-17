import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Image as ImageIcon, ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import TipTapEditor from '../../components/shared/TipTapEditor'
import { supabase } from '../../services/supabaseClient'
import toast from 'react-hot-toast'
import { CATEGORIES } from '../../utils/constants'

export const WorkEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: 'Brand Story',
    year: new Date().getFullYear().toString(),
    client: '',
    duration: '',
    role: '',
    live_link: '',
    description: '',
    tags: [''],
    status: 'draft',
    is_featured: false
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)

  useEffect(() => {
    if (isEditing) fetchWork()
  }, [id])

  const fetchWork = async () => {
    try {
      const { data, error } = await supabase.from('works').select('*').eq('id', id).single()
      if (error) throw error
      
      setForm({
        ...data,
        tags: data.tags?.length ? data.tags : [''],
        live_link: data.live_link || ''
      })
      setImagePreview(data.image || '')
    } catch (error) {
      toast.error('Failed to load')
      navigate('/admin/works')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload Image Here!')
      return
    }

    if (file.size > 500 * 1024) { // 500KB dalam Bytes
      toast.error('File terlalu besar! Maksimal 500KB.')
      e.target.value = '' 
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async () => {
    if (!imageFile) return imagePreview || null
    const ext = imageFile.name.split('.').pop()
    const path = `works/${Date.now()}.${ext}`
    
    const { error } = await supabase.storage
      .from('portfolio')
      .upload(path, imageFile)
    
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
      const imageUrl = await uploadImage()

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        category: form.category,
        year: form.year,
        client: form.client,
        duration: form.duration,
        role: form.role,
        live_link: form.live_link?.trim(),
        description: form.description,
        tags: form.tags.filter(t => t.trim()),
        status: form.status,
        is_featured: form.is_featured,
        image: imageUrl,
        updated_at: new Date().toISOString()
      }

      if (isEditing) {
        await supabase.from('works').update(payload).eq('id', id)
        toast.success('Updated!')
      } else {
        await supabase.from('works').insert([{ ...payload, created_at: new Date().toISOString() }])
        toast.success('Created!')
      }
      navigate('/admin/works')
    } catch (error) {
      toast.error(error.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field, value) => setForm(p => ({ ...p, [field]: value }))

  const addTag = () => setForm(p => ({ ...p, tags: [...p.tags, ''] }))
  const removeTag = (idx) => setForm(p => ({ ...p, tags: p.tags.filter((_, i) => i !== idx) }))
  const updateTag = (idx, value) => {
    const arr = [...form.tags]
    arr[idx] = value
    setForm(p => ({ ...p, tags: arr }))
  }

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
          <Link to="/admin/works" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Project' : 'New Project'}</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Project'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => updateField('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none text-lg font-bold"
                placeholder="Project title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={e => updateField('subtitle', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                placeholder="Short tagline"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => updateField('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                >
                  {/* --- PERBAIKAN: Memanggil dari file constants.js --- */}
                  {CATEGORIES.portfolio.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={e => updateField('year', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={e => updateField('client', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={e => updateField('duration', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                  placeholder="e.g. 3 Months"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={e => updateField('role', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                  placeholder="e.g. Lead Copywriter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Live Link (Optional)</label>
                <input
                  type="url"
                  value={form.live_link}
                  onChange={e => updateField('live_link', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg">Project Details *</h3>
            <TipTapEditor
              content={form.description}
              onChange={(html) => updateField('description', html)}
              placeholder="Ceritakan detail project di sini. Klien bebas mengatur layout, tabel, gambar, dll..."
            />
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg">Services / Tags</h3>
            {form.tags.map((tag, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={e => updateTag(idx, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
                  placeholder="e.g. Brand Strategy"
                />
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                  disabled={form.tags.length === 1}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="flex items-center gap-2 text-sm text-accent-purple font-medium hover:underline"
            >
              <Plus size={16} /> Add Tag
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-medium mb-3">Project Image</label>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-accent-purple transition-colors">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <span className="text-white text-sm">Change Image</span>
                    <span className="text-white/80 text-xs mt-1 font-medium">Maximum filesize 500KB</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-sm">Click to upload</span>
                  <span className="text-xs mt-1 font-medium text-slate-500">Maximum filesize 500KB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold">Publish Settings</h3>
            
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

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={e => updateField('is_featured', e.target.checked)}
                className="w-5 h-5 rounded accent-accent-purple"
              />
              <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}