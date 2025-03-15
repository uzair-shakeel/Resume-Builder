import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CoverLetter from "@/models/CoverLetter";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const data = await req.json();
    const { coverId, preview, ...coverLetterData } = data;

    // Ensure sectionPages is properly structured
    const sectionPages = coverLetterData.sectionPages || {};

    console.log(
      `Saving cover letter ${coverId ? "update" : "creation"} with data:`,
      {
        coverId,
        title: coverLetterData.title,
        template: coverLetterData.template,
        sectionPages,
        customSectionNames: coverLetterData.customSectionNames,
        customSections: coverLetterData.customSections,
      }
    );

    let coverLetter;
    if (coverId) {
      // Check if cover letter exists and belongs to user before updating
      const existingCoverLetter = await CoverLetter.findOne({
        _id: coverId,
        userId: session.user.id,
      });

      if (!existingCoverLetter) {
        return NextResponse.json(
          { error: "Cover letter not found or not owned by user" },
          { status: 404 }
        );
      }

      // Update existing cover letter
      coverLetter = await CoverLetter.findOneAndUpdate(
        { _id: coverId, userId: session.user.id },
        {
          ...coverLetterData,
          sectionPages,
          preview: preview || existingCoverLetter.preview, // Keep existing preview if not provided
          lastEdited: new Date(),
        },
        { new: true }
      );
      console.log("Updated existing cover letter:", coverLetter._id);
    } else {
      // Create new cover letter
      coverLetter = await CoverLetter.create({
        ...coverLetterData,
        sectionPages,
        preview: preview || undefined,
        userId: session.user.id,
        createdAt: new Date(),
        lastEdited: new Date(),
      });
      console.log("Created new cover letter:", coverLetter._id);
    }

    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error("Error saving cover letter:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save cover letter",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
