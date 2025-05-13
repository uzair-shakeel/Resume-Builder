// Inline implementation of loadScript to avoid import issues
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (
      typeof document !== "undefined" &&
      document.querySelector(`script[src="${src}"]`)
    ) {
      resolve();
      return;
    }

    if (typeof document !== "undefined") {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    } else {
      resolve(); // Resolve for SSR
    }
  });
};

// For security, in production you should use environment variables for these values
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
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
  metadata?: Record<string, any>;
}

// Initialize payment via server-side API
export const initializePayment = async (
  config: PaymentConfig
): Promise<string> => {
  try {
    console.log("Initializing payment via API:", config);

    // Call our API to initialize the payment with Paystack
    const response = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: config.email,
        amount: config.amount,
        reference: config.reference || generateReference(),
        metadata: config.metadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Payment initialization failed:", data);
      throw new Error(data.message || "Failed to initialize payment");
    }

    if (!data.data?.authorization_url) {
      console.error("No authorization URL returned:", data);
      throw new Error("No payment URL returned");
    }

    console.log(
      "Payment initialized successfully, redirecting to:",
      data.data.authorization_url
    );
    return data.data.authorization_url;
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw error;
  }
};

// Generate a unique transaction reference
export const generateReference = (): string => {
  return `trx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
};

// Response type for our verification API
export interface PaymentVerificationResult {
  status: boolean;
  message: string;
  data?: {
    reference?: string;
    amount?: number;
    email?: string;
    plan?: string;
    type?: string;
  };
}

// Verify payment on the server side
export const verifyPayment = async (
  reference: string
): Promise<PaymentVerificationResult> => {
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
