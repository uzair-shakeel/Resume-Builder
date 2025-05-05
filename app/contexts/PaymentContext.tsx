"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initializePayment,
  verifyPayment,
  PaymentVerificationResult,
} from "../utils/paystack";

// Subscription plan types
export type SubscriptionInterval = "monthly" | "quarterly" | "yearly" | "trial";

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
  durationDays: number;
}

interface SubscriptionInfo {
  id: string;
  plan: SubscriptionInterval;
  type: "cv" | "cover-letter" | "all";
  startDate: Date;
  endDate: Date;
  remainingDays: number;
  amount: number;
  currency: string;
  status: "active" | "expired" | "canceled";
}

interface PaymentContextType {
  isPaymentModalOpen: boolean;
  hasActiveSubscription: boolean;
  openPaymentModal: (type: "cv" | "cover-letter") => void;
  closePaymentModal: () => void;
  processPayment: (email: string, plan: SubscriptionPlan) => Promise<boolean>;
  loading: boolean;
  currentPlan: SubscriptionPlan | null;
  subscriptionInfo: SubscriptionInfo | null;
  subscriptionEmail: string | null;
  subscriptionExpiry: Date | null;
  checkSubscriptionStatus: () => Promise<void>;
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
    durationDays: 30,
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
    durationDays: 90,
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
    durationDays: 365,
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
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [subscriptionEmail, setSubscriptionEmail] = useState<string | null>(
    null
  );
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(
    null
  );

  // Check user's subscription status on load
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      // Always fetch fresh data from the server
      setLoading(true);
      const response = await fetch("/api/subscription/status", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        // Add a random query parameter to prevent caching
        // This is important for security to ensure we always get fresh data
        cache: "no-store",
      });
      const data = await response.json();
      setLoading(false);

      console.log("Direct database subscription status check:", data);

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

        // Set detailed subscription info if available
        if (data.source === "database") {
          setSubscriptionInfo({
            id: data.subscriptionId,
            plan: data.plan,
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            remainingDays: data.remainingDays,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
          });
        }
      } else {
        // Reset subscription data if no active subscription
        setCurrentPlan(null);
        setSubscriptionEmail(null);
        setSubscriptionExpiry(null);
        setSubscriptionInfo(null);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setLoading(false);

      // Fallback to cookie check if server request fails
      // This is only used if the API is completely unavailable
      checkCookies();
    }
  };

  const checkCookies = () => {
    console.warn(
      "API request failed - falling back to cookie check as last resort"
    );
    console.warn("This is only a UI fallback and will not grant actual access");

    try {
      // Attempt to check cookies as an absolute last resort
      // This is only used to show appropriate UI elements if the API is down
      // It will NOT actually grant access to premium features
      const hasSub = getCookie("hasActiveSubscription") === "true";

      // Only accept cookies if they're properly set
      const planId = getCookie("subscriptionPlan");
      const email = getCookie("subscriptionEmail");

      // We only set this to true if we have all three cookies with valid values
      const hasValidCookies = hasSub && !!planId && !!email;

      // This is strictly for UI purposes - actual access will be verified server-side
      setHasActiveSubscription(hasValidCookies);

      if (hasValidCookies && planId) {
        const planDetails = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
        setCurrentPlan(planDetails || null);
        setSubscriptionEmail(email);
      } else {
        // If not all cookies are valid, reset everything
        setHasActiveSubscription(false);
        setCurrentPlan(null);
        setSubscriptionEmail(null);
        setSubscriptionExpiry(null);
        setSubscriptionInfo(null);
      }

      console.warn("Cookie fallback complete - this is only for UI display");
    } catch (e) {
      console.error("Error checking cookies:", e);
      // If cookie check fails, assume no subscription
      setHasActiveSubscription(false);
      setCurrentPlan(null);
      setSubscriptionEmail(null);
      setSubscriptionExpiry(null);
      setSubscriptionInfo(null);
    }
  };

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
    try {
      setLoading(true);

      // Generate reference
      const reference = `trx_${Date.now()}_${Math.floor(
        Math.random() * 1000000
      )}`;

      // Initialize payment via server
      const authorizationUrl = await initializePayment({
        email,
        amount: plan.trialPriceRaw,
        reference,
        metadata: {
          plan: plan.id,
          type: currentDownloadType,
          amount: plan.trialPriceRaw,
        },
      });

      // Redirect to Paystack
      window.location.href = authorizationUrl;

      // Return true to indicate initialization was successful
      // (user will be redirected, so this return value isn't really used)
      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
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
        subscriptionInfo,
        subscriptionEmail,
        subscriptionExpiry,
        checkSubscriptionStatus,
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
