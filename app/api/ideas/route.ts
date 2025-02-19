


//@app/api/ideas/routes.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Récupère toutes les idées
export async function GET(request: NextRequest) {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { order: 'asc' }, // Trie les idées par ordre croissant
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json({ error: "Error fetching ideas" }, { status: 500 });
  }
}

// POST: Ajoute une nouvelle idée
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    // Trouve l'ordre maximal actuel
    const lastIdea = await prisma.idea.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = lastIdea ? lastIdea.order + 1 : 0; // Définit l'ordre de la nouvelle idée

    // Crée la nouvelle idée
    const idea = await prisma.idea.create({
      data: { content, order: newOrder },
    });

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json({ error: "Error creating idea" }, { status: 500 });
  }
}

// PUT: Met à jour une idée (contenu ou ordre)
export async function PUT(request: NextRequest) {
  try {
    const { id, content, order } = await request.json();

    // Met à jour l'idée
    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: { content, order },
    });

    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json({ error: "Error updating idea" }, { status: 500 });
  }
}

// DELETE: Supprime une idée
export async function DELETE(request: NextRequest) {
  try {
    // Parse le corps de la requête
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Valide l'ID
    const { id } = requestBody;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Invalid ID provided" },
        { status: 400 }
      );
    }

    // Supprime l'idée
    await prisma.idea.delete({ where: { id } });

    return NextResponse.json({ message: 'Idea deleted' });
  } catch (error) {
    // Gère les erreurs
    if (error instanceof Error) {
      console.error("Error deleting idea:", error.message);
      return NextResponse.json(
        { error: "Error deleting idea", details: error.message },
        { status: 500 }
      );
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      console.error("Error deleting idea:", error.message);
      return NextResponse.json(
        { error: "Error deleting idea", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("An unexpected error occurred during deletion:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred during deletion" },
        { status: 500 }
      );
    }
  }
}