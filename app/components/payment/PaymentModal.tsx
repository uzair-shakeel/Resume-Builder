import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { initializePayment } from "../../utils/paystack";
import { useSession } from "next-auth/react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "cv" | "cover-letter";
}

interface PlanOption {
  id: string;
  name: string;
  trialPrice: string;
  trialPriceRaw: number; // in cents
  regularPrice: string;
  regularPriceRaw: number; // in cents
  billingPeriod: string;
  interval: "monthly" | "quarterly" | "yearly";
  totalPrice?: string;
  durationDays: number;
}

const SUBSCRIPTION_PLANS: PlanOption[] = [
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

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type,
}) => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(
    SUBSCRIPTION_PLANS[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === e.target.value);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    // Get user email from session or prompt them to login
    const userEmail = session?.user?.email;

    if (!userEmail) {
      setError("Veuillez vous connecter pour continuer avec le paiement.");
      setIsProcessing(false);
      return;
    }

    try {
      // Generate a unique transaction reference
      const reference = `trx_${Date.now()}_${Math.floor(
        Math.random() * 1000000
      )}`;

      console.log(
        "Starting payment process with email:",
        userEmail,
        "plan:",
        selectedPlan.id,
        "amount:",
        selectedPlan.trialPriceRaw
      );

      // Use the server-side initialization approach
      const authorizationUrl = await initializePayment({
        email: userEmail,
        amount: selectedPlan.trialPriceRaw, // Amount in cents
        reference,
        metadata: {
          plan: selectedPlan.id,
          type: type,
          amount: selectedPlan.trialPriceRaw,
          duration: selectedPlan.durationDays,
          // Add additional user information from session if available
          name: session?.user?.name || "",
          userId: (session?.user as any)?.id || "",
        },
      });

      console.log("Got authorization URL:", authorizationUrl);

      // Redirect to Paystack checkout page
      if (authorizationUrl) {
        // Add additional query parameters to help with subscription registration
        const url = new URL(authorizationUrl);
        // Add extra query parameters to ensure we have all needed info when returning
        url.searchParams.append("plan", selectedPlan.id);
        url.searchParams.append("type", type);
        url.searchParams.append(
          "amount",
          selectedPlan.trialPriceRaw.toString()
        );
        url.searchParams.append(
          "duration",
          selectedPlan.durationDays.toString()
        );

        window.location.href = url.toString();
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      setError(
        error.message ||
          "Une erreur s'est produite. Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-xl">
        <div className="flex justify-between items-center bg-black p-4">
          <h2 className="text-white font-medium">Abonnement Premium</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-6">
            Choisissez votre formule d'abonnement
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {!session?.user && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              Vous devez être connecté pour accéder à cette fonctionnalité.
            </div>
          )}

          <div className="mb-6 border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <select
                className="border rounded-md px-3 py-2 w-full text-gray-700"
                value={selectedPlan.id}
                onChange={handlePlanChange}
              >
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center mb-2">
              <div className="text-4xl font-semibold">
                {selectedPlan.trialPrice}
              </div>
              <div className="text-sm text-gray-500">
                pour {selectedPlan.durationDays} jours
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                Ensuite {selectedPlan.regularPrice} /{" "}
                {selectedPlan.billingPeriod}
              </p>
              {selectedPlan.totalPrice && <p>({selectedPlan.totalPrice})</p>}
              {!selectedPlan.totalPrice && <p>(renouvellement automatique)</p>}
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={isProcessing || !session?.user}
          >
            {isProcessing
              ? "Traitement en cours..."
              : `Payer ${selectedPlan.trialPrice}`}
          </button>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              Après réception de votre paiement, le produit vous sera livré
              immédiatement et vous renvoyez votre droit de rétractation. Après
              14 jours, votre abonnement sera renouvelé automatiquement. Vous
              pouvez résilier votre abonnement à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
