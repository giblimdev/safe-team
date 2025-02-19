/*
Dans ma route functionalities :
Impossible d'assigner le type 'number' au type 'string | StringFilter<"Functionality"> | undefined'.ts(2322)
(property) ideaId?: string | Prisma.StringFilter<"Functionality"> | undefined
*/
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ideaId = searchParams.get('ideaId');
  const functionalities = await prisma.functionality.findMany({ where: { ideaId: Number(ideaId) } });
  return NextResponse.json(functionalities);
}

export async function POST(request: NextRequest) {
  const { content, ideaId } = await request.json();
  const functionality = await prisma.functionality.create({ data: { content, ideaId } });
  return NextResponse.json(functionality);
}

export async function PUT(request: NextRequest) {
  const { id, content } = await request.json();
  const functionality = await prisma.functionality.update({ where: { id }, data: { content } });
  return NextResponse.json(functionality);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.functionality.delete({ where: { id } });
  return NextResponse.json({ message: 'Functionality deleted' });
}
