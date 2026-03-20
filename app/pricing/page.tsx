'use client';
import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FREE_FEATURES = [
  { text: '3 invoices per month', included: true },
  { text: '3 professional templates', included: true },
  { text: 'All currencies (USD, EUR, GBP, CAD, AUD, INR, JPY)', included: true },
  { text: 'Line items, tax & discount', included: true },
  { text: 'Download as PDF', included: true },
  { text: 'Save clients locally', included: true },
  { text: '"Powered by InvoiceForge" watermark', included: false },
  { text: 'Custom logo on invoices', included: false },
  { text: '6 premium templates', included: false },
  { text: 'Custom accent colors', included: false },
  { text: 'Recurring invoice templates', included: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited invoices per month', included: true },
  { text: 'No watermark on PDFs', included: true },
  { text: 'All 9 templates (3 free + 6 premium)', included: true },
  { text: 'All currencies', included: true },
  { text: 'Line items, tax & discount', included: true },
  { text: 'Custom logo on invoices', included: true },
  { text: 'Custom accent colors', included: true },
  { text: 'Save & manage client database', included: true },
  { text: 'Recurring invoice templates', included: true },
  { text: 'Due date reminders', included: true },
  { text: 'Priority support', included: true },
];

function FeatureLine({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <CheckIcon className="h-4 w-4 text-green-600 shrink-0" />
      ) : (
        <XMarkIcon className="h-4 w-4 text-gray-300 shrink-0" />
      )}
      <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{text}</span>
    </li>
  );
}

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    if (!email.trim()) { setError('Enter your email to continue'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Start free. Upgrade when you need more. No hidden fees, no annual lock-in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Free</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Perfect for occasional invoicing</p>
          </div>

          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map((f) => (
              <FeatureLine key={f.text} {...f} />
            ))}
          </ul>

          <a
            href="/"
            className="block w-full text-center rounded-xl border-2 border-blue-700 text-blue-700 font-semibold py-3 text-sm hover:bg-blue-50 transition-colors"
          >
            Get started free
          </a>
        </div>

        {/* Pro */}
        <div className="relative bg-blue-700 rounded-2xl p-8 shadow-xl overflow-hidden">
          <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1">Pro</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$6</span>
              <span className="text-blue-200 text-sm">/month</span>
            </div>
            <p className="text-sm text-blue-200 mt-2">For freelancers & small businesses</p>
          </div>

          <ul className="space-y-3 mb-8">
            {PRO_FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <CheckIcon className="h-4 w-4 text-blue-300 shrink-0" />
                <span className="text-sm text-blue-100">{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpgrade()}
              className="block w-full rounded-xl bg-white/10 border border-blue-500 px-4 py-2.5 text-sm text-white placeholder-blue-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
            {error && <p className="text-xs text-red-300">{error}</p>}
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full rounded-xl bg-white text-blue-700 font-bold py-3 text-sm hover:bg-blue-50 disabled:opacity-60 transition-colors shadow-md"
            >
              {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro →'}
            </button>
            <p className="text-xs text-blue-300 text-center">Billed monthly. Cancel anytime.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Frequently asked questions</h2>
        <div className="space-y-6">
          {[
            {
              q: 'Do I need to create an account?',
              a: 'No. InvoiceForge works without signup. Your data is stored in your browser. Pro users verify via email after checkout.',
            },
            {
              q: 'Where is my invoice data stored?',
              a: "Everything stays in your browser's localStorage. We don't store any invoice or client data on our servers.",
            },
            {
              q: 'Can I cancel my Pro subscription?',
              a: 'Yes, anytime. Cancel directly from your Stripe billing portal. You keep Pro access until the end of the billing period.',
            },
            {
              q: 'What payment methods are accepted?',
              a: 'All major credit/debit cards via Stripe. Apple Pay and Google Pay supported in compatible browsers.',
            },
            {
              q: 'What does "3 invoices/month" mean for Free?',
              a: 'You can download 3 PDF invoices per calendar month. The counter resets on the 1st of each month.',
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 pb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
