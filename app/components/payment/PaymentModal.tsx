import React, { useState, useEffect } from "react";
import { X, CreditCard, Wallet, BarChart4 } from "lucide-react";
import { initializePayment } from "../../utils/paystack";

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
    durationDays: 14,
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
    durationDays: 42,
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
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "gpay"
  >("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(
    SUBSCRIPTION_PLANS[0]
  );
  const [paystackInitialized, setPaystackInitialized] = useState(true);

  if (!isOpen) return null;

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === e.target.value);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  const validateForm = () => {
    if (!email || !email.includes("@")) {
      alert("Veuillez saisir une adresse e-mail valide");
      return false;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.length < 16) {
        alert("Veuillez saisir un numéro de carte valide");
        return false;
      }

      if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
        alert("Veuillez saisir une date d'expiration valide (MM/AA)");
        return false;
      }

      if (!cvv || cvv.length < 3) {
        alert("Veuillez saisir un code de sécurité valide");
        return false;
      }
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Generate a unique transaction reference
      const reference = `trx_${Date.now()}_${Math.floor(
        Math.random() * 1000000
      )}`;

      console.log(
        "Starting payment process with email:",
        email,
        "plan:",
        selectedPlan.id,
        "amount:",
        selectedPlan.trialPriceRaw
      );

      // Use the server-side initialization approach
      const authorizationUrl = await initializePayment({
        email,
        amount: selectedPlan.trialPriceRaw, // Amount in cents
        reference,
        metadata: {
          plan: selectedPlan.id,
          type: type,
          amount: selectedPlan.trialPriceRaw,
          duration: selectedPlan.durationDays,
        },
      });

      console.log("Got authorization URL:", authorizationUrl);

      // Redirect to Paystack checkout page
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      alert(
        `Une erreur s'est produite: ${
          error.message || "Erreur inconnue"
        }. Veuillez réessayer plus tard.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-xl">
        <div className="flex justify-between items-center bg-black p-4">
          <h2 className="text-white font-medium">Compte</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[85vh]">
          <h3 className="text-xl font-medium text-gray-900 mb-6">
            Activez votre abonnement
          </h3>

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
              <div className="text-sm text-gray-500">pour 14 jours</div>
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

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              placeholder="votremail@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              className={`border rounded-md p-3 flex flex-col items-center justify-center ${
                paymentMethod === "card" ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="bg-blue-600 text-white p-2 rounded mb-1">
                <CreditCard size={20} />
              </div>
              <span className="text-xs text-center">Carte de crédit</span>
            </button>

            <button
              className={`border rounded-md p-3 flex flex-col items-center justify-center ${
                paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              <div className="bg-blue-500 text-white p-2 rounded mb-1">
                <Wallet size={20} />
              </div>
              <span className="text-xs text-center">PayPal</span>
            </button>

            <button
              className={`border rounded-md p-3 flex flex-col items-center justify-center ${
                paymentMethod === "gpay" ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setPaymentMethod("gpay")}
            >
              <div className="bg-green-600 text-white p-2 rounded mb-1">
                <BarChart4 size={20} />
              </div>
              <span className="text-xs text-center">Google Pay</span>
            </button>
          </div>

          {paymentMethod === "card" && (
            <form onSubmit={handlePayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Numéro de la carte
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Recto de la carte au format MM/AA
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Code de sécurité
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="123"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      3 chiffres sur le verso de la carte
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-4"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Traitement en cours..."
                    : `Payer ${selectedPlan.trialPrice}`}
                </button>
              </div>
            </form>
          )}

          {(paymentMethod === "paypal" || paymentMethod === "gpay") && (
            <div className="mt-4">
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Traitement en cours..."
                  : `Payer avec ${
                      paymentMethod === "paypal" ? "PayPal" : "Google Pay"
                    }`}
              </button>
            </div>
          )}

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
