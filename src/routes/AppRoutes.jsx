import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { Home } from '../pages/Home'
import { About } from '../pages/About'
import { Work } from '../pages/Work'
import { Blog } from '../pages/Blog'
import { BlogDetail } from '../pages/BlogDetail'
import { Portfolio } from '../pages/Portfolio'
import { Gallery } from '../pages/Gallery'
import { Login } from '../pages/Admin/Login'
import { Dashboard } from '../pages/Admin/Dashboard'
import { ManageBlog } from '../pages/Admin/ManageBlog'
import { Editor } from '../pages/Admin/Editor'
import { ManageGallery } from '../pages/Admin/ManageGallery'
import { ProjectDetail } from '../pages/ProjectDetail'
import { ManageWork } from '../pages/Admin/ManageWork'
import { WorkEditor } from '../pages/Admin/WorkEditor'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:id" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/gallery" element={<Gallery />} />
      </Route>

      {/* Admin Login - Public */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Dashboard - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="blogs" element={<ManageBlog />} />
        <Route path="blogs/new" element={<Editor />} />
        <Route path="blogs/edit/:id" element={<Editor />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="works" element={<ManageWork />} />
        <Route path="works/new" element={<WorkEditor />} />
        <Route path="works/edit/:id" element={<WorkEditor />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}