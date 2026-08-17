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
   * Send booking confirmation SMS & WhatsApp message
   */
  public static async sendBookingConfirmation(
    booking: Booking,
    businessSettings: BusinessSettings
  ): Promise<NotificationResult> {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;

    const messageText = 
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

    const recipientPhone = booking.customer_phone;

    // 1. Check if Twilio Credentials are provided
    if (twilioSid && twilioAuthToken && twilioPhone && !twilioSid.includes('AC_your_twilio')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', recipientPhone);
        params.append('From', twilioPhone);
        params.append('Body', messageText);

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );

        const data: any = await response.json();
        if (response.ok) {
          console.log(`[NotificationService] SMS successfully dispatched via Twilio to ${recipientPhone}`);
          return {
            success: true,
            channel: 'SMS',
            message: `SMS dispatched via Twilio SID: ${data.sid}`,
            recipient: recipientPhone,
            details: data,
          };
        } else {
          console.error('[NotificationService] Twilio SMS API Error:', data);
        }
      } catch (err: any) {
        console.error('[NotificationService] Failed to send SMS via Twilio:', err?.message || err);
      }
    }

    // 2. Check if WhatsApp Business Cloud API credentials are provided
    if (whatsappToken && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: recipientPhone.replace(/[^0-9]/g, ''),
              type: 'text',
              text: { body: messageText },
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log(`[NotificationService] WhatsApp notification sent to ${recipientPhone}`);
          return {
            success: true,
            channel: 'WhatsApp',
            message: 'WhatsApp Cloud API message dispatched successfully',
            recipient: recipientPhone,
            details: data,
          };
        }
      } catch (err: any) {
        console.error('[NotificationService] WhatsApp API Error:', err?.message || err);
      }
    }

    // 3. Fallback: Structured Console & System Notification Log
    console.log(`\n================================================================`);
    console.log(`[NOTIFICATION DISPATCHER - SMS & WHATSAPP LOG]`);
    console.log(`To: ${recipientPhone}`);
    console.log(`Message Content:\n${messageText}`);
    console.log(`Notice: Configure TWILIO_ACCOUNT_SID or WHATSAPP_API_TOKEN in .env for live SMS routing.`);
    console.log(`================================================================\n`);

    return {
      success: true,
      channel: 'ConsoleLog',
      message: 'Booking notification formatted and logged to server console (Set TWILIO_ACCOUNT_SID for SMS delivery)',
      recipient: recipientPhone,
    };
  }
}
