"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface PaymentStatus {
  hasActiveSubscription: boolean;
  status: string;
  remainingDays: number;
}

export default function PaymentStatusIndicator() {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch("/api/subscription/status");
      const data = await response.json();

      if (response.ok) {
        setStatus({
          hasActiveSubscription: data.hasActiveSubscription,
          status: data.status || "unknown",
          remainingDays: data.remainingDays || 0,
        });
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
        <Clock className="w-4 h-4 text-gray-500 animate-spin" />
        <span className="text-xs text-gray-600">Checking...</span>
      </div>
    );
  }

  if (!status?.hasActiveSubscription) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 rounded-full">
        <XCircle className="w-4 h-4 text-red-500" />
        <span className="text-xs text-red-600">No Subscription</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "canceled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "expired":
        return "bg-red-100 text-red-600";
      case "canceled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-orange-100 text-orange-600";
    }
  };

  const getStatusText = () => {
    if (status.status === "active") {
      if (status.remainingDays <= 7) {
        return `${status.remainingDays}d left`;
      }
      return "Active";
    }
    return status.status.charAt(0).toUpperCase() + status.status.slice(1);
  };

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor()}`}
    >
      {getStatusIcon()}
      <span className="text-xs font-medium">{getStatusText()}</span>
    </div>
  );
}
