import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CoverLetter from "@/models/CoverLetter";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const coverId = searchParams.get("id");

    if (!coverId) {
      return NextResponse.json(
        { error: "Cover letter ID is required" },
        { status: 400 }
      );
    }

    // Delete the cover letter
    const result = await CoverLetter.deleteOne({
      _id: coverId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Cover letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    return NextResponse.json(
      { error: "Failed to delete cover letter" },
      { status: 500 }
    );
  }
}
