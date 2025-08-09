const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!stripeSecretKey || !webhookSecret) {
      console.error('Missing Stripe configuration')
      return new Response('Webhook configuration missing', { status: 500 })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return new Response('Missing signature', { status: 400 })
    }

    // Verify webhook signature
    const encoder = new TextEncoder()
    const data = encoder.encode(body)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Parse signature
    const elements = signature.split(',')
    let timestamp = ''
    let signatures: string[] = []

    for (const element of elements) {
      const [key, value] = element.split('=')
      if (key === 't') {
        timestamp = value
      } else if (key === 'v1') {
        signatures.push(value)
      }
    }

    // Create expected signature
    const payload = timestamp + '.' + body
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    )

    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Verify signature
    const isValid = signatures.some(sig => sig === expectedSignatureHex)

    if (!isValid) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { status: 400 })
    }

    // Parse event
    const event = JSON.parse(body)
    console.log('Received webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        console.log(`Subscription ${event.type}:`, event.data.object.id)
        // Here you could update your database with subscription status
        break
      
      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break
      
      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break
      
      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})