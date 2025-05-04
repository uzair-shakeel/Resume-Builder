import { loadScript } from "./scriptLoader";

// For security, in production you should use environment variables for these values
const PAYSTACK_PUBLIC_KEY = "pk_test_your_paystack_public_key";
const PAYSTACK_TRANSACTION_AMOUNT = 99; // 0.99 USD in cents

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    access_code: string;
    authorization_url: string;
  };
}

export interface PaymentConfig {
  email: string;
  amount: number;
  reference?: string;
  callback?: (response: any) => void;
  onClose?: () => void;
  metadata?: Record<string, any>;
}

// Initialize Paystack
export const initializePaystack = async (): Promise<boolean> => {
  try {
    await loadScript("https://js.paystack.co/v1/inline.js");
    return true;
  } catch (error) {
    console.error("Failed to load Paystack:", error);
    return false;
  }
};

// Open Paystack payment popup
export const openPaystackPopup = (config: PaymentConfig): void => {
  if (typeof window === "undefined" || !(window as any).PaystackPop) {
    console.error("Paystack not loaded");
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount || PAYSTACK_TRANSACTION_AMOUNT,
    currency: "USD",
    ref: config.reference || generateReference(),
    callback: config.callback,
    onClose: config.onClose,
    metadata: config.metadata || {
      custom_fields: [
        {
          display_name: "Resume Builder",
          variable_name: "resume_builder",
          value: "premium_download",
        },
      ],
    },
  });

  handler.openIframe();
};

// Generate a unique transaction reference
export const generateReference = (): string => {
  return `trx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
};

// Verify payment on the server side
export const verifyPayment = async (
  reference: string
): Promise<PaystackResponse> => {
  try {
    const response = await fetch(`/api/payment/verify?reference=${reference}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      status: false,
      message: "Payment verification failed",
    };
  }
};
