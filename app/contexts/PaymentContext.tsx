"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initializePaystack,
  openPaystackPopup,
  verifyPayment,
} from "../utils/paystack";

// Subscription plan types
export type SubscriptionInterval = "monthly" | "quarterly" | "yearly";

export interface SubscriptionPlan {
  id: string;
  name: string;
  trialPrice: string;
  trialPriceRaw: number;
  regularPrice: string;
  regularPriceRaw: number;
  billingPeriod: string;
  interval: SubscriptionInterval;
  totalPrice?: string;
}

interface PaymentContextType {
  isPaymentModalOpen: boolean;
  hasActiveSubscription: boolean;
  openPaymentModal: (type: "cv" | "cover-letter") => void;
  closePaymentModal: () => void;
  processPayment: (email: string, plan: SubscriptionPlan) => Promise<boolean>;
  loading: boolean;
  currentPlan: SubscriptionPlan | null;
  subscriptionEmail: string | null;
  subscriptionExpiry: Date | null;
}

interface PaystackResponse {
  status: string;
  reference: string;
  message: string;
  transaction: string;
}

// Default subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Mensuel",
    trialPrice: "0,99 US$",
    trialPriceRaw: 99, // 0.99 USD in cents
    regularPrice: "14,99 US$",
    regularPriceRaw: 1499, // 14.99 USD in cents
    billingPeriod: "mois",
    interval: "monthly",
  },
  {
    id: "quarterly",
    name: "Trimestriel",
    trialPrice: "0,99 US$",
    trialPriceRaw: 99, // 0.99 USD in cents
    regularPrice: "9,99 US$",
    regularPriceRaw: 999, // 9.99 USD in cents
    billingPeriod: "mois",
    interval: "quarterly",
    totalPrice: "29,97 US$ facturation trimestrielle",
  },
  {
    id: "yearly",
    name: "Annuel",
    trialPrice: "0,99 US$",
    trialPriceRaw: 99, // 0.99 USD in cents
    regularPrice: "7,49 US$",
    regularPriceRaw: 749, // 7.49 USD in cents
    billingPeriod: "mois",
    interval: "yearly",
    totalPrice: "89,88 US$ facturation annuelle",
  },
];

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [currentDownloadType, setCurrentDownloadType] = useState<
    "cv" | "cover-letter"
  >("cv");
  const [loading, setLoading] = useState(false);
  const [paystackInitialized, setPaystackInitialized] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionEmail, setSubscriptionEmail] = useState<string | null>(
    null
  );
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(
    null
  );

  // Check user's subscription status on load
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        // Try to get subscription details from the server
        const response = await fetch("/api/subscription/status");
        const data = await response.json();

        setHasActiveSubscription(data.hasActiveSubscription);

        if (data.hasActiveSubscription) {
          // If there's an active subscription, set the plan details
          if (data.plan) {
            const planDetails = SUBSCRIPTION_PLANS.find(
              (p) => p.id === data.plan
            );
            setCurrentPlan(planDetails || null);
          }

          if (data.email) {
            setSubscriptionEmail(data.email);
          }

          if (data.expiresAt) {
            setSubscriptionExpiry(new Date(data.expiresAt));
          }
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);

        // Fallback to cookie check if server request fails
        checkCookies();
      }
    };

    const checkCookies = () => {
      // Check cookies directly as a fallback
      const hasSub = getCookie("hasActiveSubscription") === "true";
      setHasActiveSubscription(hasSub);

      if (hasSub) {
        const planId = getCookie("subscriptionPlan");
        if (planId) {
          const planDetails = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
          setCurrentPlan(planDetails || null);
        }

        const email = getCookie("subscriptionEmail");
        if (email) {
          setSubscriptionEmail(email);
        }
      }
    };

    checkSubscriptionStatus();
  }, []);

  // Initialize Paystack
  useEffect(() => {
    const loadPaystack = async () => {
      if (typeof window !== "undefined" && !paystackInitialized) {
        const initialized = await initializePaystack();
        setPaystackInitialized(initialized);
      }
    };

    loadPaystack();
  }, [paystackInitialized]);

  const openPaymentModal = (type: "cv" | "cover-letter") => {
    setCurrentDownloadType(type);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const processPayment = async (
    email: string,
    plan: SubscriptionPlan
  ): Promise<boolean> => {
    setLoading(true);

    try {
      // Generate a unique reference
      const reference = `trx_${Date.now()}_${Math.floor(
        Math.random() * 1000000
      )}`;

      return new Promise((resolve) => {
        openPaystackPopup({
          email,
          amount: plan.trialPriceRaw, // Amount in cents
          reference,
          metadata: {
            custom_fields: [
              {
                display_name: "Plan",
                variable_name: "plan",
                value: plan.id,
              },
              {
                display_name: "Download Type",
                variable_name: "download_type",
                value: currentDownloadType,
              },
            ],
          },
          callback: async (response: PaystackResponse) => {
            if (response.status === "success") {
              try {
                // Register the subscription on the server
                const registerResponse = await fetch(
                  "/api/subscription/register",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      reference: response.reference,
                      email,
                      plan: plan.id,
                      type: currentDownloadType,
                    }),
                  }
                );

                const registerData = await registerResponse.json();

                if (registerData.success) {
                  // Verify payment on the server side
                  const verificationResult = await verifyPayment(
                    response.reference
                  );

                  if (verificationResult.status) {
                    // Update context state with subscription info
                    setCurrentPlan(plan);
                    setSubscriptionEmail(email);
                    setHasActiveSubscription(true);

                    if (registerData.data?.expiresAt) {
                      setSubscriptionExpiry(
                        new Date(registerData.data.expiresAt)
                      );
                    }

                    setLoading(false);
                    setIsPaymentModalOpen(false);
                    resolve(true);
                  } else {
                    console.error("Payment verification failed");
                    setLoading(false);
                    resolve(false);
                  }
                } else {
                  console.error("Subscription registration failed");
                  setLoading(false);
                  resolve(false);
                }
              } catch (error) {
                console.error("Error during subscription process:", error);
                // Still consider successful if Paystack transaction succeeded
                setHasActiveSubscription(true);
                setCurrentPlan(plan);
                setSubscriptionEmail(email);
                setLoading(false);
                setIsPaymentModalOpen(false);
                resolve(true);
              }
            } else {
              console.error("Paystack transaction failed");
              setLoading(false);
              resolve(false);
            }
          },
          onClose: () => {
            setLoading(false);
            resolve(false);
          },
        });
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      setLoading(false);
      return false;
    }
  };

  // Helper function to get cookies
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  return (
    <PaymentContext.Provider
      value={{
        isPaymentModalOpen,
        hasActiveSubscription,
        openPaymentModal,
        closePaymentModal,
        processPayment,
        loading,
        currentPlan,
        subscriptionEmail,
        subscriptionExpiry,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
