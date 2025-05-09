import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";
import User from "@/models/User";

/**
 * GET handler for retrieving all CVs (accessible to everyone)
 * Provides paginated access to all CVs in the system
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

    // Fetch CVs with pagination
    const cvs = await CV.find(query)
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
    const totalCVs = await CV.countDocuments(query);

    // Populate user data
    const cvsWithUserData = await Promise.all(
      cvs.map(async (cv) => {
        const user = await User.findById(cv.userId).select("name email");
        return {
          ...cv.toObject(),
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );

    return NextResponse.json({
      cvs: cvsWithUserData,
      pagination: {
        total: totalCVs,
        page,
        limit,
        pages: Math.ceil(totalCVs / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 });
  }
}
