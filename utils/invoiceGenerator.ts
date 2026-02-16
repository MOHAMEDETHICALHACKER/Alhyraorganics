
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Order } from '../types';

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Header Background
  doc.setFillColor(46, 125, 50); // organic-primary
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AL HYRA ORGANICS', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Organic Nutrition', 20, 32);
  
  doc.setFontSize(18);
  doc.text('TAX INVOICE', 150, 25);
  
  // Order Info Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Invoice No: ${order.id}`, 20, 55);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 60);
  doc.text(`Order Status: ${order.orderStatus}`, 20, 65);
  
  // Billing Info
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(order.address.fullName, 20, 85);
  doc.text(`Phone: ${order.address.phone}`, 20, 90);
  doc.text(order.address.street, 20, 95);
  doc.text(`${order.address.city}, ${order.address.state} - ${order.address.zipCode}`, 20, 100);
  
  // Product Table
  const tableData = order.items.map(item => [
    item.name,
    item.weight,
    `INR ${item.price.toFixed(2)}`,
    item.quantity,
    `INR ${(item.price * item.quantity).toFixed(2)}`
  ]);
  
  (doc as any).autoTable({
    startY: 115,
    head: [['Product Description', 'Weight', 'Unit Price', 'Qty', 'Amount']],
    body: tableData,
    headStyles: { fillColor: [46, 125, 50], halign: 'center' },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'center' },
      4: { halign: 'right' }
    },
    theme: 'grid'
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  // Pricing Summary
  const subtotal = order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  
  doc.setFont('helvetica', 'bold');
  const summaryX = 130;
  doc.text('Subtotal:', summaryX, finalY + 15);
  doc.text('Shipping Fee:', summaryX, finalY + 22);
  
  if (order.discountAmount) {
    doc.text(`Coupon Discount (${order.couponCode}):`, summaryX, finalY + 29);
  }
  
  doc.setFontSize(12);
  doc.text('GRAND TOTAL:', summaryX, finalY + 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`INR ${subtotal.toFixed(2)}`, 190, finalY + 15, { align: 'right' });
  doc.text(`INR ${shipping.toFixed(2)}`, 190, finalY + 22, { align: 'right' });
  
  if (order.discountAmount) {
    doc.setTextColor(220, 0, 0);
    doc.text(`- INR ${order.discountAmount.toFixed(2)}`, 190, finalY + 29, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${order.totalAmount.toFixed(2)}`, 190, finalY + 40, { align: 'right' });
  
  // Terms & Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Terms & Conditions:', 20, 260);
  doc.text('1. This is a computer-generated invoice and requires no signature.', 20, 265);
  doc.text('2. Items once sold can only be returned within 7 days in original packaging.', 20, 270);
  
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for supporting sustainable nutrition with Al Hyra Organics!', 105, 285, { align: 'center' });
  doc.text('FSSAI Lic. No: 22423567000123', 105, 290, { align: 'center' });
  
  doc.save(`AlHyra_Invoice_${order.id}.pdf`);
};
