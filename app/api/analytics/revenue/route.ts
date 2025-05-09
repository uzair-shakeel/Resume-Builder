import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

/**
 * GET handler for retrieving revenue statistics
 * Provides total revenue, monthly breakdown, and source breakdown
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Get current date information for monthly stats
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 11); // Last 12 months (current + 11 previous)
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Calculate total revenue of completed payments
    const totalRevenueResult = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // Get monthly revenue for the last 12 months
    const monthlyRevenue = await getMonthlyRevenue(sixMonthsAgo, today);

    // Get revenue by source (subscription plan)
    const revenueBySource = await getRevenueBySource();

    // Return the compiled statistics with CORS headers
    const responseData = {
      totalRevenue,
      monthlyRevenue: monthlyRevenue.map((month) => month.amount),
      revenueBySource,
      months: monthlyRevenue.map((month) => month.monthName),
    };

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // In production, replace with specific origins
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching revenue statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler to respond to preflight requests
 */
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // In production, replace with specific origins
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Gets monthly revenue data
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and amount
 */
async function getMonthlyRevenue(startDate: Date, endDate: Date) {
  const monthlyRevenue = [];

  // Create a copy of the start date to iterate through months
  const currentDate = new Date(startDate);

  // Loop through each month
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Calculate the start and end of the month
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of month

    // Calculate total revenue for this month
    const monthRevenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: monthStart, $lte: monthEnd },
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Add to results
    monthlyRevenue.push({
      year,
      month: month + 1, // Make month 1-based (Jan = 1)
      monthName: new Date(year, month).toLocaleString("default", {
        month: "long",
      }),
      amount: monthRevenue.length > 0 ? monthRevenue[0].total : 0,
    });

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthlyRevenue;
}

/**
 * Gets revenue breakdown by source
 * @returns An array of sources and their respective revenue amounts
 */
async function getRevenueBySource() {
  const sourceRevenue = await Payment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$source", amount: { $sum: "$amount" } } },
    { $sort: { amount: -1 } },
    { $project: { _id: 0, source: "$_id", amount: 1 } },
  ]);

  return sourceRevenue;
}
