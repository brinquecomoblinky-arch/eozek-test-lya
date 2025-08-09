import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LandingPage } from './components/LandingPage'
import { LoginPage } from './components/LoginPage'
import { Dashboard } from './components/Dashboard'
import { SuccessPage } from './components/SuccessPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AppContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Check for success parameter from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    if (urlParams.get('session_id') && user) {
      navigate('/success', { replace: true })
    }
  }, [user, location.search, navigate])

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/success" element={
        <ProtectedRoute>
          <SuccessPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App