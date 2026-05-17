import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Eye, TrendingUp } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass rounded-2xl p-6"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon className="text-white" size={24} />
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-slate-500 text-sm">{label}</div>
  </motion.div>
)

export const Dashboard = () => {
  const [stats, setStats] = useState({ blogs: 0, gallery: 0, views: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Kita tambahkan request ke-3 untuk mengambil kolom views dari semua blog
      const [
        { count: blogs }, 
        { count: gallery },
        { data: blogsData } 
      ] = await Promise.all([
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('blogs').select('views') // Mengambil data view saja untuk dihitung
      ])

      // Menghitung total seluruh views dari array blogsData
      const totalViews = blogsData?.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0

      // Memasukkan hasil hitungan ke dalam state
      setStats({ 
        blogs: blogs || 0, 
        gallery: gallery || 0, 
        views: totalViews // Angka 1240 dihapus, diganti dengan total aktual
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={FileText} label="Total Blogs" value={stats.blogs} color="bg-accent-purple" />
        <StatCard icon={Image} label="Gallery Items" value={stats.gallery} color="bg-accent-blue" />
        <StatCard icon={Eye} label="Total Views" value={stats.views.toLocaleString()} color="bg-accent-pink" />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-accent-green" />
          Recent Activity
        </h2>
        <p className="text-slate-500">Welcome to your admin dashboard. Use the sidebar to manage your content.</p>
      </div>
    </div>
  )
}