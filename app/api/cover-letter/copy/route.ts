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
    const { coverId } = await req.json();
    if (!coverId) {
      return NextResponse.json(
        { error: "Cover letter ID is required" },
        { status: 400 }
      );
    }
    // Find the cover letter to copy
    const originalCover = await CoverLetter.findOne({
      _id: coverId,
      userId: session.user.id,
    });
    if (!originalCover) {
      return NextResponse.json(
        { error: "Cover letter not found" },
        { status: 404 }
      );
    }
    // Prepare the new cover letter data
    const newCoverData = originalCover.toObject();
    delete newCoverData._id;
    newCoverData.title = `Copy of ${originalCover.title}`;
    newCoverData.createdAt = new Date();
    newCoverData.lastEdited = new Date();
    newCoverData.userId = session.user.id;
    // Create the new cover letter
    const newCover = await CoverLetter.create(newCoverData);
    return NextResponse.json({ success: true, coverLetter: newCover });
  } catch (error) {
    console.error("Error copying cover letter:", error);
    return NextResponse.json(
      { error: "Failed to copy cover letter" },
      { status: 500 }
    );
  }
}
