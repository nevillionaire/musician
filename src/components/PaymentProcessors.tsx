import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PaymentProcessorsProps {
  total: number;
  orderDetails: any;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
}

// PayPal Payment Component
export function PayPalPayment({ total, orderDetails, onPaymentSuccess, onPaymentError }: PaymentProcessorsProps) {
  const paypalOptions = {
    "client-id": "YOUR_PAYPAL_CLIENT_ID", // Replace with your PayPal client ID
    currency: "USD",
    intent: "capture"
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2),
          currency_code: "USD"
        },
        description: `Julian Hartmann Merchandise - Order #${orderDetails.orderNumber}`,
        custom_id: orderDetails.orderNumber,
        invoice_id: orderDetails.orderNumber
      }]
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      onPaymentSuccess({
        paymentMethod: 'paypal',
        transactionId: details.id,
        payerEmail: details.payer.email_address,
        amount: details.purchase_units[0].amount.value,
        status: 'completed'
      });
    });
  };

  const onError = (err: any) => {
    console.error('PayPal payment error:', err);
    onPaymentError({
      paymentMethod: 'paypal',
      error: err.message || 'PayPal payment failed'
    });
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="w-full">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}

// M-Pesa Payment Component
export function MPesaPayment({ total, orderDetails, onPaymentSuccess, onPaymentError }: PaymentProcessorsProps) {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const initiateSTKPush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      onPaymentError({
        paymentMethod: 'mpesa',
        error: 'Please enter a valid phone number'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // This would connect to your M-Pesa API endpoint
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: Math.round(total),
          orderNumber: orderDetails.orderNumber,
          accountReference: `JULIAN-${orderDetails.orderNumber}`,
          transactionDesc: `Julian Hartmann Merch - ${orderDetails.orderNumber}`
        })
      });

      const data = await response.json();

      if (data.success) {
        // Poll for payment status
        pollPaymentStatus(data.checkoutRequestId);
      } else {
        throw new Error(data.message || 'M-Pesa payment initiation failed');
      }
    } catch (error: any) {
      setIsProcessing(false);
      onPaymentError({
        paymentMethod: 'mpesa',
        error: error.message || 'M-Pesa payment failed'
      });
    }
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/mpesa/status/${checkoutRequestId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setIsProcessing(false);
          onPaymentSuccess({
            paymentMethod: 'mpesa',
            transactionId: data.mpesaReceiptNumber,
            phoneNumber: phoneNumber,
            amount: total,
            status: 'completed'
          });
        } else if (data.status === 'failed' || data.status === 'cancelled') {
          setIsProcessing(false);
          onPaymentError({
            paymentMethod: 'mpesa',
            error: 'Payment was cancelled or failed'
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 10000); // Check every 10 seconds
        } else {
          setIsProcessing(false);
          onPaymentError({
            paymentMethod: 'mpesa',
            error: 'Payment timeout - please try again'
          });
        }
      } catch (error) {
        setIsProcessing(false);
        onPaymentError({
          paymentMethod: 'mpesa',
          error: 'Failed to check payment status'
        });
      }
    };

    poll();
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="254712345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3DAC3] focus:border-transparent"
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
        </p>
      </div>

      <button
        onClick={initiateSTKPush}
        disabled={isProcessing || !phoneNumber}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay KES ${Math.round(total * 130)} via M-Pesa` // Assuming 1 USD = 130 KES
        )}
      </button>

      {isProcessing && (
        <div className="text-center text-sm text-gray-600">
          <p>Check your phone for the M-Pesa payment prompt</p>
          <p>Enter your M-Pesa PIN to complete the payment</p>
        </div>
      )}
    </div>
  );
}

// Bank Transfer Component
export function BankTransferPayment({ total, orderDetails, onPaymentSuccess }: PaymentProcessorsProps) {
  const [hasConfirmed, setHasConfirmed] = React.useState(false);

  const bankDetails = {
    bankName: "Example Bank",
    accountName: "Julian Hartmann Music",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    swiftCode: "EXAMPLEBIC",
    reference: orderDetails.orderNumber
  };

  const handleConfirmTransfer = () => {
    setHasConfirmed(true);
    onPaymentSuccess({
      paymentMethod: 'bank_transfer',
      reference: orderDetails.orderNumber,
      amount: total,
      status: 'pending_verification',
      bankDetails: bankDetails
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3">Bank Transfer Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bank Name:</span>
            <span className="font-medium">{bankDetails.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Name:</span>
            <span className="font-medium">{bankDetails.accountName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Number:</span>
            <span className="font-medium">{bankDetails.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Routing Number:</span>
            <span className="font-medium">{bankDetails.routingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">SWIFT Code:</span>
            <span className="font-medium">{bankDetails.swiftCode}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-600">Reference:</span>
            <span className="font-bold text-blue-900">{bankDetails.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-medium text-yellow-800 mb-2">Important Instructions:</h5>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use the reference number <strong>{bankDetails.reference}</strong> for your transfer</li>
          <li>• Transfer the exact amount: <strong>${total.toFixed(2)}</strong></li>
          <li>• Your order will be processed once payment is verified (1-3 business days)</li>
          <li>• Keep your transfer receipt for your records</li>
        </ul>
      </div>

      <button
        onClick={handleConfirmTransfer}
        disabled={hasConfirmed}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {hasConfirmed ? 'Transfer Confirmed' : 'I Have Made the Transfer'}
      </button>

      {hasConfirmed && (
        <div className="text-center text-sm text-green-600">
          <p>✓ Transfer confirmed! We'll verify your payment and process your order within 1-3 business days.</p>
        </div>
      )}
    </div>
  );
}