// Enhanced M-Pesa Integration for Kenya Market
import { supabase } from '@/lib/database/supabase';

export interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  businessShortCode: string;
  passkey: string;
  environment: 'sandbox' | 'production';
  callbackUrl: string;
}

export interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  orderId?: string;
}

export interface MPesaTransaction {
  id: string;
  transactionId: string;
  phoneNumber: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  orderId?: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface BulkPaymentRequest {
  payments: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    remarks: string;
  }[];
}

export class MPesaService {
  private config: MPesaConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: MPesaConfig) {
    this.config = config;
  }

  private get baseUrl(): string {
    return this.config.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64');

    const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get M-Pesa access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));

    return this.accessToken!;
  }

  private generateTimestamp(): string {
    const now = new Date();
    return now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp();
    const data = this.config.businessShortCode + this.config.passkey + timestamp;
    return Buffer.from(data).toString('base64');
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Convert various formats to 254XXXXXXXXX
    let formatted = phoneNumber.replace(/\D/g, ''); // Remove non-digits

    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('7') || formatted.startsWith('1')) {
      formatted = '254' + formatted;
    } else if (!formatted.startsWith('254')) {
      throw new Error('Invalid phone number format');
    }

    if (formatted.length !== 12) {
      throw new Error('Phone number must be 12 digits including country code');
    }

    return formatted;
  }

  async initiateSTKPush(request: STKPushRequest, tenantId: string): Promise<MPesaTransaction> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();
    const formattedPhone = this.formatPhoneNumber(request.phoneNumber);

    const payload = {
      BusinessShortCode: this.config.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: request.amount,
      PartyA: formattedPhone,
      PartyB: this.config.businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: this.config.callbackUrl,
      AccountReference: request.accountReference,
      TransactionDesc: request.transactionDesc
    };

    const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.ResponseCode !== '0') {
      throw new Error(data.ResponseDescription || 'STK Push failed');
    }

    // Save transaction to database
    const transaction: MPesaTransaction = {
      id: crypto.randomUUID(),
      transactionId: data.CheckoutRequestID,
      phoneNumber: formattedPhone,
      amount: request.amount,
      status: 'PENDING',
      orderId: request.orderId,
      createdAt: new Date().toISOString()
    };

    await supabase.from('mpesa_transactions').insert({
      id: transaction.id,
      transaction_id: transaction.transactionId,
      phone_number: transaction.phoneNumber,
      amount: transaction.amount,
      status: transaction.status,
      order_id: transaction.orderId,
      tenant_id: tenantId
    });

    return transaction;
  }

  async queryTransactionStatus(tenantId: string, transactionId: string): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: transactionId
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('MPesa query transaction status failed:', error);
        return { success: false, error: 'Failed to query transaction status' };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error querying MPesa transaction status:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async handleCallback(callbackData: Record<string, unknown>, tenantId: string): Promise<void> {
    try {
      const body = callbackData.Body as Record<string, unknown>;
      const stkCallback = body?.stkCallback as Record<string, unknown>;

      if (!stkCallback) {
        console.error('Invalid callback data:', callbackData);
        return;
      }

      const checkoutRequestId = stkCallback.CheckoutRequestID as string;
      const resultCode = stkCallback.ResultCode as number;
      const resultDesc = stkCallback.ResultDesc as string;

      // Find transaction in database
      const { data: transaction, error } = await supabase
        .from('mpesa_transactions')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .eq('tenant_id', tenantId)
        .single();

      if (error || !transaction) {
        console.error('Transaction not found:', checkoutRequestId);
        return;
      }

      // Update transaction status based on result code
      let status: 'SUCCESS' | 'FAILED' = 'FAILED';
      let mpesaReceiptNumber: string | null = null;

      if (resultCode === 0) {
        status = 'SUCCESS';
        // Extract M-Pesa receipt number if available
        const callbackMetadata = (stkCallback.CallbackMetadata as Record<string, unknown>)?.Item as Array<Record<string, unknown>>;
        const receiptItem = callbackMetadata?.find(
          (item: Record<string, unknown>) => item.Name === 'MpesaReceiptNumber'
        );
        mpesaReceiptNumber = receiptItem?.Value as string || null;
      }

      // Update transaction in database
      const { error: updateError } = await supabase
        .from('mpesa_transactions')
        .update({
          status,
          mpesa_receipt_number: mpesaReceiptNumber,
          result_code: resultCode,
          result_description: resultDesc,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      if (transaction.order_id) {
        console.log(`Order ${transaction.order_id} paid via M-Pesa: ${mpesaReceiptNumber}`);
      }
    } catch (error) {
      console.error('Error in handleCallback:', error);
    }
  }

  async processPayment(amount: number, phoneNumber: string, tenantId: string): Promise<Record<string, unknown>> {
    const accessToken = await this.getAccessToken();

    const payload = {
      InitiatorName: 'testapi', // This should be configured
      SecurityCredential: 'encrypted_credential', // This needs proper encryption
      CommandID: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: this.formatPhoneNumber(phoneNumber),
      PartyB: this.config.businessShortCode,
      Remarks: 'Payment processing',
      QueueTimeOutURL: `${this.config.callbackUrl}/payment/timeout`,
      ResultURL: `${this.config.callbackUrl}/payment/result`,
      Occasion: 'Payment'
    };

    const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.ResponseCode !== '0') {
      throw new Error(data.ResponseDescription || 'Payment failed');
    }

    return {
      CheckoutRequestID: data.CheckoutRequestID,
      CustomerMessage: data.CustomerMessage,
      ResponseCode: data.ResponseCode,
      ResponseDescription: data.ResponseDescription
    };
  }

  async processBulkPayments(request: BulkPaymentRequest, _tenantId: string): Promise<Record<string, unknown>> {
    const accessToken = await this.getAccessToken();

    const payload = {
      InitiatorName: 'testapi', // This should be configured
      SecurityCredential: 'encrypted_credential', // This needs proper encryption
      CommandID: 'BusinessPayment',
      Amount: request.payments.reduce((sum, payment) => sum + payment.amount, 0),
      PartyA: this.config.businessShortCode,
      PartyB: this.config.businessShortCode,
      Remarks: 'Bulk payment processing',
      QueueTimeOutURL: `${this.config.callbackUrl}/bulk/timeout`,
      ResultURL: `${this.config.callbackUrl}/bulk/result`,
      Occasion: 'Bulk payment'
    };

    const response = await fetch(`${this.baseUrl}/mpesa/b2c/v1/paymentrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  }

  async reconcileTransactions(tenantId: string, date: string): Promise<Record<string, unknown>[]> {
    // Get all transactions for the date
    const { data: transactions, error } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at', `${date}T23:59:59.999Z`);

    if (error) {
      throw new Error('Failed to fetch transactions for reconciliation');
    }

    // Here you would typically fetch M-Pesa statement data
    // and compare with your database records
    const reconciliationReport = transactions?.map(transaction => ({
      transactionId: transaction.transaction_id,
      amount: transaction.amount,
      status: transaction.status,
      phoneNumber: transaction.phone_number,
      reconciled: transaction.status === 'SUCCESS' // Simplified logic
    })) || [];

    return reconciliationReport;
  }

  // Utility methods for Kenya-specific features
  async checkDailyLimits(phoneNumber: string, amount: number): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    const today = new Date().toISOString().split('T')[0];

    const { data: todayTransactions } = await supabase
      .from('mpesa_transactions')
      .select('amount')
      .eq('phone_number', formattedPhone)
      .eq('status', 'SUCCESS')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    const dailyTotal = todayTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const DAILY_LIMIT = 300000; // KES 300,000 M-Pesa daily limit

    return (dailyTotal + amount) <= DAILY_LIMIT;
  }

  async suggestOptimalPaymentTiming(amount: number): Promise<string> {
    // Suggest best times for M-Pesa transactions based on network load
    const hour = new Date().getHours();

    if (hour >= 6 && hour <= 9) {
      return 'Peak morning hours - transaction may be slower';
    } else if (hour >= 17 && hour <= 20) {
      return 'Peak evening hours - transaction may be slower';
    } else if (hour >= 22 || hour <= 5) {
      return 'Off-peak hours - optimal transaction time';
    } else {
      return 'Good time for transaction';
    }
  }

  private calculateTransactionFee(amount: number): number {
    if (amount <= 100) return 0;
    if (amount <= 500) return 7;
    if (amount <= 1000) return 13;
    if (amount <= 1500) return 23;
    if (amount <= 2500) return 33;
    if (amount <= 3500) return 53;
    if (amount <= 5000) return 57;
    if (amount <= 7500) return 78;
    if (amount <= 10000) return 90;
    if (amount <= 15000) return 108;
    if (amount <= 20000) return 115;
    if (amount <= 35000) return 167;
    if (amount <= 50000) return 185;
    if (amount <= 150000) return 197;
    return 300; // Above 150,000
  }
}

// Kenya-specific M-Pesa utilities
export const MPESA_UTILS = {
  TRANSACTION_FEES: {
    // M-Pesa transaction fees (as of 2025)
    calculateFee: (amount: number): number => {
      if (amount <= 100) return 0;
      if (amount <= 500) return 7;
      if (amount <= 1000) return 13;
      if (amount <= 1500) return 23;
      if (amount <= 2500) return 33;
      if (amount <= 3500) return 53;
      if (amount <= 5000) return 57;
      if (amount <= 7500) return 78;
      if (amount <= 10000) return 90;
      if (amount <= 15000) return 108;
      if (amount <= 20000) return 115;
      if (amount <= 35000) return 167;
      if (amount <= 50000) return 185;
      if (amount <= 150000) return 197;
      return 300; // Above 150,000
    }
  },

  NETWORK_CODES: {
    SAFARICOM: ['070', '071', '072', '074', '075', '076', '077', '078', '079'],
    AIRTEL: ['073', '078', '050', '051', '052', '053'],
    TELKOM: ['077']
  },

  validateKenyanNumber: (phoneNumber: string): boolean => {
    const formatted = phoneNumber.replace(/\D/g, '');
    if (formatted.startsWith('254')) {
      const localNumber = formatted.substring(3);
      return localNumber.length === 9 && localNumber.startsWith('7');
    }
    if (formatted.startsWith('0')) {
      return formatted.length === 10 && formatted.startsWith('07');
    }
    return false;
  }
};