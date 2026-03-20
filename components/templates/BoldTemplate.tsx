'use client';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { InvoiceData, computeTotals } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff', fontWeight: 700 },
  ],
});

function makeStyles(accent: string) {
  return StyleSheet.create({
    page: { fontFamily: 'Inter', fontSize: 9, color: '#1a1a2e', backgroundColor: '#ffffff' },
    hero: { backgroundColor: '#111827', padding: '40 48 36 48', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    heroLeft: {},
    businessName: { fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 4 },
    businessSub: { fontSize: 8.5, color: 'rgba(255,255,255,0.55)', marginBottom: 2 },
    accentBar: { height: 4, backgroundColor: accent },
    heroRight: { alignItems: 'flex-end' },
    heroInvoiceWord: { fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
    heroInvoiceNum: { fontSize: 22, fontWeight: 700, color: '#ffffff' },
    heroMeta: { fontSize: 8, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
    body: { padding: '36 48 48 48' },
    twoCol: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    billLabel: { fontSize: 7.5, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 },
    billName: { fontSize: 11, fontWeight: 700, color: '#111827', marginBottom: 3 },
    billDetail: { fontSize: 8.5, color: '#4b5563', marginBottom: 2 },
    metaBox: { alignItems: 'flex-end' },
    metaLabel: { fontSize: 7.5, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
    metaValue: { fontSize: 9, fontWeight: 600, color: '#111827', marginBottom: 8 },
    tableHead: { flexDirection: 'row', backgroundColor: '#111827', padding: '8 10', borderRadius: 3, marginBottom: 2 },
    tableHeadText: { fontSize: 8, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    tableRow: { flexDirection: 'row', padding: '7 10', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    tableRowAlt: { backgroundColor: '#f9fafb' },
    colDesc: { flex: 1 },
    colQty: { width: 50, textAlign: 'center' },
    colRate: { width: 72, textAlign: 'right' },
    colAmount: { width: 72, textAlign: 'right' },
    cellText: { fontSize: 8.5, color: '#374151' },
    totalsOuter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    totalsInner: { width: 220 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3.5 },
    totalLabel: { fontSize: 8.5, color: '#6b7280' },
    totalValue: { fontSize: 8.5, color: '#111827' },
    divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 6 },
    grandBox: { backgroundColor: '#111827', borderRadius: 4, padding: '10 12', flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    grandLabel: { fontSize: 10, fontWeight: 700, color: '#ffffff' },
    grandValue: { fontSize: 12, fontWeight: 700, color: accent },
    notes: { marginTop: 28, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
    notesLabel: { fontSize: 7.5, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    notesText: { fontSize: 8.5, color: '#4b5563', lineHeight: 1.6 },
    footer: { position: 'absolute', bottom: 16, right: 48, fontSize: 7.5, color: '#d1d5db' },
  });
}

interface Props {
  invoice: InvoiceData;
  isPro?: boolean;
}

export function BoldTemplate({ invoice, isPro = false }: Props) {
  const accent = invoice.accentColor || '#3b82f6';
  const s = makeStyles(accent);
  const { subtotal, discount, tax, total } = computeTotals(invoice);
  const fmt = (n: number) => formatCurrency(n, invoice.currency);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Dark hero header */}
        <View style={s.hero}>
          <View style={s.heroLeft}>
            <Text style={s.businessName}>{invoice.senderName || 'Your Business'}</Text>
            {invoice.senderEmail ? <Text style={s.businessSub}>{invoice.senderEmail}</Text> : null}
            {invoice.senderAddress ? <Text style={s.businessSub}>{invoice.senderAddress}</Text> : null}
            {(invoice.senderCity || invoice.senderState) ? (
              <Text style={s.businessSub}>{[invoice.senderCity, invoice.senderState, invoice.senderZip].filter(Boolean).join(', ')}</Text>
            ) : null}
            {invoice.senderCountry ? <Text style={s.businessSub}>{invoice.senderCountry}</Text> : null}
          </View>
          <View style={s.heroRight}>
            <Text style={s.heroInvoiceWord}>Invoice</Text>
            <Text style={s.heroInvoiceNum}>{invoice.invoiceNumber || 'INV-001'}</Text>
            {invoice.issueDate ? <Text style={s.heroMeta}>Issued {invoice.issueDate}</Text> : null}
            {invoice.dueDate ? <Text style={s.heroMeta}>Due {invoice.dueDate}</Text> : null}
          </View>
        </View>
        <View style={s.accentBar} />

        <View style={s.body}>
          <View style={s.twoCol}>
            <View>
              <Text style={s.billLabel}>Bill To</Text>
              <Text style={s.billName}>{invoice.clientName || '—'}</Text>
              {invoice.clientEmail ? <Text style={s.billDetail}>{invoice.clientEmail}</Text> : null}
              {invoice.clientAddress ? <Text style={s.billDetail}>{invoice.clientAddress}</Text> : null}
              {(invoice.clientCity || invoice.clientState) ? (
                <Text style={s.billDetail}>{[invoice.clientCity, invoice.clientState, invoice.clientZip].filter(Boolean).join(', ')}</Text>
              ) : null}
              {invoice.clientCountry ? <Text style={s.billDetail}>{invoice.clientCountry}</Text> : null}
            </View>
            <View style={s.metaBox}>
              {invoice.paymentTerms ? (
                <>
                  <Text style={s.metaLabel}>Payment Terms</Text>
                  <Text style={s.metaValue}>{invoice.paymentTerms}</Text>
                </>
              ) : null}
            </View>
          </View>

          {/* Line items */}
          <View style={s.tableHead}>
            <Text style={[s.tableHeadText, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeadText, s.colQty]}>Qty</Text>
            <Text style={[s.tableHeadText, s.colRate]}>Rate</Text>
            <Text style={[s.tableHeadText, s.colAmount]}>Amount</Text>
          </View>
          {invoice.lineItems.map((item, i) => (
            <View key={item.id} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.cellText, s.colDesc]}>{item.description || '—'}</Text>
              <Text style={[s.cellText, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.cellText, s.colRate]}>{fmt(item.rate)}</Text>
              <Text style={[s.cellText, s.colAmount]}>{fmt(item.quantity * item.rate)}</Text>
            </View>
          ))}

          {/* Totals */}
          <View style={s.totalsOuter}>
            <View style={s.totalsInner}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Subtotal</Text>
                <Text style={s.totalValue}>{fmt(subtotal)}</Text>
              </View>
              {discount > 0 && (
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Discount</Text>
                  <Text style={s.totalValue}>−{fmt(discount)}</Text>
                </View>
              )}
              {tax > 0 && (
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Tax</Text>
                  <Text style={s.totalValue}>{fmt(tax)}</Text>
                </View>
              )}
              <View style={s.grandBox}>
                <Text style={s.grandLabel}>Total Due</Text>
                <Text style={s.grandValue}>{fmt(total)}</Text>
              </View>
            </View>
          </View>

          {invoice.notes ? (
            <View style={s.notes}>
              <Text style={s.notesLabel}>Notes</Text>
              <Text style={s.notesText}>{invoice.notes}</Text>
            </View>
          ) : null}
        </View>

        {!isPro && <Text style={s.footer}>Generated with InvoiceForge</Text>}
      </Page>
    </Document>
  );
}
