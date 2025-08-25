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
  Download,
  FileText,
  Mail,
  RefreshCw,
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

export default function SubscriptionPage() {
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
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case "quarterly":
        return <Calendar className="w-6 h-6 text-blue-500" />;
      case "monthly":
        return <Clock className="w-6 h-6 text-green-500" />;
      case "trial":
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-500" />;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Subscription
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={checkSubscriptionStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subscription?.hasActiveSubscription) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Active Subscription
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              You don't have an active subscription. Subscribe to unlock premium
              features and unlimited downloads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Plans
              </Link>
              <Link
                href="/test-payment"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Subscribe Now
              </Link>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Free Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Create unlimited CVs and cover letters</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Access to all templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span>Limited downloads (3 per month)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span>No priority support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Premium Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Unlimited downloads</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Advanced customization options</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Export to multiple formats</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getPlanIcon(subscription.plan)}
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Management
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Manage your {getPlanName(subscription.plan)} subscription
          </p>
        </div>

        {/* Main Subscription Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Active Subscription
              </h2>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                subscription.status
              )}`}
            >
              {subscription.status.charAt(0).toUpperCase() +
                subscription.status.slice(1)}
            </span>
          </div>

          {/* Subscription Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                {getPlanIcon(subscription.plan)}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Plan</h3>
              <p className="text-xl font-semibold text-gray-900">
                {getPlanName(subscription.plan)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Type</h3>
              <p className="text-xl font-semibold text-gray-900 capitalize">
                {subscription.type}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Amount</h3>
              <p className="text-xl font-semibold text-gray-900">
                {subscription.amount} {subscription.currency}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Remaining
              </h3>
              <p
                className={`text-xl font-semibold ${getRemainingDaysColor(
                  subscription.remainingDays
                )}`}
              >
                {subscription.remainingDays} days
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-lg">
                Subscription Period
              </h4>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Start Date:</span>
                  <span>{formatDate(subscription.startDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">End Date:</span>
                  <span>{formatDate(subscription.endDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${getStatusColor(
                      subscription.status
                    )}`}
                  >
                    {subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-lg">
                Payment Details
              </h4>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Reference:</span>
                  <span className="font-mono text-sm">
                    {subscription.paymentReference}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Email:</span>
                  <span>{subscription.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Currency:</span>
                  <span>{subscription.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={checkSubscriptionStatus}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh Status
              </button>
              <Link
                href="/pricing"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
              >
                Manage Subscription
              </Link>
              <Link
                href="/test-payment"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Renew Subscription
              </Link>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              CVs Created
            </h3>
            <p className="text-3xl font-bold text-blue-600">∞</p>
            <p className="text-sm text-gray-600">Unlimited</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Mail className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cover Letters
            </h3>
            <p className="text-3xl font-bold text-green-600">∞</p>
            <p className="text-sm text-gray-600">Unlimited</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Download className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Downloads
            </h3>
            <p className="text-3xl font-bold text-purple-600">∞</p>
            <p className="text-sm text-gray-600">Unlimited</p>
          </div>
        </div>
      </div>
    </div>
  );
}
