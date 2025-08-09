import React from 'react'
import { Crown, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function SubscriptionStatus() {
  const { hasActiveSubscription, user } = useAuth()

  if (!user) return null

  return (
    <div className={`p-4 rounded-lg border ${
      hasActiveSubscription 
        ? 'bg-green-50 border-green-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center space-x-3">
        {hasActiveSubscription ? (
          <>
            <Crown className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Assinatura Ativa
              </p>
              <p className="text-xs text-green-600">
                Você tem acesso completo ao sistema
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Assinatura Necessária
              </p>
              <p className="text-xs text-yellow-600">
                Assine para acessar todas as funcionalidades
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}