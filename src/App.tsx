import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LandingPage } from './components/LandingPage'
import { LoginPage } from './components/LoginPage'
import { Dashboard } from './components/Dashboard'
import { SuccessPage } from './components/SuccessPage'

function AppContent() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Check for success parameter from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('session_id') && user) {
      setShowSuccess(true)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (showSuccess) {
    return <SuccessPage onContinue={() => setShowSuccess(false)} />
  }

  if (user) {
    return <Dashboard />
  }

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} />
  }

  return <LandingPage onGetStarted={() => setShowLogin(true)} />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App