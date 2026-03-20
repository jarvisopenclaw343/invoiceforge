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

const styles = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9, color: '#1a1a2e', backgroundColor: '#ffffff', padding: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  senderName: { fontSize: 18, fontWeight: 700, color: '#1e40af', marginBottom: 4 },
  senderDetail: { fontSize: 8.5, color: '#4b5563', marginBottom: 2 },
  invoiceLabel: { fontSize: 28, fontWeight: 700, color: '#e2e8f0', textAlign: 'right', letterSpacing: 2 },
  invoiceNum: { fontSize: 11, fontWeight: 600, color: '#1e40af', textAlign: 'right', marginTop: 4 },
  invoiceMeta: { fontSize: 8.5, color: '#4b5563', textAlign: 'right', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 28 },
  billSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  billLabel: { fontSize: 7.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  billName: { fontSize: 10.5, fontWeight: 600, color: '#111827', marginBottom: 3 },
  billDetail: { fontSize: 8.5, color: '#4b5563', marginBottom: 2 },
  table: { marginBottom: 0 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e40af', padding: '8 10', borderRadius: 4, marginBottom: 0 },
  tableHeaderText: { fontSize: 8, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', padding: '7 10', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tableRowAlt: { backgroundColor: '#f9fafb' },
  colDesc: { flex: 1 },
  colQty: { width: 50, textAlign: 'center' },
  colRate: { width: 72, textAlign: 'right' },
  colAmount: { width: 72, textAlign: 'right' },
  cellText: { fontSize: 8.5, color: '#374151' },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  totalsTable: { width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalLabel: { fontSize: 8.5, color: '#4b5563' },
  totalValue: { fontSize: 8.5, color: '#111827', fontWeight: 600 },
  totalDivider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 6 },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  grandTotalLabel: { fontSize: 10, fontWeight: 700, color: '#111827' },
  grandTotalValue: { fontSize: 11, fontWeight: 700, color: '#1e40af' },
  notes: { marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  notesLabel: { fontSize: 7.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  notesText: { fontSize: 8.5, color: '#4b5563', lineHeight: 1.6 },
  footer: { position: 'absolute', bottom: 30, left: 48, right: 48, textAlign: 'center', fontSize: 7.5, color: '#9ca3af' },
});

interface Props {
  invoice: InvoiceData;
  isPro?: boolean;
  accentColor?: string;
}

export function ClassicTemplate({ invoice, isPro = false }: Props) {
  const { subtotal, discount, tax, total } = computeTotals(invoice);
  const fmt = (n: number) => formatCurrency(n, invoice.currency);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.senderName}>{invoice.senderName || 'Your Business'}</Text>
            {invoice.senderEmail ? <Text style={styles.senderDetail}>{invoice.senderEmail}</Text> : null}
            {invoice.senderAddress ? <Text style={styles.senderDetail}>{invoice.senderAddress}</Text> : null}
            {(invoice.senderCity || invoice.senderState) ? (
              <Text style={styles.senderDetail}>
                {[invoice.senderCity, invoice.senderState, invoice.senderZip].filter(Boolean).join(', ')}
              </Text>
            ) : null}
            {invoice.senderCountry ? <Text style={styles.senderDetail}>{invoice.senderCountry}</Text> : null}
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNum}>{invoice.invoiceNumber || 'INV-001'}</Text>
            {invoice.issueDate ? <Text style={styles.invoiceMeta}>Issued: {invoice.issueDate}</Text> : null}
            {invoice.dueDate ? <Text style={styles.invoiceMeta}>Due: {invoice.dueDate}</Text> : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill To */}
        <View style={styles.billSection}>
          <View>
            <Text style={styles.billLabel}>Bill To</Text>
            <Text style={styles.billName}>{invoice.clientName || '—'}</Text>
            {invoice.clientEmail ? <Text style={styles.billDetail}>{invoice.clientEmail}</Text> : null}
            {invoice.clientAddress ? <Text style={styles.billDetail}>{invoice.clientAddress}</Text> : null}
            {(invoice.clientCity || invoice.clientState) ? (
              <Text style={styles.billDetail}>
                {[invoice.clientCity, invoice.clientState, invoice.clientZip].filter(Boolean).join(', ')}
              </Text>
            ) : null}
            {invoice.clientCountry ? <Text style={styles.billDetail}>{invoice.clientCountry}</Text> : null}
          </View>
          {invoice.paymentTerms ? (
            <View>
              <Text style={styles.billLabel}>Payment Terms</Text>
              <Text style={[styles.billDetail, { color: '#111827', fontWeight: 600 }]}>{invoice.paymentTerms}</Text>
            </View>
          ) : null}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>
          {invoice.lineItems.map((item, i) => (
            <View key={item.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.cellText, styles.colDesc]}>{item.description || '—'}</Text>
              <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.cellText, styles.colRate]}>{fmt(item.rate)}</Text>
              <Text style={[styles.cellText, styles.colAmount]}>{fmt(item.quantity * item.rate)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{fmt(subtotal)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Discount {invoice.discountType === 'percent' ? `(${invoice.discountRate}%)` : ''}
                </Text>
                <Text style={styles.totalValue}>−{fmt(discount)}</Text>
              </View>
            )}
            {tax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Tax {invoice.taxType === 'percent' ? `(${invoice.taxRate}%)` : ''}
                </Text>
                <Text style={styles.totalValue}>{fmt(tax)}</Text>
              </View>
            )}
            <View style={styles.totalDivider} />
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Due</Text>
              <Text style={styles.grandTotalValue}>{fmt(total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        {/* Footer */}
        {!isPro && (
          <Text style={styles.footer}>Generated with InvoiceForge — invoiceforge.app</Text>
        )}
      </Page>
    </Document>
  );
}
