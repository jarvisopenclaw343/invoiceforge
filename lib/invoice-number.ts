const COUNTER_KEY = 'invoiceforge_counter';

export function getNextInvoiceNumber(prefix: string = 'INV'): string {
  if (typeof window === 'undefined') return `${prefix}-001`;
  const raw = localStorage.getItem(COUNTER_KEY);
  const count = raw ? parseInt(raw, 10) + 1 : 1;
  localStorage.setItem(COUNTER_KEY, String(count));
  return `${prefix}-${String(count).padStart(3, '0')}`;
}

export function peekNextInvoiceNumber(prefix: string = 'INV'): string {
  if (typeof window === 'undefined') return `${prefix}-001`;
  const raw = localStorage.getItem(COUNTER_KEY);
  const count = raw ? parseInt(raw, 10) + 1 : 1;
  return `${prefix}-${String(count).padStart(3, '0')}`;
}
