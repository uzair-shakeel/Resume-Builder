import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";

/**
 * GET handler for retrieving detailed revenue statistics
 * Provides ARPU (Average Revenue Per User), ARPPU (Average Revenue Per Paying User),
 * and conversion rates
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Get current date information for monthly stats
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Get monthly detailed revenue stats
    const monthlyDetails = await getMonthlyDetailedStats(oneYearAgo, today);

    // Calculate overall ARPU (Average Revenue Per User)
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalUsers = await User.countDocuments();
    const arpu =
      totalUsers > 0 && totalRevenue.length > 0
        ? totalRevenue[0].total / totalUsers
        : 0;

    // Calculate overall ARPPU (Average Revenue Per Paying User)
    const distinctPayingUsers = await Payment.distinct("userId", {
      status: "completed",
    });
    const arppu =
      distinctPayingUsers.length > 0 && totalRevenue.length > 0
        ? totalRevenue[0].total / distinctPayingUsers.length
        : 0;

    // Calculate conversion rate (paying users / total users)
    const conversionRate =
      totalUsers > 0 ? (distinctPayingUsers.length / totalUsers) * 100 : 0;

    // Return the compiled statistics
    return NextResponse.json({
      monthly: monthlyDetails,
      arpu: parseFloat(arpu.toFixed(2)),
      arppu: parseFloat(arppu.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(1)),
    });
  } catch (error) {
    console.error("Error fetching detailed revenue statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Gets monthly detailed revenue statistics
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with revenue metrics
 */
async function getMonthlyDetailedStats(startDate: Date, endDate: Date) {
  const monthlyStats = [];

  // Create a copy of the start date to iterate through months
  const currentDate = new Date(startDate);

  // Loop through each month
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Calculate the start and end of the month
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of month

    // Count users at the end of the month
    const usersAtMonthEnd = await User.countDocuments({
      createdAt: { $lte: monthEnd },
    });

    // Get revenue for the month
    const monthRevenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: monthStart, $lte: monthEnd },
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const amount = monthRevenue.length > 0 ? monthRevenue[0].total : 0;

    // Get distinct paying users for the month
    const payingUsers = await Payment.distinct("userId", {
      paymentDate: { $gte: monthStart, $lte: monthEnd },
      status: "completed",
    });

    // Calculate metrics
    const monthlyArpu = usersAtMonthEnd > 0 ? amount / usersAtMonthEnd : 0;
    const monthlyArppu =
      payingUsers.length > 0 ? amount / payingUsers.length : 0;
    const monthlyConversionRate =
      usersAtMonthEnd > 0 ? (payingUsers.length / usersAtMonthEnd) * 100 : 0;

    // Add to results
    monthlyStats.push({
      year,
      month: month + 1, // Make month 1-based (Jan = 1)
      monthName: new Date(year, month).toLocaleString("default", {
        month: "long",
      }),
      amount,
      users: usersAtMonthEnd,
      payingUsers: payingUsers.length,
      arpu: parseFloat(monthlyArpu.toFixed(2)),
      arppu: parseFloat(monthlyArppu.toFixed(2)),
      conversionRate: parseFloat(monthlyConversionRate.toFixed(1)),
    });

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthlyStats;
}
