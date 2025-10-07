// Bank Transfer API integration for Julian Hartmann Music merchandise
// This file handles bank transfer verification and order processing

interface BankTransferConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban?: string;
  verificationWebhookUrl?: string;
}

interface BankTransferOrder {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currency: string;
  reference: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface TransferVerification {
  reference: string;
  amount: number;
  currency: string;
  senderName?: string;
  senderAccount?: string;
  transactionDate?: string;
  bankReference?: string;
}

class BankTransferService {
  private config: BankTransferConfig;

  constructor(config: BankTransferConfig) {
    this.config = config;
  }

  getBankDetails() {
    return {
      bankName: this.config.bankName,
      accountName: this.config.accountName,
      accountNumber: this.config.accountNumber,
      routingNumber: this.config.routingNumber,
      swiftCode: this.config.swiftCode,
      iban: this.config.iban
    };
  }

  async createTransferOrder(orderData: BankTransferOrder): Promise<any> {
    try {
      // Generate unique reference if not provided
      const reference = orderData.reference || `JH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const transferOrder = {
        ...orderData,
        reference,
        status: 'pending_transfer',
        createdAt: new Date().toISOString(),
        bankDetails: this.getBankDetails(),
        instructions: this.generateTransferInstructions(reference, orderData.amount, orderData.currency)
      };

      // In a real application, you would save this to your database
      console.log('Bank transfer order created:', transferOrder);

      // Send confirmation email to customer
      await this.sendTransferInstructions(transferOrder);

      return {
        success: true,
        reference,
        bankDetails: this.getBankDetails(),
        instructions: transferOrder.instructions,
        estimatedProcessingTime: '1-3 business days'
      };
    } catch (error) {
      console.error('Bank transfer order creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create bank transfer order'
      };
    }
  }

  private generateTransferInstructions(reference: string, amount: number, currency: string): string[] {
    return [
      `Transfer exactly ${currency} ${amount.toFixed(2)} to the account details provided`,
      `Use reference: ${reference} (IMPORTANT: This must be included in your transfer)`,
      `Your order will be processed once we verify the payment (1-3 business days)`,
      `Keep your bank transfer receipt for your records`,
      `Contact us if you don't receive confirmation within 3 business days`
    ];
  }

  private async sendTransferInstructions(order: any): Promise<void> {
    // In a real application, you would integrate with an email service
    const emailContent = {
      to: order.customerEmail,
      subject: `Bank Transfer Instructions - Order #${order.orderNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${order.customerName},</p>
        <p>Please complete your payment using the bank transfer details below:</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Bank Transfer Details</h3>
          <p><strong>Bank Name:</strong> ${order.bankDetails.bankName}</p>
          <p><strong>Account Name:</strong> ${order.bankDetails.accountName}</p>
          <p><strong>Account Number:</strong> ${order.bankDetails.accountNumber}</p>
          <p><strong>Routing Number:</strong> ${order.bankDetails.routingNumber}</p>
          <p><strong>SWIFT Code:</strong> ${order.bankDetails.swiftCode}</p>
          ${order.bankDetails.iban ? `<p><strong>IBAN:</strong> ${order.bankDetails.iban}</p>` : ''}
        </div>
        
        <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h4>IMPORTANT: Payment Reference</h4>
          <p style="font-size: 18px; font-weight: bold; color: #856404;">Reference: ${order.reference}</p>
          <p>Please include this reference in your bank transfer to ensure proper processing.</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <h4>Order Summary</h4>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Amount:</strong> ${order.currency} ${order.amount.toFixed(2)}</p>
          <p><strong>Items:</strong></p>
          <ul>
            ${order.items.map((item: any) => `<li>${item.name} x ${item.quantity} - ${order.currency} ${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
        </div>
        
        <h4>Next Steps:</h4>
        <ol>
          ${order.instructions.map((instruction: string) => `<li>${instruction}</li>`).join('')}
        </ol>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Julian Hartmann Music Team</p>
      `
    };

    console.log('Email to be sent:', emailContent);
    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
  }

  async verifyTransfer(verification: TransferVerification): Promise<any> {
    try {
      // In a real application, you would:
      // 1. Check your bank's API or webhook data
      // 2. Match the reference with pending orders
      // 3. Verify the amount matches
      // 4. Update order status in database

      console.log('Verifying bank transfer:', verification);

      // Simulate verification process
      const isValid = this.validateTransferData(verification);

      if (isValid) {
        // Update order status to 'paid'
        const updatedOrder = {
          reference: verification.reference,
          status: 'paid',
          verifiedAt: new Date().toISOString(),
          transactionDetails: verification
        };

        console.log('Transfer verified:', updatedOrder);

        // Send confirmation email
        await this.sendPaymentConfirmation(updatedOrder);

        return {
          success: true,
          status: 'verified',
          message: 'Payment verified successfully',
          orderStatus: 'processing'
        };
      } else {
        return {
          success: false,
          status: 'verification_failed',
          message: 'Transfer verification failed - please check details'
        };
      }
    } catch (error) {
      console.error('Bank transfer verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify bank transfer'
      };
    }
  }

  private validateTransferData(verification: TransferVerification): boolean {
    // Basic validation - in real app, this would be more comprehensive
    return !!(
      verification.reference &&
      verification.amount > 0 &&
      verification.currency
    );
  }

  private async sendPaymentConfirmation(order: any): Promise<void> {
    const emailContent = {
      to: 'customer@email.com', // Would get from order data
      subject: `Payment Confirmed - Order #${order.reference}`,
      html: `
        <h2>Payment Confirmed!</h2>
        <p>Your bank transfer has been verified and your order is now being processed.</p>
        <p><strong>Reference:</strong> ${order.reference}</p>
        <p><strong>Status:</strong> Processing</p>
        <p>You will receive shipping information once your order is dispatched.</p>
        <p>Thank you for your purchase!</p>
      `
    };

    console.log('Confirmation email to be sent:', emailContent);
  }

  async getTransferStatus(reference: string): Promise<any> {
    try {
      // In a real application, you would query your database
      console.log('Checking transfer status for reference:', reference);

      // Simulate status check
      return {
        success: true,
        reference,
        status: 'pending_verification',
        message: 'Transfer is being verified',
        estimatedVerificationTime: '1-3 business days'
      };
    } catch (error) {
      console.error('Transfer status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check transfer status'
      };
    }
  }
}

// Export configured bank transfer service
export const bankTransferService = new BankTransferService({
  bankName: process.env.BANK_NAME || 'Julian Hartmann Music Bank',
  accountName: process.env.BANK_ACCOUNT_NAME || 'Julian Hartmann Music LLC',
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
  routingNumber: process.env.BANK_ROUTING_NUMBER || '021000021',
  swiftCode: process.env.BANK_SWIFT_CODE || 'JHMBANKXXX',
  iban: process.env.BANK_IBAN,
  verificationWebhookUrl: process.env.BANK_WEBHOOK_URL
});

export type { BankTransferOrder, TransferVerification, BankTransferConfig };