import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        project: {
          select: { id: true, name: true, color: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, projectId, authorId } = body;

    if (!title || !projectId || !authorId) {
      return NextResponse.json(
        { error: "Title, projectId, and authorId are required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        content: content || "",
        projectId,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        project: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
