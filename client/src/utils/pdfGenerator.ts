import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Booking, BusinessSettings } from '../types/index.js';

export const downloadBookingReceiptPDFClient = (
  booking: Booking,
  business: BusinessSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Dark luxury theme colors
  const darkHeaderBg: [number, number, number] = [11, 15, 23];
  const cyanAccent: [number, number, number] = [0, 240, 255];
  const goldAccent: [number, number, number] = [255, 184, 0];
  const textDark: [number, number, number] = [30, 41, 59];

  // Header Background
  doc.setFillColor(darkHeaderBg[0], darkHeaderBg[1], darkHeaderBg[2]);
  doc.rect(0, 0, 210, 45, 'F');

  // Decorative Accent Line
  doc.setFillColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.rect(0, 45, 210, 2, 'F');

  // Title: ANTI GRAVITY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('ANTI GRAVITY', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('CAR RENTAL & PREMIUM DETAILING SERVICES', 14, 28);
  doc.text(business.phone_number + ' | ' + business.email, 14, 35);

  // Receipt Badge
  doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.roundedRect(145, 12, 50, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 15, 23);
  doc.text('BOOKING RECEIPT', 148, 20);
  doc.setFontSize(9);
  doc.text(booking.booking_number, 148, 28);

  // Customer & Booking Metadata Section
  let currentY = 58;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('CUSTOMER INFORMATION', 14, currentY);
  doc.text('BOOKING DETAILS', 115, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY + 2, 95, currentY + 2);
  doc.line(115, currentY + 2, 196, currentY + 2);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);

  // Customer Info
  doc.text(`Name: ${booking.customer_name}`, 14, currentY);
  doc.text(`Phone: ${booking.customer_phone}`, 14, currentY + 6);
  if (booking.customer_email) {
    doc.text(`Email: ${booking.customer_email}`, 14, currentY + 12);
  }
  if (booking.customer_address) {
    doc.text(`Address: ${booking.customer_address}`, 14, currentY + 18);
  }

  // Booking Details
  doc.text(`Booking Date: ${new Date(booking.created_at || Date.now()).toLocaleDateString()}`, 115, currentY);
  doc.text(`Booking Type: ${booking.booking_type}`, 115, currentY + 6);
  doc.text(`Status: ${booking.status}`, 115, currentY + 12);

  currentY += 28;

  // Line Items Table Data
  const tableBody: (string | number)[][] = [];

  if (booking.rental_item) {
    const rental = booking.rental_item;
    const carName = rental.car ? `${rental.car.brand} ${rental.car.name}` : 'Rental Vehicle';
    tableBody.push([
      `Car Rental: ${carName}`,
      `Pickup: ${rental.pickup_date} (${rental.pickup_time})\nReturn: ${rental.return_date} (${rental.return_time})`,
      `${rental.rental_days} Days`,
      `$${rental.rental_price_per_day.toFixed(2)} / day`,
      `$${rental.item_total.toFixed(2)}`,
    ]);
  }

  if (booking.wash_item) {
    const wash = booking.wash_item;
    const serviceName = wash.service ? wash.service.name : 'Car Washing Service';
    tableBody.push([
      `Car Wash: ${serviceName}`,
      `Vehicle: ${wash.vehicle_type} (${wash.vehicle_registration})\nDate: ${wash.wash_date} Slot: ${wash.wash_time_slot}`,
      `1 Service`,
      `$${wash.service_price.toFixed(2)}`,
      `$${wash.item_total.toFixed(2)}`,
    ]);
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Item & Description', 'Schedule / Details', 'Qty / Duration', 'Unit Rate', 'Amount']],
    body: tableBody,
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
  });

  // Final Y coordinate after autoTable
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Summary Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.text('Subtotal:', 130, finalY);
  doc.text(`$${booking.subtotal.toFixed(2)}`, 175, finalY, { align: 'right' });

  doc.text(`Tax (${business.tax_rate}%):`, 130, finalY + 6);
  doc.text(`$${booking.tax_amount.toFixed(2)}`, 175, finalY + 6, { align: 'right' });

  if (booking.discount_amount > 0) {
    doc.text('Discount:', 130, finalY + 12);
    doc.text(`-$${booking.discount_amount.toFixed(2)}`, 175, finalY + 12, { align: 'right' });
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(130, finalY + 16, 196, finalY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 15, 23);
  doc.text('Total Amount:', 130, finalY + 23);
  doc.text(`$${booking.total_amount.toFixed(2)}`, 175, finalY + 23, { align: 'right' });

  // Footer Terms
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for choosing Anti Gravity. All bookings are governed by our Terms & Conditions.', 14, 275);
  doc.text(`${business.address} | ${business.phone_number} | ${business.email}`, 14, 280);

  // Trigger Save / Download in browser
  doc.save(`AntiGravity_Receipt_${booking.booking_number}.pdf`);
};
