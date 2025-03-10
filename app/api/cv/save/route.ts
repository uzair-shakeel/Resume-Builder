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

    let cv;
    if (cvId) {
      // Update existing CV
      cv = await CV.findOneAndUpdate(
        { _id: cvId, userId: session.user.id },
        {
          ...cvData,
          preview: preview || undefined, // Only update preview if provided
          lastEdited: new Date(),
        },
        { new: true }
      );
    } else {
      // Create new CV
      cv = await CV.create({
        ...cvData,
        preview: preview || undefined,
        userId: session.user.id,
      });
    }

    return NextResponse.json({ success: true, cv });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json({ error: "Failed to save CV" }, { status: 500 });
  }
}
