/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Idea { 
 id                String              @id @default(cuid())
  content           String             @default("")
  functionalities   Functionality[]
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @default(now())
}

model Functionality {
    id                String              @id @default(cuid())
  content           String
  ideaId            String
  idea              Idea                @relation(fields: [ideaId], references: [id])
  functionalityItems FunctionalityItem[]
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
}

model FunctionalityItem {
  id              String   @id @default(cuid())
  item            String
  functionalityId String
  functionality   Functionality @relation(fields: [functionalityId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

*/
/*
réecris cette route
*/

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ideaId = searchParams.get('ideaId');

  if (!ideaId) {
    return NextResponse.json([]); // Or handle as appropriate
  }

  try {
    const functionalities = await prisma.functionality.findMany({
      where: { ideaId: ideaId }, // Directly use the string ideaId
    });
    return NextResponse.json(functionalities);
  } catch (error) {
    console.error("Error fetching functionalities:", error);
    return NextResponse.json({ error: "Error fetching functionalities" }, { status: 500 });
  }
}


// POST
export async function POST(request: NextRequest) {
  try {
    const { content, ideaId } = await request.json();

    if (!ideaId || typeof ideaId !== 'string') {
      return NextResponse.json({ error: "ideaId is required and must be a string" }, { status: 400 });
    }

    const functionality = await prisma.functionality.create({
      data: { content, ideaId },
    });
    return NextResponse.json(functionality);
  } catch (error) {
    console.error("Error creating functionality:", error);
    return NextResponse.json({ error: "Error creating functionality" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const { id, content } = await request.json();
    const functionality = await prisma.functionality.update({
      where: { id },
      data: { content },
    });
    return NextResponse.json(functionality);
  } catch (error) {
    console.error("Error updating functionality:", error);
    return NextResponse.json({ error: "Error updating functionality" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.functionality.delete({ where: { id } });
    return NextResponse.json({ message: 'Functionality deleted' });
  } catch (error) {
    console.error("Error deleting functionality:", error);
    return NextResponse.json({ error: "Error deleting functionality" }, { status: 500 });
  }
}