import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ pro: false, error: 'Email required' }, { status: 400 });
    }

    // Search for active subscriptions by customer email
    const customers = await stripe.customers.list({ email, limit: 5 });

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 5,
      });

      if (subscriptions.data.length > 0) {
        return NextResponse.json({ pro: true });
      }
    }

    return NextResponse.json({ pro: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ pro: false, error: message }, { status: 500 });
  }
}
