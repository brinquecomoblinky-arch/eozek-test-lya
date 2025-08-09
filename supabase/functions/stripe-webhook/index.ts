const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables')
      return new Response('Webhook configuration missing', { status: 500 })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    if (!signature) return new Response('Missing signature', { status: 400 })

    // 🔹 Validação da assinatura (igual ao seu código)
    const encoder = new TextEncoder()
    const data = encoder.encode(body)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const elements = signature.split(',')
    let timestamp = ''
    let signatures: string[] = []
    for (const element of elements) {
      const [k, value] = element.split('=')
      if (k === 't') timestamp = value
      else if (k === 'v1') signatures.push(value)
    }

    const payload = timestamp + '.' + body
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    )
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    const isValid = signatures.some(sig => sig === expectedSignatureHex)
    if (!isValid) return new Response('Invalid signature', { status: 400 })

    // 🔹 Parse do evento
    const event = JSON.parse(body)
    console.log('Received webhook event:', event.type)

    // Função pra atualizar status no Supabase
    async function updateSubscription(email: string, status: string) {
      const { status: resStatus, statusText } = await fetch(
        `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'PATCH',
          headers: {
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({ subscription_status: status })
        }
      )
      console.log(`Updated ${email} to ${status}:`, resStatus, statusText)
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const email = event.data.object.customer_email
        if (email) await updateSubscription(email, 'active')
        break
      }
      case 'customer.subscription.deleted': {
        const email = event.data.object.customer_email
        if (email) await updateSubscription(email, 'inactive')
        break
      }
      case 'invoice.payment_failed': {
        const email = event.data.object.customer_email
        if (email) await updateSubscription(email, 'inactive')
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)