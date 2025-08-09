# Gestão Confeitaria - SaaS

Sistema completo de gestão para confeitarias com autenticação Supabase, verificação de assinatura via Stripe e deploy automático.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Autenticação**: Supabase Auth
- **Pagamentos**: Stripe
- **Deploy**: Netlify (Frontend) + Supabase (Functions)

## 📋 Funcionalidades

### Landing Page
- Apresentação da solução
- Call-to-action para assinatura (R$ 19,90)
- Botão de entrada para login/registro

### Autenticação
- Login e registro via Supabase Auth
- Verificação automática de assinatura ativa
- Proteção de rotas do dashboard

### Dashboard (Apenas para assinantes)
- **Pedidos**: Criar e listar pedidos
- **Produtos**: Gerenciar catálogo de doces e bolos
- **Clientes**: Base de dados de clientes

### Edge Functions
- Verificação de assinatura ativa no Stripe
- API segura com CORS configurado

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example` com suas credenciais:

```bash
# Supabase
VITE_SUPABASE_URL=https://spiysylovejbzbgooccq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaXlzeWxvdmVqYnpiZ29vY2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NzI5MjYsImV4cCI6MjA3MDM0ODkyNn0.Ibat5AjRm-PakECI1_xe0PMQ29Wa3zKBPHp2UbXgA50
VITE_SUPABASE_FUNCTIONS_URL=https://spiysylovejbzbgooccq.supabase.co/functions/v1

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # ou pk_live_... para produção
```

### 2. Configurar Netlify

1. Acesse **Site settings → Build & deploy → Environment variables**
2. Adicione todas as variáveis do `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_FUNCTIONS_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

### 3. Configurar Supabase Functions

1. Acesse **Settings → Environment Variables** no painel Supabase
2. Adicione a variável:
   - `STRIPE_SECRET_KEY` = sua chave secreta do Stripe
   - `STRIPE_WEBHOOK_SECRET` = endpoint secret do webhook (opcional)

### 4. Configurar Stripe

1. **Criar Produto no Stripe**:
   - Acesse [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
   - Crie um produto "Gestão Confeitaria - Plano Mensal"
   - Defina preço recorrente de R$ 19,90/mês
   - Copie o Price ID (ex: `price_1234567890`)

2. **Atualizar Price ID**:
   - Edite `src/lib/stripe.ts` e substitua `STRIPE_PRICE_ID`
   - Edite `supabase/functions/create-checkout/index.ts` na linha do `line_items[0][price]`

3. **Configurar Webhook** (Opcional):
   - Acesse [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
   - Adicione endpoint: `https://spiysylovejbzbgooccq.supabase.co/functions/v1/stripe-webhook`
   - Selecione eventos: `customer.subscription.*`, `invoice.payment_*`
   - Copie o signing secret e adicione como `STRIPE_WEBHOOK_SECRET` no Supabase

### 5. Deploy das Edge Functions

```bash
# Instale a CLI do Supabase
npm install -g supabase

# Faça login
supabase auth login

# Deploy das funções
supabase functions deploy check-subscription --project-ref spiysylovejbzbgooccq
supabase functions deploy create-checkout --project-ref spiysylovejbzbgooccq
supabase functions deploy stripe-webhook --project-ref spiysylovejbzbgooccq
```

## 🏗️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint do código
npm run lint
```

## 📦 Deploy

### Frontend (Netlify)
1. Conecte seu repositório GitHub ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático em cada push para `main`

### Backend (Supabase Functions)
```bash
supabase functions deploy check-subscription --project-ref spiysylovejbzbgooccq
supabase functions deploy create-checkout --project-ref spiysylovejbzbgooccq
supabase functions deploy stripe-webhook --project-ref spiysylovejbzbgooccq
```

## 🔐 Fluxo de Autenticação

1. **Usuario faz login** → Supabase Auth
2. **Verifica assinatura** → Edge Function consulta Stripe
3. **Acesso liberado** → Dashboard ou página de assinatura

## 💳 Fluxo de Pagamento

1. **Usuário clica "Assinar"** → Cria sessão de checkout no Stripe
2. **Redireciona para Stripe** → Usuário completa pagamento
3. **Retorna com sucesso** → Página de confirmação
4. **Webhook atualiza status** → Sistema sincroniza automaticamente

## ⚠️ Regras Importantes

- ✅ **NUNCA** usar valores hardcoded no frontend
- ✅ **SEMPRE** usar variáveis com prefixo `VITE_` no frontend  
- ✅ **SEMPRE** redeployar após alterar `.env`
- ✅ SPA funcionando com redirect para `index.html`
- ✅ CORS habilitado nas Edge Functions
- ✅ **SEMPRE** usar Price ID real do Stripe em produção
- ✅ Configurar webhooks para sincronização automática

## 🛠️ Estrutura do Projeto

```
src/
├── components/
│   ├── LandingPage.tsx    # Página inicial
│   ├── PricingSection.tsx # Seção de preços
│   ├── LoginPage.tsx      # Autenticação
│   ├── Dashboard.tsx      # Painel principal
│   ├── SuccessPage.tsx    # Confirmação de pagamento
│   └── SubscriptionStatus.tsx # Status da assinatura
├── contexts/
│   └── AuthContext.tsx    # Contexto de autenticação
├── lib/
│   ├── stripe.ts          # Cliente Stripe
│   └── supabase.ts        # Cliente Supabase
└── App.tsx               # Router principal

supabase/
└── functions/
    └── check-subscription/
    │   └── index.ts       # Verificação de assinatura
    ├── create-checkout/
    │   └── index.ts       # Criação de checkout
    └── stripe-webhook/
        └── index.ts       # Webhook do Stripe
```

## 🔧 Próximos Passos

1. **Configure suas credenciais Stripe**:
   - Obtenha suas chaves em [dashboard.stripe.com](https://dashboard.stripe.com)
   - Crie um produto com preço recorrente
   - Atualize o Price ID no código

2. **Configure as variáveis de ambiente**:
   - No Supabase: `STRIPE_SECRET_KEY`
   - No Netlify: todas as variáveis `VITE_*`

3. **Deploy das funções**:
   ```bash
   supabase functions deploy check-subscription --project-ref spiysylovejbzbgooccq
   supabase functions deploy create-checkout --project-ref spiysylovejbzbgooccq
   ```

## 📞 Suporte

Para dúvidas sobre configuração ou desenvolvimento, consulte:
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Stripe](https://stripe.com/docs)
- [Guias Netlify](https://docs.netlify.com)