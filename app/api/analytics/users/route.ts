import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

/**
 * GET handler for retrieving user statistics
 * Provides total user count, monthly breakdown, and current month metrics
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Count total users in the database
    const totalUsers = await User.countDocuments();

    // Get current date information for monthly stats
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Calculate start of current month
    const currentMonthStart = new Date(currentYear, currentMonth, 1);

    // Calculate start of six months ago (for monthly breakdown)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5); // Last 6 months (current + 5 previous)
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Count users created in the current month
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: currentMonthStart },
    });

    // Get monthly user registration data for the last 6 months
    const monthlyUserStats = await getMonthlyUserStats(sixMonthsAgo, today);

    // Calculate monthly average (excluding current month if it's not complete)
    const completedMonths = monthlyUserStats.filter(
      (month) =>
        !(month.year === currentYear && month.month === currentMonth + 1)
    );

    const monthlyAverage =
      completedMonths.length > 0
        ? completedMonths.reduce((sum, month) => sum + month.count, 0) /
          completedMonths.length
        : 0;

    // Return the compiled statistics
    return NextResponse.json({
      totalUsers,
      currentMonthUsers,
      monthlyAverage: Math.round(monthlyAverage),
      monthly: monthlyUserStats,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Gets monthly user registration statistics
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyUserStats(startDate: Date, endDate: Date) {
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

    // Count users created in this month
    const count = await User.countDocuments({
      createdAt: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    });

    // Add to results
    monthlyStats.push({
      year,
      month: month + 1, // Make month 1-based (Jan = 1)
      monthName: new Date(year, month).toLocaleString("default", {
        month: "long",
      }),
      count,
    });

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthlyStats;
}
