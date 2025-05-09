import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CoverLetter from "@/models/CoverLetter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET handler for retrieving enhanced cover letter statistics
 * Provides conversion rates and template popularity
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await dbConnect();

    // Get current date information for monthly stats
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5); // Last 6 months (current + 5 previous)
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Get monthly data for cover letters created and downloaded
    const monthlyCoverLettersCreated = await getMonthlyCreationStats(
      sixMonthsAgo,
      today
    );
    const monthlyCoverLettersDownloaded = await getMonthlyDownloadStats(
      sixMonthsAgo,
      today
    );

    // Calculate overall conversion rate
    const totalCoverLetters = await CoverLetter.countDocuments();
    const downloadedCoverLetters = await CoverLetter.countDocuments({
      isDownloaded: true,
    });
    const conversionRate =
      totalCoverLetters > 0
        ? (downloadedCoverLetters / totalCoverLetters) * 100
        : 0;

    // Get template popularity data
    const popularTemplates = await getTemplatePopularity();

    // Return the compiled statistics with CORS headers
    const responseData = {
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      createdPerMonth: monthlyCoverLettersCreated.map((stat) => stat.count),
      downloadedPerMonth: monthlyCoverLettersDownloaded.map(
        (stat) => stat.count
      ),
      popularTemplates: popularTemplates,
      months: monthlyCoverLettersCreated.map((stat) => stat.monthName),
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
    console.error("Error fetching cover letter statistics:", error);
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
 * Gets monthly creation statistics
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyCreationStats(startDate: Date, endDate: Date) {
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

    // Count documents created in this month
    const count = await CoverLetter.countDocuments({
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

/**
 * Gets monthly download statistics
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyDownloadStats(startDate: Date, endDate: Date) {
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

    // Count documents downloaded in this month using the lastDownloadedAt field
    const count = await CoverLetter.countDocuments({
      lastDownloadedAt: {
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

/**
 * Gets template popularity data
 * @returns An array of template names and their usage counts
 */
async function getTemplatePopularity() {
  const templateStats = await CoverLetter.aggregate([
    { $group: { _id: "$template", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 9 }, // Limit to top 9 templates
    { $project: { _id: 0, name: "$_id", usage: "$count" } },
  ]);

  return templateStats;
}
