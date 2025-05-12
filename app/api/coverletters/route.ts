import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CoverLetter from "@/models/CoverLetter";
import User from "@/models/User";

export const dynamic = "force-dynamic";

/**
 * GET handler for retrieving all cover letters (accessible to everyone)
 * Provides paginated access to all cover letters in the system
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Extract query parameters for pagination and filtering
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");
    const template = searchParams.get("template");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};
    if (userId) query.userId = userId;
    if (template) query.template = template;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch cover letters with pagination
    const coverLetters = await CoverLetter.find(query)
      .select({
        title: 1,
        template: 1,
        userId: 1,
        createdAt: 1,
        lastEdited: 1,
        isDownloaded: 1,
        downloadCount: 1,
        lastDownloadedAt: 1,
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCoverLetters = await CoverLetter.countDocuments(query);

    // Populate user data
    const coverLettersWithUserData = await Promise.all(
      coverLetters.map(async (coverLetter) => {
        const user = await User.findById(coverLetter.userId).select(
          "name email"
        );
        return {
          ...coverLetter.toObject(),
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );

    return NextResponse.json({
      coverLetters: coverLettersWithUserData,
      pagination: {
        total: totalCoverLetters,
        page,
        limit,
        pages: Math.ceil(totalCoverLetters / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch cover letters" },
      { status: 500 }
    );
  }
}
