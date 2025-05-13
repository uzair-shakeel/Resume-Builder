import { NextRequest, NextResponse } from "next/server";

// In production, use environment variables for the secret key
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");

  console.log("Payment verification requested for reference:", reference);

  if (!reference) {
    console.error("Payment verification failed: No reference provided");
    return NextResponse.json(
      {
        status: false,
        message: "No reference provided",
      },
      { status: 400 }
    );
  }

  try {
    console.log("Sending verification request to Paystack API");
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Paystack API responded with error status:",
        response.status
      );
      return NextResponse.json(
        {
          status: false,
          message: `Paystack API error: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(
      "Paystack verification response:",
      JSON.stringify(data, null, 2)
    );

    if (data.status && data.data.status === "success") {
      console.log("Payment verification successful for reference:", reference);
      // Update user's subscription status in your database here

      // Extract metadata from Paystack response
      const metadata = data.data.metadata || {};
      const plan = metadata.plan || "monthly";
      const type = metadata.type || "cv";

      return NextResponse.json({
        status: true,
        message: "Payment verified successfully",
        data: {
          reference: data.data.reference,
          amount: data.data.amount,
          email: data.data.customer.email,
          plan,
          type,
        },
      });
    } else {
      console.error(
        "Payment verification failed:",
        data.message || "Unknown reason"
      );
      return NextResponse.json(
        {
          status: false,
          message: "Payment verification failed",
          data: data,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Server error during payment verification",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
