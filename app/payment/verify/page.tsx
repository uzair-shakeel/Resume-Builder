"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment, PaymentVerificationResult } from "@/app/utils/paystack";

export default function PaymentVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("Vérification du paiement...");

  useEffect(() => {
    const reference = searchParams?.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage("Référence de paiement manquante.");
      return;
    }

    async function verify() {
      try {
        setStatus("loading");
        setMessage("Vérification du paiement...");

        // Call our API to verify the payment
        const result = await verifyPayment(reference as string);

        if (result.status) {
          // Payment was successful
          setStatus("success");
          setMessage("Paiement réussi! Enregistrement de votre abonnement...");

          // Register the subscription
          const email = result.data?.email || "";
          const plan =
            searchParams?.get("plan") || result.data?.plan || "trial";
          const type = searchParams?.get("type") || result.data?.type || "cv";
          const amount =
            result.data?.amount ||
            parseInt(searchParams?.get("amount") || "99", 10);

          try {
            console.log("Registering subscription with:", {
              reference,
              email,
              plan,
              type,
              amount,
            });

            const registerResponse = await fetch("/api/subscription/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                reference,
                email,
                plan,
                type,
                amount,
              }),
            });

            if (registerResponse.ok) {
              const registerData = await registerResponse.json();

              setMessage(
                `Abonnement "${plan}" activé avec succès! Redirection...`
              );

              // Redirect back to the builder page after 2 seconds
              setTimeout(() => {
                if (type === "cv") {
                  router.push("/builder");
                } else if (type === "cover-letter") {
                  router.push("/builder/cover-letter");
                } else {
                  router.push("/");
                }
              }, 2000);
            } else {
              const errorData = await registerResponse.json();
              console.error("Failed to register subscription:", errorData);
              setMessage(
                `Paiement réussi, mais erreur lors de l'activation de l'abonnement: ${
                  errorData.message || "Erreur inconnue"
                }. Veuillez contacter le support.`
              );
            }
          } catch (error) {
            console.error("Error registering subscription:", error);
            setMessage(
              "Paiement réussi, mais erreur lors de l'activation de l'abonnement. Veuillez contacter le support."
            );
          }
        } else {
          // Payment failed
          setStatus("error");
          setMessage(`Échec du paiement: ${result.message}`);
        }
      } catch (error) {
        console.error("Error during payment verification:", error);
        setStatus("error");
        setMessage(
          "Une erreur s'est produite lors de la vérification du paiement."
        );
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {status === "loading" && "Vérification du paiement"}
          {status === "success" && "Paiement Réussi"}
          {status === "error" && "Échec du Paiement"}
        </h1>

        <div className="text-center mb-6">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          )}
          {status === "success" && (
            <div className="text-green-500 text-6xl mb-4">✓</div>
          )}
          {status === "error" && (
            <div className="text-red-500 text-6xl mb-4">✗</div>
          )}

          <p className="text-gray-700">{message}</p>
        </div>

        {status === "error" && (
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Retourner à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
