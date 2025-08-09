import React, { useState } from 'react'
import { ChefHat, LogOut, Package, Users, ShoppingCart, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SubscriptionStatus } from './SubscriptionStatus'
import { PricingSection } from './PricingSection'

type Tab = 'pedidos' | 'produtos' | 'clientes'

interface Order {
  id: string
  cliente: string
  produto: string
  valor: number
  status: 'pendente' | 'em_andamento' | 'concluido'
  data: string
}

interface Product {
  id: string
  nome: string
  preco: number
  descricao: string
}

interface Client {
  id: string
  nome: string
  email: string
  telefone: string
}

export function Dashboard() {
  const { user, signOut, hasActiveSubscription } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('pedidos')

  // Sample data - in real app would come from Supabase
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', cliente: 'Maria Silva', produto: 'Bolo de Chocolate', valor: 45.00, status: 'pendente', data: '2024-01-15' },
    { id: '2', cliente: 'João Santos', produto: 'Torta de Limão', valor: 35.00, status: 'em_andamento', data: '2024-01-14' },
  ])

  const [products, setProducts] = useState<Product[]>([
    { id: '1', nome: 'Bolo de Chocolate', preco: 45.00, descricao: 'Bolo de chocolate com cobertura' },
    { id: '2', nome: 'Torta de Limão', preco: 35.00, descricao: 'Torta cremosa de limão' },
  ])

  const [clients, setClients] = useState<Client[]>([
    { id: '1', nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999' },
    { id: '2', nome: 'João Santos', email: 'joao@email.com', telefone: '(11) 88888-8888' },
  ])

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Assinatura Necessária</h2>
            <p className="text-gray-600 mb-6">
              Você precisa de uma assinatura ativa para acessar o dashboard.
            </p>
          </div>
          <PricingSection onLoginRequired={() => {}} />
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'pedidos' as Tab, name: 'Pedidos', icon: ShoppingCart },
    { id: 'produtos' as Tab, name: 'Produtos', icon: Package },
    { id: 'clientes' as Tab, name: 'Clientes', icon: Users },
  ]

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'em_andamento': return 'bg-blue-100 text-blue-800'
      case 'concluido': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderPedidos = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Novo Pedido</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Cliente"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Produto"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Valor"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.produto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {order.valor.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderProdutos = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Novo Produto</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nome do produto"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Preço"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Descrição"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2">{product.nome}</h4>
            <p className="text-gray-600 mb-3">{product.descricao}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-pink-600">R$ {product.preco.toFixed(2)}</span>
              <button className="text-gray-400 hover:text-gray-600">
                <Package className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderClientes = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Novo Cliente</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="tel"
            placeholder="Telefone"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Lista de Clientes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {clients.map((client) => (
            <div key={client.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{client.nome}</h4>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{client.telefone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'pedidos': return renderPedidos()
      case 'produtos': return renderProdutos()
      case 'clientes': return renderClientes()
      default: return renderPedidos()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-pink-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestão Confeitaria</h1>
                <p className="text-sm text-gray-500">Olá, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-600 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <SubscriptionStatus />
        </div>
        {renderContent()}
      </main>
    </div>
  )
}