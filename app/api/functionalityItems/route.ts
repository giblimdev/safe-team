import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const functionalityId = searchParams.get('functionalityId');
  const items = await prisma.item.findMany({ where: { functionalityId: Number(functionalityId) } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const { item, functionalityId } = await request.json();
  const newItem = await prisma.item.create({ data: { item, functionalityId } });
  return NextResponse.json(newItem);
}

export async function PUT(request: NextRequest) {
  const { id, item } = await request.json();
  const updatedItem = await prisma.item.update({ where: { id }, data: { item } });
  return NextResponse.json(updatedItem);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ message: 'Item deleted' });
}
