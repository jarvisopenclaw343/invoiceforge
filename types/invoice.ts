export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoicePrefix: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  template: 'classic' | 'modern' | 'bold';
  accentColor: string;

  // Sender
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderZip: string;
  senderCountry: string;
  logoUrl?: string;

  // Client
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientCountry: string;

  // Items
  lineItems: LineItem[];

  // Totals
  taxRate: number;
  taxType: 'percent' | 'fixed';
  discountRate: number;
  discountType: 'percent' | 'fixed';

  // Notes
  notes: string;
  paymentTerms: string;
}

export function computeTotals(invoice: InvoiceData) {
  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const discount =
    invoice.discountType === 'percent'
      ? subtotal * (invoice.discountRate / 100)
      : invoice.discountRate;

  const taxable = subtotal - discount;

  const tax =
    invoice.taxType === 'percent'
      ? taxable * (invoice.taxRate / 100)
      : invoice.taxRate;

  const total = taxable + tax;

  return { subtotal, discount, tax, total };
}
