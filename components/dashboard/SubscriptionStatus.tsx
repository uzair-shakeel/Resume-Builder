"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Crown,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface SubscriptionData {
  hasActiveSubscription: boolean;
  plan: string;
  type: string;
  email: string;
  startDate: string;
  endDate: string;
  expiresAt: string;
  remainingDays: number;
  status: string;
  amount: number;
  currency: string;
  paymentReference: string;
}

export default function SubscriptionStatus() {
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription/status");
      const data = await response.json();

      if (response.ok) {
        setSubscription(data);
        setError(null);
      } else {
        setError(data.message || "Failed to check subscription status");
      }
    } catch (err) {
      setError("Network error while checking subscription");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "yearly":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "quarterly":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "monthly":
        return <Clock className="w-5 h-5 text-green-500" />;
      case "trial":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "yearly":
        return "Yearly Plan";
      case "quarterly":
        return "Quarterly Plan";
      case "monthly":
        return "Monthly Plan";
      case "trial":
        return "Trial Plan";
      default:
        return "Unknown Plan";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "expired":
        return "text-red-600 bg-red-100";
      case "canceled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRemainingDaysColor = (days: number) => {
    if (days <= 7) return "text-red-600";
    if (days <= 30) return "text-orange-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 text-red-600">
          <XCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Subscription</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
        <button
          onClick={checkSubscriptionStatus}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!subscription?.hasActiveSubscription) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            No Active Subscription
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          You don't have an active subscription. Subscribe to unlock premium
          features and unlimited downloads.
        </p>
        <div className="flex space-x-3">
          <a
            href="/pricing"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Plans
          </a>
          <a
            href="/test-payment"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Subscribe Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Active Subscription
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            subscription.status
          )}`}
        >
          {subscription.status.charAt(0).toUpperCase() +
            subscription.status.slice(1)}
        </span>
      </div>

      {/* Subscription Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Plan */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            {getPlanIcon(subscription.plan)}
            <span className="text-sm font-medium text-gray-600">Plan</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {getPlanName(subscription.plan)}
          </p>
        </div>

        {/* Type */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Type</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 capitalize">
            {subscription.type}
          </p>
        </div>

        {/* Amount */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Amount</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {subscription.amount} {subscription.currency}
          </p>
        </div>

        {/* Remaining Days */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Remaining</span>
          </div>
          <p
            className={`text-lg font-semibold ${getRemainingDaysColor(
              subscription.remainingDays
            )}`}
          >
            {subscription.remainingDays} days
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Subscription Period
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span>{formatDate(subscription.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>End Date:</span>
              <span>{formatDate(subscription.endDate)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono text-xs">
                {subscription.paymentReference}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{subscription.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
