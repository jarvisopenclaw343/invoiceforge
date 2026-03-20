'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { InvoiceData } from '@/types/invoice';
import { InvoiceForm } from '@/components/InvoiceForm';
import { DownloadButton } from '@/components/DownloadButton';
import { UpgradeModal } from '@/components/UpgradeModal';
import { isPro, setPro } from '@/lib/storage';
import { peekNextInvoiceNumber } from '@/lib/invoice-number';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const InvoicePreview = dynamic(
  () => import('@/components/InvoicePreview').then((m) => m.InvoicePreview),
  { ssr: false, loading: () => <PreviewPlaceholder /> }
);

function PreviewPlaceholder() {
  return (
    <div className="w-full h-full min-h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading preview…</p>
      </div>
    </div>
  );
}

function defaultInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return {
    id: crypto.randomUUID(),
    invoiceNumber: 'INV-001',
    invoicePrefix: 'INV',
    issueDate: fmt(today),
    dueDate: fmt(due),
    currency: 'USD',
    template: 'classic',
    accentColor: '#1e40af',
    senderName: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    senderCountry: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: '',
    clientState: '',
    clientZip: '',
    clientCountry: '',
    lineItems: [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    taxType: 'percent',
    discountRate: 0,
    discountType: 'percent',
    notes: '',
    paymentTerms: 'Net 30',
  };
}

function VerifyProBanner({ onVerified }: { onVerified: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function verify() {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.pro) {
      setPro(true);
      onVerified();
    } else {
      setError('No active Pro subscription found for this email.');
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-800">Already a Pro member?</p>
        <p className="text-xs text-blue-600 mt-0.5">Enter your email to unlock Pro features</p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && verify()}
          placeholder="your@email.com"
          className="flex-1 sm:w-52 rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
        />
        <button
          onClick={verify}
          disabled={loading}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors"
        >
          {loading ? '…' : 'Verify'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 w-full">{error}</p>}
    </div>
  );
}

function InnerPage() {
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [proStatus, setProStatus] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<{
    open: boolean;
    reason: 'limit' | 'watermark' | 'templates';
  }>({ open: false, reason: 'limit' });

  useEffect(() => {
    const inv = defaultInvoice();
    inv.invoiceNumber = peekNextInvoiceNumber('INV');
    setInvoice(inv);
    setProStatus(isPro());
    if (searchParams.get('upgraded') === 'true') {
      setPro(true);
      setProStatus(true);
    }
  }, [searchParams]);

  const handleChange = useCallback((updated: InvoiceData) => {
    setInvoice(updated);
  }, []);

  if (!invoice) return null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 pt-4 space-y-3">
        {proStatus ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-green-800 font-medium">
              Pro plan active — unlimited invoices, no watermark
            </span>
          </div>
        ) : (
          <VerifyProBanner onVerified={() => setProStatus(true)} />
        )}
      </div>

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <InvoiceForm
            invoice={invoice}
            isPro={proStatus}
            onChange={handleChange}
            onUpgrade={(reason) => setUpgradeModal({ open: true, reason })}
          />
          <div className="pt-2 pb-10">
            <DownloadButton
              invoice={invoice}
              isPro={proStatus}
              onUpgradeNeeded={() => setUpgradeModal({ open: true, reason: 'limit' })}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="hidden lg:flex lg:flex-col lg:sticky lg:top-20 lg:self-start" style={{ height: 'calc(100vh - 6rem)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</span>
            {!proStatus && (
              <button
                onClick={() => setUpgradeModal({ open: true, reason: 'watermark' })}
                className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
              >
                Remove watermark →
              </button>
            )}
          </div>
          <div className="flex-1 min-h-0">
            <InvoicePreview invoice={invoice} isPro={proStatus} />
          </div>
        </div>
      </div>

      <UpgradeModal
        open={upgradeModal.open}
        reason={upgradeModal.reason}
        onClose={() => setUpgradeModal((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <InnerPage />
    </Suspense>
  );
}
