import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface InvoiceData {
  id: number | string
  number?: string
  date: string
  dueDate?: string
  customer: string
  customerEmail?: string
  customerAddress?: string
  items: Array<{
    id: number
    product: {
      name: string
      price: number
    }
    quantity: number
  }>
  total: number
  status?: string
  notes?: string
}

export interface OrderData {
  id: number | string
  date: string
  customer: string
  customerEmail?: string
  items: Array<{
    id: number
    product: {
      name: string
      price: number
    }
    quantity: number
  }>
  total: number
  status: string
  shippingAddress?: any
}

export const generateInvoicePDF = async (invoice: InvoiceData) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Colors
  const primaryColor = '#8B5CF6'
  const darkColor = '#1F2937'
  const grayColor = '#6B7280'
  
  // Header
  pdf.setFillColor(139, 92, 246)
  pdf.rect(0, 0, 210, 40, 'F')
  
  // Logo and company name
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EliteStore', 20, 25)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Votre boutique premium', 20, 32)
  
  // Invoice title
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text('FACTURE', 140, 25)
  
  // Invoice number and date
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`N° ${invoice.number || invoice.id}`, 140, 32)
  pdf.text(`Date: ${formatDate(invoice.date)}`, 140, 38)
  
  // Customer information
  let yPos = 60
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 41, 55)
  pdf.text('Facturé à:', 20, yPos)
  
  yPos += 8
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(107, 114, 128)
  pdf.text(invoice.customer, 20, yPos)
  
  if (invoice.customerEmail) {
    yPos += 6
    pdf.text(invoice.customerEmail, 20, yPos)
  }
  
  if (invoice.customerAddress) {
    yPos += 6
    pdf.text(invoice.customerAddress, 20, yPos)
  }
  
  // Invoice details (right side)
  let rightYPos = 60
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 41, 55)
  
  if (invoice.dueDate) {
    pdf.text('Date d\'échéance:', 140, rightYPos)
    pdf.setFont('helvetica', 'normal')
    pdf.text(formatDate(invoice.dueDate), 140, rightYPos + 6)
    rightYPos += 16
  }
  
  if (invoice.status) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Statut:', 140, rightYPos)
    pdf.setFont('helvetica', 'normal')
    
    // Status color
    if (invoice.status.toLowerCase() === 'payée') {
      pdf.setTextColor(16, 185, 129)
    } else if (invoice.status.toLowerCase() === 'en attente') {
      pdf.setTextColor(245, 158, 11)
    } else {
      pdf.setTextColor(239, 68, 68)
    }
    
    pdf.text(invoice.status, 140, rightYPos + 6)
    pdf.setTextColor(107, 114, 128)
  }
  
  // Items table
  yPos = Math.max(yPos, rightYPos) + 20
  
  // Table header
  pdf.setFillColor(249, 250, 251)
  pdf.rect(20, yPos, 170, 10, 'F')
  
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DESCRIPTION', 25, yPos + 7)
  pdf.text('QTÉ', 120, yPos + 7)
  pdf.text('PRIX UNIT.', 140, yPos + 7)
  pdf.text('TOTAL', 170, yPos + 7)
  
  yPos += 10
  
  // Table items
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(107, 114, 128)
  
  let subtotal = 0
  
  invoice.items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity
    subtotal += itemTotal
    
    pdf.text(item.product.name, 25, yPos + 7)
    pdf.text(item.quantity.toString(), 125, yPos + 7)
    pdf.text(`${item.product.price.toFixed(2)} €`, 145, yPos + 7)
    pdf.text(`${itemTotal.toFixed(2)} €`, 175, yPos + 7)
    
    yPos += 8
    
    // Add line separator
    pdf.setDrawColor(229, 231, 235)
    pdf.line(20, yPos, 190, yPos)
    yPos += 2
  })
  
  // Totals
  yPos += 10
  const totalsX = 140
  
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(107, 114, 128)
  
  // Subtotal
  pdf.text('Sous-total:', totalsX, yPos)
  pdf.text(`${subtotal.toFixed(2)} €`, 175, yPos)
  yPos += 8
  
  // TVA
  const tva = subtotal * 0.2
  pdf.text('TVA (20%):', totalsX, yPos)
  pdf.text(`${tva.toFixed(2)} €`, 175, yPos)
  yPos += 8
  
  // Total line
  pdf.setDrawColor(139, 92, 246)
  pdf.setLineWidth(0.5)
  pdf.line(totalsX, yPos, 190, yPos)
  yPos += 8
  
  // Total
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(14)
  pdf.text('TOTAL:', totalsX, yPos)
  pdf.text(`${invoice.total.toFixed(2)} €`, 175, yPos)
  
  // Notes
  if (invoice.notes) {
    yPos += 20
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Notes:', 20, yPos)
    yPos += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(107, 114, 128)
    
    const splitNotes = pdf.splitTextToSize(invoice.notes, 170)
    pdf.text(splitNotes, 20, yPos)
  }
  
  // Footer
  const footerY = 280
  pdf.setFillColor(249, 250, 251)
  pdf.rect(0, footerY, 210, 17, 'F')
  
  pdf.setTextColor(107, 114, 128)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('EliteStore - Votre boutique premium', 20, footerY + 8)
  pdf.text('contact@elitestore.com | +33 1 23 45 67 89', 20, footerY + 14)
  
  // Save PDF
  const fileName = `facture-${invoice.number || invoice.id}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

export const generateOrderPDF = async (order: OrderData) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Colors
  const primaryColor = '#8B5CF6'
  const darkColor = '#1F2937'
  const grayColor = '#6B7280'
  
  // Header
  pdf.setFillColor(139, 92, 246)
  pdf.rect(0, 0, 210, 40, 'F')
  
  // Logo and company name
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EliteStore', 20, 25)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Votre boutique premium', 20, 32)
  
  // Order title
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text('COMMANDE', 140, 25)
  
  // Order number and date
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`N° ${order.id}`, 140, 32)
  pdf.text(`Date: ${formatDate(order.date)}`, 140, 38)
  
  // Customer information
  let yPos = 60
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 41, 55)
  pdf.text('Client:', 20, yPos)
  
  yPos += 8
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(107, 114, 128)
  pdf.text(order.customer, 20, yPos)
  
  if (order.customerEmail) {
    yPos += 6
    pdf.text(order.customerEmail, 20, yPos)
  }
  
  // Order details (right side)
  let rightYPos = 60
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 41, 55)
  
  pdf.text('Statut:', 140, rightYPos)
  pdf.setFont('helvetica', 'normal')
  
  // Status color
  if (order.status.toLowerCase() === 'livré') {
    pdf.setTextColor(16, 185, 129)
  } else if (order.status.toLowerCase() === 'en cours') {
    pdf.setTextColor(245, 158, 11)
  } else {
    pdf.setTextColor(239, 68, 68)
  }
  
  pdf.text(order.status, 140, rightYPos + 6)
  pdf.setTextColor(107, 114, 128)
  
  // Shipping address
  if (order.shippingAddress) {
    rightYPos += 16
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(31, 41, 55)
    pdf.text('Adresse de livraison:', 140, rightYPos)
    
    rightYPos += 6
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(107, 114, 128)
    pdf.text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 140, rightYPos)
    rightYPos += 6
    pdf.text(order.shippingAddress.address1, 140, rightYPos)
    rightYPos += 6
    pdf.text(`${order.shippingAddress.postalCode} ${order.shippingAddress.city}`, 140, rightYPos)
  }
  
  // Items table
  yPos = Math.max(yPos, rightYPos) + 20
  
  // Table header
  pdf.setFillColor(249, 250, 251)
  pdf.rect(20, yPos, 170, 10, 'F')
  
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PRODUIT', 25, yPos + 7)
  pdf.text('QTÉ', 120, yPos + 7)
  pdf.text('PRIX UNIT.', 140, yPos + 7)
  pdf.text('TOTAL', 170, yPos + 7)
  
  yPos += 10
  
  // Table items
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(107, 114, 128)
  
  let subtotal = 0
  
  order.items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity
    subtotal += itemTotal
    
    pdf.text(item.product.name, 25, yPos + 7)
    pdf.text(item.quantity.toString(), 125, yPos + 7)
    pdf.text(`${item.product.price.toFixed(2)} €`, 145, yPos + 7)
    pdf.text(`${itemTotal.toFixed(2)} €`, 175, yPos + 7)
    
    yPos += 8
    
    // Add line separator
    pdf.setDrawColor(229, 231, 235)
    pdf.line(20, yPos, 190, yPos)
    yPos += 2
  })
  
  // Totals
  yPos += 10
  const totalsX = 140
  
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(107, 114, 128)
  
  // Subtotal
  pdf.text('Sous-total:', totalsX, yPos)
  pdf.text(`${subtotal.toFixed(2)} €`, 175, yPos)
  yPos += 8
  
  // Shipping
  pdf.text('Livraison:', totalsX, yPos)
  pdf.setTextColor(16, 185, 129)
  pdf.text('Gratuite', 175, yPos)
  pdf.setTextColor(107, 114, 128)
  yPos += 8
  
  // TVA
  const tva = subtotal * 0.2
  pdf.text('TVA (20%):', totalsX, yPos)
  pdf.text(`${tva.toFixed(2)} €`, 175, yPos)
  yPos += 8
  
  // Total line
  pdf.setDrawColor(139, 92, 246)
  pdf.setLineWidth(0.5)
  pdf.line(totalsX, yPos, 190, yPos)
  yPos += 8
  
  // Total
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(14)
  pdf.text('TOTAL:', totalsX, yPos)
  pdf.text(`${order.total.toFixed(2)} €`, 175, yPos)
  
  // Footer
  const footerY = 280
  pdf.setFillColor(249, 250, 251)
  pdf.rect(0, footerY, 210, 17, 'F')
  
  pdf.setTextColor(107, 114, 128)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('EliteStore - Votre boutique premium', 20, footerY + 8)
  pdf.text('contact@elitestore.com | +33 1 23 45 67 89', 20, footerY + 14)
  pdf.text('Merci pour votre commande !', 140, footerY + 11)
  
  // Save PDF
  const fileName = `commande-${order.id}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}