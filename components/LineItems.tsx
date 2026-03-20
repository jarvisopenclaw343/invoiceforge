'use client';
import { LineItem } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  items: LineItem[];
  currency: string;
  onChange: (items: LineItem[]) => void;
}

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 };
}

export function LineItems({ items, currency, onChange }: Props) {
  function update(id: string, field: keyof LineItem, value: string | number) {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function remove(id: string) {
    if (items.length === 1) return; // always keep at least one row
    onChange(items.filter((i) => i.id !== id));
  }

  function add() {
    onChange([...items, newItem()]);
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_100px_36px] gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
        <span>Description</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr_80px_100px_100px_36px] gap-2 items-center">
          <input
            type="text"
            placeholder="Description"
            value={item.description}
            onChange={(e) => update(item.id, 'description', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.quantity}
            onChange={(e) => update(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            className="block w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.rate}
            onChange={(e) => update(item.id, 'rate', parseFloat(e.target.value) || 0)}
            className="block w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-right text-sm font-medium text-gray-700 tabular-nums pr-1">
            {formatCurrency(item.quantity * item.rate, currency)}
          </div>
          <button
            type="button"
            onClick={() => remove(item.id)}
            disabled={items.length === 1}
            className="flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="mt-2 flex items-center gap-1.5 text-sm text-blue-700 font-medium hover:text-blue-900 transition-colors"
      >
        <PlusIcon className="h-4 w-4" />
        Add line item
      </button>
    </div>
  );
}
