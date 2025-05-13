import { NextRequest, NextResponse } from "next/server";

// Keep API key on server side for security
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // This key should work based on previous files
const PAYSTACK_API_URL = process.env.PAYSTACK_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, reference, metadata } = body;

    // Validation
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    console.log(`Initializing payment for ${email} with amount ${amount}`);

    // The amount is already in kobo/cents coming from the client
    const paymentAmount = Math.round(Number(amount));

    console.log(`Amount in kobo/cents: ${paymentAmount}`);

    // Call Paystack API to initialize transaction
    const response = await fetch(PAYSTACK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: paymentAmount, // Already in kobo/cents
        reference,
        callback_url: `${
          request.nextUrl.origin
        }/payment/verify?reference=${reference}&plan=${
          metadata?.plan || "monthly"
        }&type=${metadata?.type || "cv"}`,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: "Resume Builder",
              variable_name: "resume_builder",
              value: "premium_subscription",
            },
          ],
        },
      }),
    });

    const responseData = await response.json();
    console.log("Paystack response:", responseData);

    if (responseData.status) {
      return NextResponse.json(responseData);
    } else {
      console.error("Paystack error:", responseData);
      return NextResponse.json(
        { error: responseData.message || "Payment initialization failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error initializing payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
