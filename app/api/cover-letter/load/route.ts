import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CoverLetter from "@/models/CoverLetter";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const coverId = searchParams.get("coverId");

    if (!coverId) {
      // Return all cover letters for the user with complete data
      const coverLetters = await CoverLetter.find({ userId: session.user.id })
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
          customSections: 1,
          preview: 1,
        })
        .sort({ lastEdited: -1 });

      console.log(
        `Loaded ${coverLetters.length} cover letters for user ${session.user.id}`
      );

      // Log section pages for each cover letter
      coverLetters.forEach((letter) => {
        console.log(
          `Cover letter ${letter._id} has section pages:`,
          letter.sectionPages || {}
        );
      });

      return NextResponse.json({ success: true, coverLetters });
    }

    // Return specific cover letter
    const coverLetter = await CoverLetter.findOne({
      _id: coverId,
      userId: session.user.id,
    });

    if (!coverLetter) {
      return NextResponse.json(
        { error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Ensure sectionPages is properly structured
    if (!coverLetter.sectionPages) {
      coverLetter.sectionPages = {};
    }

    console.log(
      `Loaded cover letter ${coverId} with section pages:`,
      coverLetter.sectionPages
    );

    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error("Error loading cover letter:", error);
    return NextResponse.json(
      { error: "Failed to load cover letter" },
      { status: 500 }
    );
  }
}
