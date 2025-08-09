import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LandingPage } from './components/LandingPage'
import { LoginPage } from './components/LoginPage'
import { Dashboard } from './components/Dashboard'
import { SuccessPage } from './components/SuccessPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [assinaturaAtiva, setAssinaturaAtiva] = useState<boolean | null>(null)

  // Função para verificar assinatura
  async function verificarAssinatura(email: string) {
    try {
      const response = await fetch(
        "https://spiysylovejbzbgooccq.supabase.co/functions/v1/check-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY // sua anon key no .env
          },
          body: JSON.stringify({ email })
        }
      )
      const data = await response.json()
      setAssinaturaAtiva(data.hasActiveSubscription)
    } catch (err) {
      console.error("Erro ao verificar assinatura:", err)
      setAssinaturaAtiva(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      verificarAssinatura(user.email)
    }
  }, [user])

  if (loading || assinaturaAtiva === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!assinaturaAtiva) {
    return <Navigate to="/landing" replace />
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
