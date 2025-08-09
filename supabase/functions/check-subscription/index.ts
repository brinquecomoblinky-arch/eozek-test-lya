const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RequestPayload {
  email: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email }: RequestPayload = await req.json()
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
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
        JSON.stringify({ hasActiveSubscription: false }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Search for customer by email
    const customersResponse = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!customersResponse.ok) {
      console.error('Failed to fetch customers from Stripe')
      return new Response(
        JSON.stringify({ hasActiveSubscription: false }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const customersData = await customersResponse.json()
    
    if (customersData.data.length === 0) {
      // No customer found with this email
      return new Response(
        JSON.stringify({ hasActiveSubscription: false }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check for active subscriptions for each customer (in case of multiple customers with same email)
    let hasActiveSubscription = false

    for (const customer of customersData.data) {
      const subscriptionsResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=active`,
        {
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json()
        if (subscriptionsData.data.length > 0) {
          hasActiveSubscription = true
          break
        }
      }
    }

    return new Response(
      JSON.stringify({ hasActiveSubscription }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in check-subscription function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        hasActiveSubscription: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})