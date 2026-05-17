import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Image as ImageIcon, Video, X, Loader2 } from 'lucide-react'
import { supabase, uploadFile } from '../../services/supabaseClient'
import toast from 'react-hot-toast'

export const ManageGallery = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mediaType, setMediaType] = useState('photo') // 'photo' | 'video'
  const [sourceType, setSourceType] = useState('upload') // 'upload' | 'embed'
  const [embedUrl, setEmbedUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  // Reset input saat mengganti tab tipe media atau sumber
  useEffect(() => {
    setSelectedFile(null)
    setEmbedUrl('')
  }, [mediaType, sourceType])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Logika Validasi Ukuran File
    if (mediaType === 'photo') {
      if (!file.type.startsWith('image/')) {
        toast.error('Harap pilih file gambar!')
        e.target.value = ''
        return
      }
      if (file.size > 500 * 1024) { // Max 500KB
        toast.error('File foto terlalu besar! Maksimal 500KB.')
        e.target.value = ''
        return
      }
    } else if (mediaType === 'video') {
      if (!file.type.startsWith('video/')) {
        toast.error('Harap pilih file video!')
        e.target.value = ''
        return
      }
      if (file.size > 20 * 1024 * 1024) { // Max 20MB
        toast.error('File video terlalu besar! Maksimal 20MB.')
        e.target.value = ''
        return
      }
    }

    setSelectedFile(file)
  }

  const handleSubmitModal = async () => {
    setUploading(true)
    try {
      let finalUrl = ''
      let captionText = ''

      if (sourceType === 'upload') {
        if (!selectedFile) {
          toast.error('Pilih file terlebih dahulu!')
          setUploading(false)
          return
        }
        
        // Upload ke Storage
        const ext = selectedFile.name.split('.').pop()
        const path = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        finalUrl = await uploadFile('portfolio', path, selectedFile)
        captionText = selectedFile.name.split('.')[0]
        
      } else if (sourceType === 'embed') {
        if (!embedUrl.trim()) {
          toast.error('Masukkan link terlebih dahulu!')
          setUploading(false)
          return
        }
        finalUrl = embedUrl.trim()
        captionText = 'Embedded Media'
      }

      // Insert data ke Database
      const { error } = await supabase.from('gallery').insert([{
        url: finalUrl,
        type: mediaType,
        caption: captionText,
        created_at: new Date().toISOString()
      }])

      if (error) throw error

      toast.success('Media berhasil ditambahkan!')
      fetchItems()
      closeModal()
    } catch (error) {
      toast.error('Gagal menambahkan media')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setMediaType('photo')
    setSourceType('upload')
    setEmbedUrl('')
    setSelectedFile(null)
  }

  return (
    <div>
      {/* --- AREA HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Add Media
        </button>
      </div>

      {/* --- AREA DAFTAR GAMBAR --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800"
          >
            {item.type === 'video' ? (
              <video src={item.url} className="w-full h-full object-cover" controls={false} />
            ) : (
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => deleteItem(item.id)}
                className="p-2 rounded-full bg-red-600 text-white hover:scale-110 transition-transform"
                title="Delete Media"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="absolute top-2 right-2">
              {item.type === 'video' ? (
                <Video size={16} className="text-white drop-shadow-lg" />
              ) : (
                <ImageIcon size={16} className="text-white drop-shadow-lg" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6">Add New Media</h2>
            
            {/* 1. Pilih Tipe (Photo / Video) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Media Type</label>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setMediaType('photo')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    mediaType === 'photo' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent-purple' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  📷 Photo
                </button>
                <button
                  onClick={() => setMediaType('video')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    mediaType === 'video' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent-purple' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  🎥 Video
                </button>
              </div>
            </div>

            {/* 2. Pilih Sumber (Upload / Embed) */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Media Source</label>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setSourceType('upload')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    sourceType === 'upload' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  📤 Upload File
                </button>
                <button
                  onClick={() => setSourceType('embed')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    sourceType === 'embed' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  🔗 Embed Link
                </button>
              </div>
            </div>

            {/* 3. Input Area */}
            <div className="mb-8">
              {sourceType === 'upload' ? (
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative cursor-pointer ${
                  selectedFile ? 'border-accent-purple bg-accent-purple/5' : 'border-slate-300 dark:border-slate-700 hover:border-accent-purple'
                }`}>
                  <input
                    type="file"
                    accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center mb-2 text-accent-purple">
                          {mediaType === 'photo' ? <ImageIcon size={20} /> : <Video size={20} />}
                        </div>
                        <span className="font-bold text-sm truncate max-w-full px-2">{selectedFile.name}</span>
                        <span className="text-xs text-slate-500 mt-1">Ready to upload</span>
                      </div>
                    ) : (
                      <>
                        <Plus size={28} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold mb-1">Click to browse file</span>
                        <span className="text-xs font-medium text-amber-500 dark:text-amber-400">
                          {mediaType === 'photo' ? 'Maximum filesize 500KB' : 'Maximum filesize 20MB'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={embedUrl || ''}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-accent-purple/50 font-medium"
                  />
                  <span className="text-xs font-medium text-slate-500 mt-2 block">
                    Paste a direct {mediaType} URL (e.g. Google Drive Direct Link, CDN).
                  </span>
                </div>
              )}
            </div>

            {/* 4. Tombol Submit */}
            <button
              onClick={handleSubmitModal}
              disabled={uploading || (sourceType === 'upload' && !selectedFile) || (sourceType === 'embed' && (!embedUrl || !embedUrl.trim()))}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold hover:shadow-lg hover:shadow-accent-purple/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing...
                </>
              ) : (
                'Save Media'
              )}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}