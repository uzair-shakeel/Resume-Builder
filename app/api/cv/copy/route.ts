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
    const { cvId } = await req.json();
    if (!cvId) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 });
    }
    // Find the CV to copy
    const originalCV = await CV.findOne({ _id: cvId, userId: session.user.id });
    if (!originalCV) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }
    // Prepare the new CV data
    const newCVData = originalCV.toObject();
    delete newCVData._id;
    newCVData.title = `Copy of ${originalCV.title}`;
    newCVData.createdAt = new Date();
    newCVData.lastEdited = new Date();
    newCVData.userId = session.user.id;
    // Create the new CV
    const newCV = await CV.create(newCVData);
    return NextResponse.json({ success: true, cv: newCV });
  } catch (error) {
    console.error("Error copying CV:", error);
    return NextResponse.json({ error: "Failed to copy CV" }, { status: 500 });
  }
}
