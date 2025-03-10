import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { cvId, newTitle } = await req.json();

    if (!cvId || !newTitle) {
      return NextResponse.json(
        { error: "CV ID and new title are required" },
        { status: 400 }
      );
    }

    // Update the CV title
    const cv = await CV.findOneAndUpdate(
      { _id: cvId, userId: session.user.id },
      { title: newTitle },
      { new: true }
    );

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cv });
  } catch (error) {
    console.error("Error renaming CV:", error);
    return NextResponse.json({ error: "Failed to rename CV" }, { status: 500 });
  }
}
