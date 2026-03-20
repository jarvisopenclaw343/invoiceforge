import { InvoiceData } from '@/types/invoice';

const INVOICES_KEY = 'invoiceforge_invoices';
const CLIENTS_KEY = 'invoiceforge_clients';
const USAGE_KEY = 'invoiceforge_usage';
const PRO_KEY = 'invoiceforge_pro';

export interface SavedClient {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface UsageData {
  month: string; // "YYYY-MM"
  count: number;
}

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getUsage(): UsageData {
  if (typeof window === 'undefined') return { month: currentMonth(), count: 0 };
  const raw = localStorage.getItem(USAGE_KEY);
  if (!raw) return { month: currentMonth(), count: 0 };
  const data: UsageData = JSON.parse(raw);
  if (data.month !== currentMonth()) return { month: currentMonth(), count: 0 };
  return data;
}

export function incrementUsage(): number {
  const usage = getUsage();
  const updated = { month: currentMonth(), count: usage.count + 1 };
  localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  return updated.count;
}

export function getSavedInvoices(): InvoiceData[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(INVOICES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveInvoice(invoice: InvoiceData): void {
  const invoices = getSavedInvoices();
  const idx = invoices.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) {
    invoices[idx] = invoice;
  } else {
    invoices.unshift(invoice);
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function getSavedClients(): SavedClient[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CLIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveClient(client: SavedClient): void {
  const clients = getSavedClients();
  const idx = clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) {
    clients[idx] = client;
  } else {
    clients.unshift(client);
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function deleteClient(id: string): void {
  const clients = getSavedClients().filter((c) => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function isPro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function setPro(value: boolean): void {
  localStorage.setItem(PRO_KEY, String(value));
}
