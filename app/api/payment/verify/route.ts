import { NextRequest, NextResponse } from "next/server";

// In production, use environment variables for the secret key
const PAYSTACK_SECRET_KEY = "sk_test_your_paystack_secret_key";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      {
        status: false,
        message: "No reference provided",
      },
      { status: 400 }
    );
  }

  try {
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

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      // Update user's subscription status in your database here

      return NextResponse.json({
        status: true,
        message: "Payment verified successfully",
        data: {
          reference: data.data.reference,
          amount: data.data.amount,
          email: data.data.customer.email,
        },
      });
    } else {
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
      },
      { status: 500 }
    );
  }
}
