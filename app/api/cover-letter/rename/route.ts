import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CoverLetter from "@/models/CoverLetter";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { coverId, newTitle } = await req.json();

    if (!coverId || !newTitle) {
      return NextResponse.json(
        { error: "Cover letter ID and new title are required" },
        { status: 400 }
      );
    }

    // Update the cover letter title
    const coverLetter = await CoverLetter.findOneAndUpdate(
      { _id: coverId, userId: session.user.id },
      { title: newTitle },
      { new: true }
    );

    if (!coverLetter) {
      return NextResponse.json(
        { error: "Cover letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error("Error renaming cover letter:", error);
    return NextResponse.json(
      { error: "Failed to rename cover letter" },
      { status: 500 }
    );
  }
}
