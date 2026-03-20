'use client';
import { InvoiceData } from '@/types/invoice';
import { CurrencySelect } from './CurrencySelect';
import { LineItems } from './LineItems';
import { ClientManager } from './ClientManager';
import { SavedClient } from '@/lib/storage';

interface Props {
  invoice: InvoiceData;
  isPro: boolean;
  onChange: (invoice: InvoiceData) => void;
  onUpgrade: (reason: 'watermark' | 'templates') => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-600 mb-1">{children}</label>;
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none ${className}`}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
      <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">{title}</h3>
      {children}
    </div>
  );
}

const TEMPLATES = [
  { id: 'classic', label: 'Classic', desc: 'Clean & minimal', free: true },
  { id: 'modern', label: 'Modern', desc: 'Sidebar accent', free: true },
  { id: 'bold', label: 'Bold', desc: 'Dark header', free: true },
] as const;

export function InvoiceForm({ invoice, isPro, onChange, onUpgrade }: Props) {
  function set<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    onChange({ ...invoice, [key]: value });
  }

  function loadClient(c: SavedClient) {
    onChange({
      ...invoice,
      clientName: c.name,
      clientEmail: c.email,
      clientAddress: c.address,
      clientCity: c.city,
      clientState: c.state,
      clientZip: c.zip,
      clientCountry: c.country,
    });
  }

  return (
    <div className="space-y-4">
      {/* Invoice Meta */}
      <Section title="Invoice Details">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Invoice Number</Label>
            <Input value={invoice.invoiceNumber} onChange={(e) => set('invoiceNumber', e.target.value)} />
          </div>
          <div>
            <Label>Currency</Label>
            <CurrencySelect value={invoice.currency} onChange={(v) => set('currency', v)} />
          </div>
          <div>
            <Label>Issue Date</Label>
            <Input type="date" value={invoice.issueDate} onChange={(e) => set('issueDate', e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={invoice.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Payment Terms</Label>
          <Input
            placeholder="e.g. Net 30, Due on receipt"
            value={invoice.paymentTerms}
            onChange={(e) => set('paymentTerms', e.target.value)}
          />
        </div>
      </Section>

      {/* Sender */}
      <Section title="Your Business">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Business / Your Name</Label>
            <Input placeholder="Acme Studio" value={invoice.senderName} onChange={(e) => set('senderName', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input type="email" placeholder="hello@acme.com" value={invoice.senderEmail} onChange={(e) => set('senderEmail', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Address</Label>
            <Input placeholder="123 Main St" value={invoice.senderAddress} onChange={(e) => set('senderAddress', e.target.value)} />
          </div>
          <div>
            <Label>City</Label>
            <Input placeholder="New York" value={invoice.senderCity} onChange={(e) => set('senderCity', e.target.value)} />
          </div>
          <div>
            <Label>State / Province</Label>
            <Input placeholder="NY" value={invoice.senderState} onChange={(e) => set('senderState', e.target.value)} />
          </div>
          <div>
            <Label>ZIP / Postal</Label>
            <Input placeholder="10001" value={invoice.senderZip} onChange={(e) => set('senderZip', e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Input placeholder="United States" value={invoice.senderCountry} onChange={(e) => set('senderCountry', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Client */}
      <Section title="Bill To">
        <div className="flex items-center justify-between -mt-1 mb-1">
          <span />
          <ClientManager invoice={invoice} onLoad={loadClient} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Client Name</Label>
            <Input placeholder="Client Company" value={invoice.clientName} onChange={(e) => set('clientName', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input type="email" placeholder="billing@client.com" value={invoice.clientEmail} onChange={(e) => set('clientEmail', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Address</Label>
            <Input placeholder="456 Client Ave" value={invoice.clientAddress} onChange={(e) => set('clientAddress', e.target.value)} />
          </div>
          <div>
            <Label>City</Label>
            <Input value={invoice.clientCity} onChange={(e) => set('clientCity', e.target.value)} />
          </div>
          <div>
            <Label>State / Province</Label>
            <Input value={invoice.clientState} onChange={(e) => set('clientState', e.target.value)} />
          </div>
          <div>
            <Label>ZIP / Postal</Label>
            <Input value={invoice.clientZip} onChange={(e) => set('clientZip', e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Input value={invoice.clientCountry} onChange={(e) => set('clientCountry', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Line Items */}
      <Section title="Line Items">
        <LineItems
          items={invoice.lineItems}
          currency={invoice.currency}
          onChange={(items) => set('lineItems', items)}
        />
      </Section>

      {/* Taxes & Discounts */}
      <Section title="Tax & Discount">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tax</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={invoice.taxRate}
                onChange={(e) => set('taxRate', parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <select
                value={invoice.taxType}
                onChange={(e) => set('taxType', e.target.value as 'percent' | 'fixed')}
                className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="percent">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Discount</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={invoice.discountRate}
                onChange={(e) => set('discountRate', parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <select
                value={invoice.discountType}
                onChange={(e) => set('discountType', e.target.value as 'percent' | 'fixed')}
                className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="percent">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notes">
        <Textarea
          rows={3}
          placeholder="Payment instructions, thank you note, bank details…"
          value={invoice.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </Section>

      {/* Template */}
      <Section title="Template">
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((t) => {
            const locked = !t.free && !isPro;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  if (locked) { onUpgrade('templates'); return; }
                  set('template', t.id as InvoiceData['template']);
                }}
                className={`relative rounded-lg border-2 p-3 text-left transition-all ${
                  invoice.template === t.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-semibold text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                {locked && (
                  <span className="absolute top-1.5 right-1.5 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">Pro</span>
                )}
              </button>
            );
          })}
        </div>

        {isPro && (
          <div className="mt-3">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={invoice.accentColor}
                onChange={(e) => set('accentColor', e.target.value)}
                className="h-9 w-14 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-sm text-gray-500">{invoice.accentColor}</span>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
