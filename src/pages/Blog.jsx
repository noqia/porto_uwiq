import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Clock, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { SectionReveal } from '../components/shared/SectionReveal'
import { supabase } from '../services/supabaseClient'

const categories = ['All', 'Creative Writing', 'Content Strategy', 'UX Writing', 'Fiction', 'SEO']

export const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = posts.filter(post => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = posts[0]
  const trending = posts.slice(1, 4)

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <SectionReveal>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">The Blog</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mb-12">
            Thoughts on writing, creativity, and the craft of storytelling.
          </p>
        </SectionReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search */}
            <SectionReveal>
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-accent-purple outline-none"
                />
              </div>
            </SectionReveal>

            {/* Categories */}
            <SectionReveal>
              <div className="flex gap-2 flex-wrap mb-12">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-accent-purple text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </SectionReveal>

            {/* Featured Post */}
            {featured && !searchQuery && activeCategory === 'All' && (
              <SectionReveal>
                <Link to={`/blog/${featured.slug}`} className="block mb-12 group">
                  <div className="relative overflow-hidden rounded-3xl aspect-[21/9] mb-6">
                    <img
                      src={featured.thumbnail || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80'}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="px-3 py-1 rounded-full bg-accent-purple text-white text-xs font-medium mb-3 inline-block">
                        {featured.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{featured.title}</h2>
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(featured.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {featured.read_time || '5 min'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            )}

            {/* Posts List */}
            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-12">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No posts found.</div>
              ) : (
                filtered.map((post, index) => (
                  <SectionReveal key={post.id} delay={index * 0.1}>
                    <Link to={`/blog/${post.slug}`} className="flex flex-col md:flex-row gap-6 group">
                      <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                        <img
                          src={post.thumbnail || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-accent-purple text-sm font-medium">{post.category}</span>
                          <span className="text-slate-400 text-sm">•</span>
                          <span className="text-slate-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-purple transition-colors">{post.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={14} /> {post.read_time || '5 min read'}</span>
                        </div>
                      </div>
                    </Link>
                  </SectionReveal>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <SectionReveal>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-accent-orange" />
                    Trending Now
                  </h3>
                  <div className="space-y-4">
                    {trending.map((post, i) => (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-4 group">
                        <span className="text-2xl font-bold text-slate-200 dark:text-slate-800">0{i + 1}</span>
                        <div>
                          <h4 className="font-medium text-sm group-hover:text-accent-purple transition-colors line-clamp-2">{post.title}</h4>
                          <span className="text-xs text-slate-500">{post.read_time || '5 min'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Newsletter</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Get the latest writing tips and stories delivered to your inbox.</p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none mb-3 text-sm"
                  />
                  <button className="w-full py-3 rounded-xl bg-accent-purple text-white font-medium text-sm hover:scale-105 transition-transform">
                    Subscribe
                  </button>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}