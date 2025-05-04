"use client";

import { useState } from "react";
import { initializePayment } from "../utils/paystack";

export default function TestPaymentPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const handleTestPayment = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    addLog("Starting payment test...");

    try {
      // Generate a reference
      const reference = `test_${Date.now()}`;
      addLog(`Generated reference: ${reference}`);

      // Call the payment initialization
      addLog("Calling initializePayment...");
      const authorizationUrl = await initializePayment({
        email,
        amount: 99, // 99 cents
        reference,
        metadata: {
          plan: "monthly",
          type: "cv",
        },
      });

      addLog(`Received authorization URL: ${authorizationUrl}`);

      // Redirect to Paystack
      window.location.href = authorizationUrl;
    } catch (error: any) {
      setError(error.message || "An unknown error occurred");
      addLog(`ERROR: ${error.message || "Unknown error"}`);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Test Paystack Payment</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="your.email@example.com"
        />
      </div>

      <button
        onClick={handleTestPayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Test Payment ($0.99)"}
      </button>

      {logs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Logs:</h2>
          <div className="bg-gray-100 p-3 rounded h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-xs font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded text-sm">
        <h3 className="font-medium mb-2">Testing Info:</h3>
        <p className="mb-2">Use these test card details:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Card Number: 4084 0840 8408 4081</li>
          <li>CVV: Any 3 digits</li>
          <li>Expiry Date: Any future date</li>
          <li>PIN: 1234</li>
          <li>OTP: 123456</li>
        </ul>
      </div>
    </div>
  );
}
