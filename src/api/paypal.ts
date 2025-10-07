// PayPal API integration for Julian Hartmann Music merchandise
// This file handles PayPal payment processing and order management

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
}

interface PayPalOrder {
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
  customerEmail?: string;
}

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class PayPalService {
  private config: PayPalConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PayPalConfig) {
    this.config = config;
  }

  private getBaseURL(): string {
    return this.config.environment === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

    try {
      const response = await fetch(`${this.getBaseURL()}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      const data: PayPalAccessTokenResponse = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety
        return this.accessToken;
      } else {
        throw new Error('Failed to get PayPal access token');
      }
    } catch (error) {
      console.error('PayPal access token error:', error);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  async createOrder(orderData: PayPalOrder): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderData.orderNumber,
          amount: {
            currency_code: orderData.currency,
            value: orderData.total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: orderData.currency,
                value: orderData.total.toFixed(2)
              }
            }
          },
          items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: orderData.currency,
              value: item.price.toFixed(2)
            }
          })),
          description: `Julian Hartmann Music Merchandise - Order #${orderData.orderNumber}`,
          custom_id: orderData.orderNumber,
          invoice_id: orderData.orderNumber
        }],
        application_context: {
          brand_name: 'Julian Hartmann Music',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`
        }
      };

      const response = await fetch(`${this.getBaseURL()}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          orderId: data.id,
          approvalUrl: data.links.find((link: any) => link.rel === 'approve')?.href
        };
      } else {
        throw new Error(data.message || 'Failed to create PayPal order');
      }
    } catch (error) {
      console.error('PayPal create order error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create PayPal order'
      };
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.getBaseURL()}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'COMPLETED') {
        const capture = data.purchase_units[0].payments.captures[0];
        return {
          success: true,
          transactionId: capture.id,
          amount: capture.amount.value,
          currency: capture.amount.currency_code,
          status: 'completed',
          payerEmail: data.payer?.email_address,
          payerName: `${data.payer?.name?.given_name} ${data.payer?.name?.surname}`.trim()
        };
      } else {
        throw new Error(data.message || 'Failed to capture PayPal payment');
      }
    } catch (error) {
      console.error('PayPal capture order error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to capture PayPal payment'
      };
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.getBaseURL()}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          order: data
        };
      } else {
        throw new Error(data.message || 'Failed to get PayPal order details');
      }
    } catch (error) {
      console.error('PayPal get order error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get PayPal order details'
      };
    }
  }
}

// Export configured PayPal service
export const paypalService = new PayPalService({
  clientId: process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET',
  environment: (process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
});

export type { PayPalOrder, PayPalConfig };