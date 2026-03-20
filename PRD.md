# InvoiceForge — Professional Invoice Generator

## Overview
A clean, fast invoice generator for freelancers and small businesses. No signup required. Create beautiful invoices in under 60 seconds, download as PDF. The fastest path from "I need an invoice" to "here's your invoice."

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **PDF Generation:** @react-pdf/renderer (client-side)
- **Payments:** Stripe Checkout (subscription)
- **Storage:** localStorage for saved templates/clients
- **Deployment:** Vercel

## Features

### Core (Free Tier — 3 invoices/month)
1. **Invoice Builder** — Fill in: your business info, client info, line items (description, qty, rate), tax %, discount, notes, payment terms
2. **Live Preview** — Real-time PDF preview as you type
3. **Auto-calculations** — Subtotal, tax, discount, total computed automatically
4. **Multiple currencies** — USD, EUR, GBP, CAD, AUD, INR, JPY (dropdown)
5. **Invoice numbering** — Auto-increment, customizable prefix (e.g., INV-001)
6. **Download PDF** — Professional, clean PDF layout
7. **Save locally** — Save invoices and client info to localStorage for reuse
8. **3 Templates** — Classic (clean/minimal), Modern (accent color sidebar), Bold (dark header)
9. **"Powered by InvoiceForge"** watermark on free PDFs

### Pro Tier ($6/month)
- Unlimited invoices
- No watermark
- Custom logo upload on invoices
- 6 additional premium templates
- Save/manage client database locally
- Recurring invoice templates
- Due date reminders (just shows in UI, no email)
- Custom accent colors per template

## Pages
1. **/** — Main invoice builder (single-page app feel)
2. **/templates** — Template gallery (free + pro)
3. **/pricing** — Free vs Pro comparison
4. **/api/checkout/route.ts** — Stripe checkout session creation
5. **/api/webhook/route.ts** — Stripe webhook handler
6. **/api/verify/route.ts** — Verify pro subscription by email

## UX Flow
1. User lands → immediately sees the invoice builder form
2. Left side: form fields. Right side: live PDF preview
3. Fill in details → preview updates in real-time
4. Click "Download PDF" → get the invoice
5. After 3 free invoices/month → upgrade prompt
6. Pro users verify via email (checked against Stripe)

## Design
- Light theme (invoices should look professional on white)
- Clean, business-appropriate UI — not flashy, just trustworthy
- Accent color: Deep blue (#1e40af) for headers/buttons
- Form on left (scrollable), PDF preview on right (sticky)
- Mobile: form stacks above preview
- Professional typography — use Inter for UI, serif option for invoice text

## Implementation Notes
- PDF generation is 100% client-side via @react-pdf/renderer — zero server costs
- All data stored in localStorage — no database needed
- Invoice count tracked in localStorage (reset monthly)
- Pro check: email verification against Stripe API
- Templates are React PDF components with different layouts
- Currency formatting via Intl.NumberFormat
- Line items are dynamic — add/remove rows freely
- Tax and discount can be % or fixed amount

## File Structure
```
/app
  /page.tsx                — Main invoice builder
  /templates/page.tsx      — Template gallery
  /pricing/page.tsx        — Pricing page
  /api/checkout/route.ts   — Stripe checkout
  /api/webhook/route.ts    — Stripe webhook
  /api/verify/route.ts     — Pro verification
  /layout.tsx              — Root layout
  /globals.css             — Global styles
/components
  /InvoiceForm.tsx         — Main form component (business info, client, line items)
  /InvoicePreview.tsx      — Live PDF preview wrapper
  /LineItems.tsx           — Dynamic line item rows
  /PDFDocument.tsx         — React-PDF document component
  /templates/
    /ClassicTemplate.tsx   — Clean minimal template
    /ModernTemplate.tsx    — Accent sidebar template
    /BoldTemplate.tsx      — Dark header template
  /CurrencySelect.tsx     — Currency dropdown
  /DownloadButton.tsx     — Download with free/pro gating
  /UpgradeModal.tsx       — Upgrade prompt
  /Header.tsx             — Navigation header
  /ClientManager.tsx      — Saved clients dropdown
/lib
  /currencies.ts          — Currency list and formatters
  /stripe.ts              — Stripe setup
  /storage.ts             — localStorage helpers
  /invoice-number.ts      — Auto-increment logic
```

Build this as a complete, production-ready app. The invoice PDF output needs to look genuinely professional — clean typography, proper alignment, good use of whitespace. Freelancers need to feel confident sending these to clients. The form UX should be fast and intuitive — minimize clicks, smart defaults, tab-friendly.
