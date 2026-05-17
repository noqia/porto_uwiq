import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ScrollProgress } from '../components/shared/ScrollProgress'
import { CursorGlow } from '../components/shared/CursorGlow'
import { Toaster } from 'react-hot-toast'

export const MainLayout = () => {
  return (
    <div className="relative min-h-screen">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
        }
      }} />
    </div>
  )
}