'use client';
import { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Props {
  open: boolean;
  onClose: () => void;
  reason?: 'limit' | 'watermark' | 'templates';
}

const PRO_FEATURES = [
  'Unlimited invoices per month',
  'No "Powered by InvoiceForge" watermark',
  'Custom logo on invoices',
  '6 premium templates',
  'Custom accent colors',
  'Save & manage client database',
  'Recurring invoice templates',
  'Due date reminders',
];

export function UpgradeModal({ open, onClose, reason = 'limit' }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleUpgrade() {
    if (!email.trim()) { setError('Enter your email'); return; }
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
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const headlines: Record<string, string> = {
    limit: "You've used your 3 free invoices this month",
    watermark: 'Remove the watermark with Pro',
    templates: 'Unlock all templates with Pro',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Blue accent top */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-800" />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{headlines[reason]}</h2>
            <p className="mt-1 text-sm text-gray-500">Upgrade to Pro for just $6/month</p>
          </div>

          <ul className="space-y-2 mb-6">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                <CheckIcon className="h-4 w-4 text-blue-600 shrink-0" />
                {f}
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
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Redirecting…' : 'Upgrade to Pro — $6/mo'}
            </button>
            <button
              onClick={onClose}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
