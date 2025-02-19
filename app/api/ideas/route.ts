import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const ideas = await prisma.idea.findMany();
  return NextResponse.json(ideas);
}

export async function POST(request: NextRequest) {
  const { content } = await request.json();
  const idea = await prisma.idea.create({ data: { content } });
  return NextResponse.json(idea);
}

export async function PUT(request: NextRequest) {
  const { id, content } = await request.json();
  const idea = await prisma.idea.update({ where: { id }, data: { content } });
  return NextResponse.json(idea);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.idea.delete({ where: { id } });
  return NextResponse.json({ message: 'Idea deleted' });
}
