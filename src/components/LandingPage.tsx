import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, CheckCircle, Star, ArrowRight } from 'lucide-react'
import { PricingSection } from './PricingSection'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">Gestão Confeitaria</h1>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Controle fácil de pedidos, produtos e clientes para
              <span className="text-pink-600"> confeiteiros</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Organize sua confeitaria com facilidade. Gerencie pedidos, cadastre produtos 
              e mantenha seus clientes sempre satisfeitos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/login')}
                className="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Começar Agora</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sem compromisso</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Suporte dedicado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* Features */}
        <div className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ChefHat className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestão de Pedidos</h3>
              <p className="text-gray-600">
                Controle todos os seus pedidos em um só lugar. Acompanhe status, 
                prazos e mantenha seus clientes informados.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Catálogo de Produtos</h3>
              <p className="text-gray-600">
                Organize seu portfólio de doces e bolos. Cadastre preços, 
                ingredientes e mantenha tudo atualizado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Base de Clientes</h3>
              <p className="text-gray-600">
                Mantenha o histórico de todos os seus clientes. Preferences, 
                contatos e histórico de pedidos organizados.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}