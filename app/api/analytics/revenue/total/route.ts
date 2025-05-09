import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await dbConnect();

    // Calculate total revenue from completed payments
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Return the total revenue, divided by 100 to convert from cents to dollars
    return NextResponse.json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total / 100 : 0,
      currency: "USD",
    });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return NextResponse.json(
      { error: "Failed to fetch total revenue" },
      { status: 500 }
    );
  }
}
