'use client';
import dynamic from 'next/dynamic';
import { InvoiceData } from '@/types/invoice';

// PDFViewer must be client-only (no SSR)
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <PreviewSkeleton /> }
);

const PDFDocumentDynamic = dynamic(
  () => import('./PDFDocument').then((mod) => mod.PDFDocument),
  { ssr: false }
);

function PreviewSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
      <div className="text-sm text-gray-400">Loading preview…</div>
    </div>
  );
}

interface Props {
  invoice: InvoiceData;
  isPro: boolean;
}

export function InvoicePreview({ invoice, isPro }: Props) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
      <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
        <PDFDocumentDynamic invoice={invoice} isPro={isPro} />
      </PDFViewer>
    </div>
  );
}
