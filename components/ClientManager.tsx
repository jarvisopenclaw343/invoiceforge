'use client';
import { useState, useEffect } from 'react';
import { getSavedClients, saveClient, deleteClient, SavedClient } from '@/lib/storage';
import { InvoiceData } from '@/types/invoice';

interface Props {
  invoice: InvoiceData;
  onLoad: (client: SavedClient) => void;
}

export function ClientManager({ invoice, onLoad }: Props) {
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setClients(getSavedClients());
  }, [open]);

  function handleSave() {
    if (!invoice.clientName.trim()) return;
    const client: SavedClient = {
      id: crypto.randomUUID(),
      name: invoice.clientName,
      email: invoice.clientEmail,
      address: invoice.clientAddress,
      city: invoice.clientCity,
      state: invoice.clientState,
      zip: invoice.clientZip,
      country: invoice.clientCountry,
    };
    saveClient(client);
    setClients(getSavedClients());
  }

  function handleDelete(id: string) {
    deleteClient(id);
    setClients(getSavedClients());
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-700 font-medium hover:text-blue-900 transition-colors"
      >
        {open ? 'Close' : 'Saved clients'}
      </button>

      {open && (
        <div className="absolute z-20 left-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saved Clients</span>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 transition-colors"
            >
              Save current
            </button>
          </div>
          {clients.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">No saved clients yet</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-50">
              {clients.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() => { onLoad(c); setOpen(false); }}
                  >
                    <div className="text-sm font-medium text-gray-800">{c.name}</div>
                    {c.email && <div className="text-xs text-gray-500">{c.email}</div>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="ml-2 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
