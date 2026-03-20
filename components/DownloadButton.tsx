'use client';
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import { PDFDocument } from './PDFDocument';
import { getUsage, incrementUsage } from '@/lib/storage';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const FREE_LIMIT = 3;

interface Props {
  invoice: InvoiceData;
  isPro: boolean;
  onUpgradeNeeded: () => void;
}

export function DownloadButton({ invoice, isPro, onUpgradeNeeded }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!isPro) {
      const usage = getUsage();
      if (usage.count >= FREE_LIMIT) {
        onUpgradeNeeded();
        return;
      }
    }

    setLoading(true);
    try {
      const doc = <PDFDocument invoice={invoice} isPro={isPro} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber || 'invoice'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      if (!isPro) {
        incrementUsage();
      }
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setLoading(false);
    }
  }

  const usage = typeof window !== 'undefined' ? getUsage() : { count: 0 };
  const remaining = Math.max(0, FREE_LIMIT - usage.count);

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 w-full justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors shadow-sm"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        {loading ? 'Generating PDF…' : 'Download PDF'}
      </button>
      {!isPro && (
        <p className="text-center text-xs text-gray-500">
          {remaining} free download{remaining !== 1 ? 's' : ''} remaining this month
        </p>
      )}
    </div>
  );
}
