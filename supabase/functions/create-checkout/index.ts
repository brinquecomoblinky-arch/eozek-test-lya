const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RequestPayload {
  email: string
  returnUrl: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, returnUrl }: RequestPayload = await req.json()
    
    if (!email || !returnUrl) {
      return new Response(
        JSON.stringify({ error: 'Email and returnUrl are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Stripe configuration missing' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create or retrieve customer
    let customerId: string

    // Search for existing customer
    const customersResponse = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      }
    )

    if (!customersResponse.ok) {
      throw new Error('Failed to search for customer')
    }

    const customersData = await customersResponse.json()

    if (customersData.data.length > 0) {
      customerId = customersData.data[0].id
    } else {
      // Create new customer
      const createCustomerResponse = await fetch(
        'https://api.stripe.com/v1/customers',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email: email,
          }),
        }
      )

      if (!createCustomerResponse.ok) {
        throw new Error('Failed to create customer')
      }

      const customerData = await createCustomerResponse.json()
      customerId = customerData.id
    }

    // Create checkout session
    const checkoutResponse = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'customer': customerId,
          'payment_method_types[]': 'card',
          'line_items[0][price]': 'price_1RuK3QB1cuFGKX9IjagAjcO0', // Replace with your actual price ID from Stripe Dashboard
          'line_items[0][quantity]': '1',
          'mode': 'subscription',
          'success_url': `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
          'cancel_url': returnUrl,
          'allow_promotion_codes': 'true',
          'billing_address_collection': 'required',
        }),
      }
    )

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.text()
      console.error('Stripe checkout error:', errorData)
      throw new Error('Failed to create checkout session')
    }

    const checkoutData = await checkoutResponse.json()

    return new Response(
      JSON.stringify({ sessionId: checkoutData.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in create-checkout function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})