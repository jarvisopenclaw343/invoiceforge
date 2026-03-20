import Link from 'next/link';
import { CheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, minimal layout with blue header. Works for any industry.',
    tags: ['Minimal', 'Professional'],
    free: true,
    color: '#1e40af',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Accent sidebar with key details. Great for creative professionals.',
    tags: ['Creative', 'Bold'],
    free: true,
    color: '#7c3aed',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Dark header with strong visual impact. Stand out from the crowd.',
    tags: ['Dark', 'Impactful'],
    free: true,
    color: '#111827',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean, all whitespace. For clients who value simplicity.',
    tags: ['Minimal', 'Simple'],
    free: false,
    color: '#374151',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Two-tone layout with portfolio-style header. Perfect for agencies.',
    tags: ['Agency', 'Portfolio'],
    free: false,
    color: '#0891b2',
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Warm tones and serif type. A timeless, trustworthy look.',
    tags: ['Retro', 'Classic'],
    free: false,
    color: '#92400e',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Dark background with vibrant accent. For modern tech companies.',
    tags: ['Dark', 'Tech'],
    free: false,
    color: '#4f46e5',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Gold accents and refined spacing. For luxury services.',
    tags: ['Luxury', 'Gold'],
    free: false,
    color: '#92400e',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Fits more items on one page. Great for detailed projects.',
    tags: ['Dense', 'Practical'],
    free: false,
    color: '#065f46',
  },
];

function TemplateCard({ template }: { template: typeof TEMPLATES[number] }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Preview mockup */}
      <div className="h-48 relative overflow-hidden bg-gray-50">
        {template.free ? (
          <>
            {/* Fake A4 preview */}
            <div className="absolute inset-4 bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-10 flex items-end pb-2 px-3" style={{ backgroundColor: template.color }}>
                <div className="flex gap-1">
                  <div className="h-1.5 w-12 bg-white/60 rounded" />
                  <div className="h-1.5 w-8 bg-white/30 rounded" />
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <div className="h-1.5 w-20 bg-gray-200 rounded" />
                <div className="h-1 w-16 bg-gray-100 rounded" />
                <div className="mt-3 space-y-1">
                  {[100, 80, 90, 70].map((w, i) => (
                    <div key={i} className="h-1 rounded" style={{ width: `${w}%`, backgroundColor: '#e5e7eb' }} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <LockClosedIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pro Only</span>
            </div>
          </div>
        )}

        {!template.free && (
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
            PRO
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-900">{template.name}</h3>
          <div className="flex gap-1 flex-wrap justify-end">
            {template.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">{template.description}</p>

        {template.free ? (
          <Link
            href={`/?template=${template.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            Use template →
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-yellow-600 transition-colors"
          >
            Unlock with Pro →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Invoice Templates</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Choose from 9 professionally designed templates. 3 free, 6 more with Pro.
          All templates produce clean, client-ready PDFs.
        </p>
      </div>

      {/* Free section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CheckIcon className="h-4 w-4 text-green-600" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Free Templates</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.filter((t) => t.free).map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>

      {/* Pro section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <LockClosedIcon className="h-4 w-4 text-yellow-600" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Pro Templates</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.filter((t) => !t.free).map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors shadow-sm"
        >
          Unlock all templates — $6/month
        </Link>
      </div>
    </div>
  );
}
