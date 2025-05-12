import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CV from "@/models/CV";
import connectDB from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const cvId = searchParams.get("cvId");

    if (!cvId) {
      // Return all CVs for the user with complete data
      const cvs = await CV.find({ userId: session.user.id })
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
          preview: 1,
        })
        .sort({ lastEdited: -1 });
      return NextResponse.json({ success: true, cvs });
    }

    // Return specific CV
    const query: any = { _id: cvId };
    if (session.user.id) {
      query.userId = session.user.id;
    }

    const cv = await CV.findOne(query);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    let hasChanged = false;

    // Fix any interests that use the old format (interest property instead of name)
    if (cv.data && cv.data.interests && cv.data.interests.length > 0) {
      cv.data.interests = cv.data.interests.map((item: any) => {
        // If the item has interest property but not name property, convert it
        if (item.interest !== undefined && item.name === undefined) {
          hasChanged = true;
          return { name: item.interest };
        }
        return item;
      });
    }

    // Fix any languages that have numeric levels instead of text
    if (cv.data && cv.data.languages && cv.data.languages.length > 0) {
      cv.data.languages = cv.data.languages.map((item: any) => {
        // If the level is a number, convert it to a string descriptor
        if (typeof item.level === "number") {
          hasChanged = true;
          // Convert numeric level to string representation
          const levelMap: { [key: number]: string } = {
            1: "Elementary",
            2: "Limited Working",
            3: "Professional Working",
            4: "Full Professional",
            5: "Native/Bilingual",
          };
          return {
            ...item,
            level: levelMap[item.level] || "Professional Working",
          };
        }
        return item;
      });
    }

    // If we modified the data, save the CV with the updated format
    if (hasChanged) {
      await CV.updateOne(
        { _id: cvId },
        {
          $set: {
            "data.interests": cv.data.interests,
            "data.languages": cv.data.languages,
          },
        }
      );
    }

    return NextResponse.json({ success: true, cv });
  } catch (error) {
    console.error("Error loading CV:", error);
    return NextResponse.json({ error: "Failed to load CV" }, { status: 500 });
  }
}
