import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const data = await req.json();
    const { cvId, preview, ...cvData } = data;

    // Ensure sectionPages is properly structured
    const sectionPages = cvData.sectionPages || {};

    console.log(
      `Saving CV ${cvId ? "update" : "creation"} with sectionPages:`,
      sectionPages
    );

    let cv;
    if (cvId) {
      // Check if CV exists and belongs to user before updating
      const existingCV = await CV.findOne({
        _id: cvId,
        userId: session.user.id,
      });

      if (!existingCV) {
        return NextResponse.json(
          { error: "CV not found or not owned by user" },
          { status: 404 }
        );
      }

      // Update existing CV
      cv = await CV.findOneAndUpdate(
        { _id: cvId, userId: session.user.id },
        {
          ...cvData,
          sectionPages,
          preview: preview || existingCV.preview, // Keep existing preview if not provided
          lastEdited: new Date(),
        },
        { new: true }
      );

      console.log("Updated existing CV:", cv._id);
    } else {
      // Create new CV
      cv = await CV.create({
        ...cvData,
        sectionPages,
        preview: preview || undefined,
        userId: session.user.id,
        createdAt: new Date(),
        lastEdited: new Date(),
      });

      console.log("Created new CV:", cv._id);
    }

    return NextResponse.json({ success: true, cv });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save CV",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
