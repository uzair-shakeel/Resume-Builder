"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment, PaymentVerificationResult } from "@/app/utils/paystack";
import { useSession } from "next-auth/react";
import { RefreshCw } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("Vérification du paiement...");

  useEffect(() => {
    // Wait for session to be loaded
    if (sessionStatus === "loading") return;

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

          // Get the email from session if available, otherwise use the one from payment result
          const email = session?.user?.email || result.data?.email || "";

          // Get other parameters from search params or fallback to result data
          const plan =
            searchParams?.get("plan") || result.data?.plan || "monthly";
          const type = searchParams?.get("type") || result.data?.type || "cv";
          const amount =
            parseInt(searchParams?.get("amount") || "0", 10) ||
            result.data?.amount ||
            99;
          const duration =
            parseInt(searchParams?.get("duration") || "0", 10) || 30;

          try {
            console.log("Registering subscription with:", {
              reference,
              email,
              plan,
              type,
              amount,
              duration,
              userId: (session?.user as any)?.id || null,
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
                duration,
                userId: (session?.user as any)?.id || null,
                name: session?.user?.name || null,
              }),
            });

            if (registerResponse.ok) {
              const registerData = await registerResponse.json();

              setMessage(
                `Abonnement "${plan}" activé avec succès pour ${email}! Redirection...`
              );

              // Add a forced refresh of the subscription status
              try {
                await fetch("/api/subscription/status", {
                  method: "GET",
                  headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                  },
                  cache: "no-store",
                });
                console.log("Subscription status refreshed after payment");
              } catch (refreshError) {
                console.error(
                  "Error refreshing subscription status:",
                  refreshError
                );
              }

              // Wait a bit longer to ensure the subscription is properly registered
              // Redirect back to the builder page after 3 seconds instead of 2
              setTimeout(() => {
                if (type === "cv") {
                  router.push("/builder");
                } else if (type === "cover-letter") {
                  router.push("/builder/cover-letter");
                } else {
                  router.push("/");
                }
              }, 3000);
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
  }, [searchParams, router, session, sessionStatus]);

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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          )}
          {status === "success" && (
            <div className="text-green-500 text-6xl mb-4">✓</div>
          )}
          {status === "error" && (
            <div className="text-red-500 text-6xl mb-4">✗</div>
          )}

          <p className="text-gray-700">{message}</p>

          {sessionStatus === "unauthenticated" && status === "success" && (
            <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Pour conserver votre abonnement entre les sessions, nous vous
                recommandons de vous connecter à votre compte.
              </p>
            </div>
          )}
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

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
