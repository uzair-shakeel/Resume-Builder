import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const cvId = searchParams.get("cvId");

    if (!cvId) {
      // Return all CVs for the user with complete data
      const cvs = await CV.find({ userId: session.user.id })
        .select({
          title: 1,
          template: 1,
          lastEdited: 1,
          createdAt: 1,
          data: 1,
          sectionOrder: 1,
          accentColor: 1,
          fontFamily: 1,
          sectionPages: 1,
          customSectionNames: 1,
          preview: 1,
        })
        .sort({ lastEdited: -1 });
      return NextResponse.json({ success: true, cvs });
    }

    // Return specific CV
    const cv = await CV.findOne({ _id: cvId, userId: session.user.id });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cv });
  } catch (error) {
    console.error("Error loading CV:", error);
    return NextResponse.json({ error: "Failed to load CV" }, { status: 500 });
  }
}
