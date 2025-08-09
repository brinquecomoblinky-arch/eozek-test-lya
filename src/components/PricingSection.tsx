import React, { useState } from 'react'
import { Check, Loader2, CreditCard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { stripe, MONTHLY_PRICE } from '../lib/stripe'

interface PricingSectionProps {
  onLoginRequired: () => void
}

export function PricingSection({ onLoginRequired }: PricingSectionProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      onLoginRequired()
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          email: user.email,
          returnUrl: window.location.origin
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripeInstance = await stripe
      
      if (stripeInstance) {
        const { error } = await stripeInstance.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe redirect error:', error)
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Erro ao processar assinatura. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Gestão completa de pedidos',
    'Catálogo de produtos ilimitado',
    'Base de dados de clientes',
    'Relatórios de vendas',
    'Suporte prioritário',
    'Atualizações automáticas'
  ]

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Plano Profissional
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Tudo que você precisa para gerenciar sua confeitaria
        </p>

        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              R$ {MONTHLY_PRICE.toFixed(2)}
              <span className="text-lg font-normal text-gray-600">/mês</span>
            </div>
            <p className="text-gray-600">Cancele quando quiser</p>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Assinar Agora</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Pagamento seguro processado pelo Stripe
          </p>
        </div>
      </div>
    </div>
  )
}