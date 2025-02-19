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
  const functionalityId = searchParams.get('functionalityId');

  if (!functionalityId) {
    return NextResponse.json([]); // Or handle the missing ID as you see fit
  }

  try {
    const items = await prisma.functionalityItem.findMany({
      where: { functionalityId: functionalityId }, // Direct string comparison
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 });
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    const { item, functionalityId } = await request.json();

    if (!functionalityId || typeof functionalityId !== 'string') {
      return NextResponse.json({ error: "functionalityId is required and must be a string" }, { status: 400 });
    }
    if (!item || typeof item !== 'string') {
      return NextResponse.json({ error: "item is required and must be a string" }, { status: 400 });
    }


    const newItem = await prisma.functionalityItem.create({
      data: { item, functionalityId },
    });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Error creating item" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const { id, item } = await request.json();

     if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "id is required and must be a string" }, { status: 400 });
    }
    if (!item || typeof item !== 'string') {
      return NextResponse.json({ error: "item is required and must be a string" }, { status: 400 });
    }

    const updatedItem = await prisma.functionalityItem.update({
      where: { id },
      data: { item },
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
     if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "id is required and must be a string" }, { status: 400 });
    }
    await prisma.functionalityItem.delete({ where: { id } });
    return NextResponse.json({ message: 'Item deleted' });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}