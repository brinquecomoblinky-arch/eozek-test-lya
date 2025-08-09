import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function SuccessPage() {
  const navigate = useNavigate()
  const { checkSubscription } = useAuth()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifySubscription = async () => {
      // Wait a moment for Stripe to process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check subscription status
      await checkSubscription()
      setVerifying(false)
    }

    verifySubscription()
  }, [checkSubscription])

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verificando Assinatura
          </h2>
          <p className="text-gray-600">
            Aguarde enquanto confirmamos seu pagamento...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Assinatura Confirmada!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Parabéns! Sua assinatura foi ativada com sucesso. 
          Agora você tem acesso completo ao sistema de gestão da sua confeitaria.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2 w-full"
        >
          <span>Acessar Dashboard</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}