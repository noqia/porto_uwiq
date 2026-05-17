import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { LenisProvider } from './components/shared/LenisProvider'
import { LoadingScreen } from './components/shared/LoadingScreen'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <LoadingScreen>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LenisProvider>
              <AppRoutes />
            </LenisProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </LoadingScreen>
  )
}

export default App