import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";
import CoverLetter from "@/models/CoverLetter";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Count total documents in the database
    const totalCVs = await CV.countDocuments();
    const totalCoverLetters = await CoverLetter.countDocuments();

    // Count documents that have been downloaded using the new tracking fields
    const downloadedCVs = await CV.countDocuments({ isDownloaded: true });
    const downloadedCoverLetters = await CoverLetter.countDocuments({
      isDownloaded: true,
    });

    // Get total download counts (sum of all downloadCount fields)
    const cvDownloadCounts = await CV.aggregate([
      { $match: { downloadCount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$downloadCount" } } },
    ]);

    const coverLetterDownloadCounts = await CoverLetter.aggregate([
      { $match: { downloadCount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$downloadCount" } } },
    ]);

    const totalCVDownloads =
      cvDownloadCounts.length > 0 ? cvDownloadCounts[0].total : 0;
    const totalCoverLetterDownloads =
      coverLetterDownloadCounts.length > 0
        ? coverLetterDownloadCounts[0].total
        : 0;

    // Get monthly breakdown for the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5); // Last 6 months (current + 5 previous)

    // Format date to first day of month at 00:00:00
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Get monthly data for CVs and Cover Letters
    const monthlyCVsCreated = await getMonthlyCreationStats(
      CV,
      sixMonthsAgo,
      today
    );
    const monthlyCoverLettersCreated = await getMonthlyCreationStats(
      CoverLetter,
      sixMonthsAgo,
      today
    );

    // Get monthly download data
    const monthlyCVsDownloaded = await getMonthlyDownloadStats(
      CV,
      sixMonthsAgo,
      today
    );
    const monthlyCoverLettersDownloaded = await getMonthlyDownloadStats(
      CoverLetter,
      sixMonthsAgo,
      today
    );

    return NextResponse.json({
      totalCVs,
      totalCoverLetters,
      downloads: {
        // Unique documents that have been downloaded at least once
        uniqueCVs: downloadedCVs,
        uniqueCoverLetters: downloadedCoverLetters,
        // Total number of download operations
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
    });
  } catch (error) {
    console.error("Error fetching document totals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Gets monthly creation statistics for the specified model
 * @param model The Mongoose model to query
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyCreationStats(
  model: any,
  startDate: Date,
  endDate: Date
) {
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
    const count = await model.countDocuments({
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
 * Gets monthly download statistics for the specified model
 * @param model The Mongoose model to query
 * @param startDate The start date for the query
 * @param endDate The end date for the query
 * @returns An array of monthly stats with year, month, and count
 */
async function getMonthlyDownloadStats(
  model: any,
  startDate: Date,
  endDate: Date
) {
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
    const count = await model.countDocuments({
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
