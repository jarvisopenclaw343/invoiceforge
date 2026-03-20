'use client';
import { InvoiceData } from '@/types/invoice';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { BoldTemplate } from './templates/BoldTemplate';

interface Props {
  invoice: InvoiceData;
  isPro?: boolean;
}

export function PDFDocument({ invoice, isPro = false }: Props) {
  switch (invoice.template) {
    case 'modern':
      return <ModernTemplate invoice={invoice} isPro={isPro} />;
    case 'bold':
      return <BoldTemplate invoice={invoice} isPro={isPro} />;
    default:
      return <ClassicTemplate invoice={invoice} isPro={isPro} />;
  }
}
