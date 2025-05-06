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
  checkSubscriptionStatus: (forceFresh?: boolean) => Promise<boolean>;
  isInitialized: boolean;
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
    id: "trial",
    name: "Essential",
    trialPrice: "99 XOF",
    trialPriceRaw: 9900, // in kobo (100 kobo = 1 Naira)
    regularPrice: "999 XOF",
    regularPriceRaw: 99900,
    billingPeriod: "one-time",
    interval: "trial",
    durationDays: 14,
  },
  {
    id: "monthly",
    name: "Monthly",
    trialPrice: "1,499 XOF",
    trialPriceRaw: 149900,
    regularPrice: "1,499 XOF",
    regularPriceRaw: 149900,
    billingPeriod: "month",
    interval: "monthly",
    durationDays: 30,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    trialPrice: "2,997 XOF",
    trialPriceRaw: 299700,
    regularPrice: "2,997 XOF",
    regularPriceRaw: 299700,
    billingPeriod: "3 months",
    interval: "quarterly",
    durationDays: 90,
  },
  {
    id: "yearly",
    name: "Yearly",
    trialPrice: "8,988 XOF",
    trialPriceRaw: 898800,
    regularPrice: "8,988 XOF",
    regularPriceRaw: 898800,
    billingPeriod: "year",
    interval: "yearly",
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
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [subscriptionEmail, setSubscriptionEmail] = useState<string | null>(
    null
  );
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState(0);

  // Check user's subscription status on load - but only once
  useEffect(() => {
    if (!isInitialized) {
      checkSubscriptionStatus(true).then(() => {
        setIsInitialized(true);
      });
    }
  }, [isInitialized]);

  const checkSubscriptionStatus = async (
    forceFresh = false
  ): Promise<boolean> => {
    try {
      // Check if we've checked recently (within the last 5 seconds) to avoid excessive API calls
      const now = Date.now();
      const timeSinceLastCheck = now - lastCheckTimestamp;

      if (!forceFresh && timeSinceLastCheck < 5000 && isInitialized) {
        console.log("Using cached subscription status - checked recently");
        return hasActiveSubscription;
      }

      // Always fetch fresh data from the server for important operations
      setLoading(true);

      // Add a random query parameter to prevent browser caching
      const params = new URLSearchParams({
        _t: now.toString(),
      });

      const response = await fetch(
        `/api/subscription/status?${params.toString()}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        console.error(
          "Subscription status API returned error:",
          response.status
        );
        setLoading(false);
        return false;
      }

      const data = await response.json();
      setLoading(false);
      setLastCheckTimestamp(now);

      console.log("Direct database subscription status check:", data);

      const newHasActiveSubscription = data.hasActiveSubscription || false;
      setHasActiveSubscription(newHasActiveSubscription);

      if (newHasActiveSubscription) {
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

      return newHasActiveSubscription;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setLoading(false);

      // Don't change any state on error - maintain the current state
      // This prevents flickering of UI or showing payment modals incorrectly
      console.warn("Maintaining current subscription state due to error");

      return hasActiveSubscription;
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
        isInitialized,
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
