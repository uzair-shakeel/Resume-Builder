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

    console.log("Saving cover letter with data:", {
      coverId,
      title: coverLetterData.title,
      template: coverLetterData.template,
      sectionPages,
      customSectionNames: coverLetterData.customSectionNames,
      customSections: coverLetterData.customSections,
    });

    let coverLetter;
    if (coverId) {
      // Update existing cover letter
      coverLetter = await CoverLetter.findOneAndUpdate(
        { _id: coverId, userId: session.user.id },
        {
          ...coverLetterData,
          sectionPages,
          preview: preview || undefined, // Only update preview if provided
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
      });
      console.log("Created new cover letter:", coverLetter._id);
    }

    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error("Error saving cover letter:", error);
    return NextResponse.json(
      { error: "Failed to save cover letter" },
      { status: 500 }
    );
  }
}
