import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";
import CoverLetter from "@/models/CoverLetter";

/**
 * GET handler for retrieving total analytics
 * Provides totals for CVs, Cover Letters, and Downloads
 */
export async function GET(req: Request) {
  try {
    // Add CORS headers to allow cross-origin requests
    const response = await getTotalsData();
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // In production, replace with specific origins
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching analytics totals:", error);
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
 * Function to get analytics totals data
 */
async function getTotalsData() {
  await dbConnect();

  // Get current date information for monthly stats
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 5); // Last 6 months (current + 5 previous)
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // Count total CVs and Cover Letters
  const totalCVs = await CV.countDocuments();
  const totalCoverLetters = await CoverLetter.countDocuments();

  // Count unique downloaded documents
  const uniqueCVsDownloaded = await CV.countDocuments({ isDownloaded: true });
  const uniqueCoverLettersDownloaded = await CoverLetter.countDocuments({
    isDownloaded: true,
  });

  // Sum total downloads
  const cvDownloadsAggregate = await CV.aggregate([
    { $group: { _id: null, total: { $sum: "$downloadCount" } } },
  ]);
  const coverLetterDownloadsAggregate = await CoverLetter.aggregate([
    { $group: { _id: null, total: { $sum: "$downloadCount" } } },
  ]);

  const totalCVDownloads =
    cvDownloadsAggregate.length > 0 ? cvDownloadsAggregate[0].total : 0;
  const totalCoverLetterDownloads =
    coverLetterDownloadsAggregate.length > 0
      ? coverLetterDownloadsAggregate[0].total
      : 0;

  // Get monthly data for CVs and Cover Letters
  const monthlyCVsCreated = await getMonthlyCreationStats(
    CV,
    sixMonthsAgo,
    today
  );
  const monthlyCVsDownloaded = await getMonthlyDownloadStats(
    CV,
    sixMonthsAgo,
    today
  );
  const monthlyCoverLettersCreated = await getMonthlyCreationStats(
    CoverLetter,
    sixMonthsAgo,
    today
  );
  const monthlyCoverLettersDownloaded = await getMonthlyDownloadStats(
    CoverLetter,
    sixMonthsAgo,
    today
  );

  return {
    totalCVs,
    totalCoverLetters,
    downloads: {
      uniqueCVs: uniqueCVsDownloaded,
      uniqueCoverLetters: uniqueCoverLettersDownloaded,
      totalCVDownloads,
      totalCoverLetterDownloads,
    },
    monthly: {
      cvs: {
        created: monthlyCVsCreated,
        downloaded: monthlyCVsDownloaded,
      },
      coverLetters: {
        created: monthlyCoverLettersCreated,
        downloaded: monthlyCoverLettersDownloaded,
      },
    },
  };
}

/**
 * Gets monthly creation statistics
 * @param model The model to query (CV or CoverLetter)
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyCreationStats(model, startDate: Date, endDate: Date) {
  const monthlyStats = [];

  // Create a copy of the start date to iterate through months
  const currentDate = new Date(startDate);

  // Loop through each month
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Make month 1-based (Jan = 1)

    // Calculate the start and end of the month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999); // Last day of month

    // Count documents created in this month
    const count = await model.countDocuments({
      createdAt: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    });

    // Add to results
    monthlyStats.push({
      year,
      month,
      monthName: new Date(year, month - 1).toLocaleString("default", {
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
 * @param model The model to query (CV or CoverLetter)
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyDownloadStats(model, startDate: Date, endDate: Date) {
  const monthlyStats = [];

  // Create a copy of the start date to iterate through months
  const currentDate = new Date(startDate);

  // Loop through each month
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Make month 1-based (Jan = 1)

    // Calculate the start and end of the month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999); // Last day of month

    // Count documents downloaded in this month using the lastDownloadedAt field
    const count = await model.countDocuments({
      lastDownloadedAt: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    });

    // Add to results
    monthlyStats.push({
      year,
      month,
      monthName: new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      }),
      count,
    });

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthlyStats;
}
