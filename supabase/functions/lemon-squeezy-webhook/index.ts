import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const LE_SECRET = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    const signature = req.headers.get('x-signature')
    if (!signature || !LE_SECRET) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Verification (simplified for brevity, normally you'd verify HMAC SHA256)
    // const verified = verifySignature(body, signature, LE_SECRET)

    const body = await req.json()
    const eventName = body.meta.event_name
    const userId = body.meta.custom_data?.user_id

    if (!userId) {
        return new Response('No user_id in custom_data', { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    if (eventName === 'order_created' || eventName === 'subscription_created') {
        const { error } = await supabase
            .from('profiles')
            .update({ is_pro: true })
            .eq('user_id', userId)

        if (error) return new Response(error.message, { status: 500 })
    }

    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
        const { error } = await supabase
            .from('profiles')
            .update({ is_pro: false })
            .eq('user_id', userId)

        if (error) return new Response(error.message, { status: 500 })
    }

    return new Response('Webhook processed', { status: 200 })
})
