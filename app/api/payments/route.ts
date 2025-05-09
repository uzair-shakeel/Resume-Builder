import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

/**
 * GET handler for retrieving payments (accessible to everyone)
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Build query
    const query: any = {};
    if (userId) {
      query.userId = userId;
    }

    // Add other filters
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (status) query.status = status;
    if (source) query.source = source;
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Fetch payments
    const payments = await Payment.find(query)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalPayments = await Payment.countDocuments(query);

    return NextResponse.json({
      payments,
      pagination: {
        total: totalPayments,
        page,
        limit,
        pages: Math.ceil(totalPayments / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new payment (accessible to everyone)
 */
export async function POST(req: Request) {
  try {
    await dbConnect();

    // Parse request body
    const paymentData = await req.json();

    // Validate required fields
    if (!paymentData.userId || !paymentData.amount || !paymentData.source) {
      return NextResponse.json(
        { error: "User ID, amount, and source are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const userExists = await User.findById(paymentData.userId);
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the payment
    const payment = await Payment.create(paymentData);

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
