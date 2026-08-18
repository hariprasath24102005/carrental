import { Booking, BusinessSettings } from '../types/index.js';

export interface NotificationResult {
  success: boolean;
  channel: 'SMS' | 'WhatsApp' | 'ConsoleLog';
  message: string;
  recipient: string;
  details?: any;
}

export class NotificationService {
  /**
   * Send booking confirmation SMS & WhatsApp message to Customer AND Admin Mobile Number
   */
  public static async sendBookingConfirmation(
    booking: Booking,
    businessSettings: BusinessSettings
  ): Promise<NotificationResult> {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;

    const adminMobile = businessSettings.whatsapp_number || businessSettings.phone_number || '+91 9363115217';
    const recipientPhone = booking.customer_phone;

    // Customer Notification Text
    const customerMessageText = 
`🚗 *ANTI GRAVITY BOOKING CONFIRMATION* 🚗
----------------------------------------
Booking ID: ${booking.booking_number}
Customer: ${booking.customer_name}
Type: ${booking.booking_type}
Status: ${booking.status.toUpperCase()}
Total Amount: $${booking.total_amount.toFixed(2)}

Support & Help: ${businessSettings.phone_number}
Address: ${businessSettings.address}

Thank you for choosing Anti Gravity!
Drive Better. Travel Further. Stay Spotless.`;

    // Admin Notification Text for Admin Mobile Number (+91 9363115217)
    const adminMessageText = 
`🚨 *NEW ANTI GRAVITY BOOKING ALERT* 🚨
----------------------------------------
Booking #: ${booking.booking_number}
Type: ${booking.booking_type}
Customer: ${booking.customer_name} (${booking.customer_phone})
Email: ${booking.customer_email || 'N/A'}
Address: ${booking.customer_address || 'N/A'}

${booking.rental_item ? `🚗 Rental: ${booking.rental_item.car?.brand || ''} ${booking.rental_item.car?.name || ''} (${booking.rental_item.rental_days} Days)` : ''}
${booking.wash_item ? `✨ Wash: ${booking.wash_item.service?.name || ''} (${booking.wash_item.wash_date} @ ${booking.wash_item.wash_time_slot})` : ''}

Total Amount: $${booking.total_amount.toFixed(2)}
Status: ${booking.status.toUpperCase()}

👉 Review & Manage in Admin Portal:
http://localhost:5173/admin/bookings`;

    // 1. Dispatch Twilio SMS if configured
    if (twilioSid && twilioAuthToken && twilioPhone && !twilioSid.includes('AC_your_twilio')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
        
        // Dispatch to Customer
        const customerParams = new URLSearchParams();
        customerParams.append('To', recipientPhone);
        customerParams.append('From', twilioPhone);
        customerParams.append('Body', customerMessageText);

        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: { 'Authorization': authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: customerParams.toString(),
        });

        // Dispatch to Admin Mobile (+91 9363115217)
        const adminParams = new URLSearchParams();
        adminParams.append('To', adminMobile);
        adminParams.append('From', twilioPhone);
        adminParams.append('Body', adminMessageText);

        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: { 'Authorization': authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: adminParams.toString(),
        });

        console.log(`[NotificationService] SMS successfully dispatched via Twilio to Customer (${recipientPhone}) AND Admin (${adminMobile})`);
      } catch (err: any) {
        console.error('[NotificationService] Failed to send SMS via Twilio:', err?.message || err);
      }
    }

    // 2. Dispatch WhatsApp API if configured
    if (whatsappToken && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        // Customer WhatsApp
        await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${whatsappToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipientPhone.replace(/[^0-9]/g, ''),
            type: 'text',
            text: { body: customerMessageText },
          }),
        });

        // Admin WhatsApp
        await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${whatsappToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: adminMobile.replace(/[^0-9]/g, ''),
            type: 'text',
            text: { body: adminMessageText },
          }),
        });

        console.log(`[NotificationService] WhatsApp notification sent to Customer (${recipientPhone}) AND Admin (${adminMobile})`);
      } catch (err: any) {
        console.error('[NotificationService] WhatsApp API Error:', err?.message || err);
      }
    }

    // 3. Console & System Notification Log for Admin & Customer
    console.log(`\n================================================================`);
    console.log(`[NOTIFICATION DISPATCHER - ADMIN MOBILE ALERT LOG]`);
    console.log(`Admin Recipient Phone: ${adminMobile}`);
    console.log(`Message Content:\n${adminMessageText}`);
    console.log(`----------------------------------------------------------------`);
    console.log(`Customer Recipient Phone: ${recipientPhone}`);
    console.log(`Message Content:\n${customerMessageText}`);
    console.log(`================================================================\n`);

    return {
      success: true,
      channel: 'ConsoleLog',
      message: `Booking alerts generated for Customer (${recipientPhone}) and Admin (${adminMobile})`,
      recipient: adminMobile,
    };
  }
}
