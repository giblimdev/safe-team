/*
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
/*réécris ce composant pour qu'il me permet entre autre de 
d'afficher les ides.
d'afficher les fonctionnalitées de l'idée sélectionée 
d'afficher les item e la fonctionnalité sélectionnée
je veux un composant fonctionnel pour gérer (CRUD) une id"ee et ses fonctionnalité et ses item*/




//@/app/components/Comptest.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { useIdeaStore } from "@/lib/store/useIdeaStore";
import { useFunctionalityStore } from "@/lib/store/useFunctionalityStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Fonction pour récupérer les données depuis l'API
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

export default function IdeaManager() {
  // États pour gérer les idées, fonctionnalités et éléments
  const { selectedIdea, setSelectedIdea } = useIdeaStore();
  const { selectedFunctionality, setSelectedFunctionality } = useFunctionalityStore();

  // Récupération des idées, fonctionnalités et éléments via SWR
  const { data: ideas, mutate: mutateIdeas } = useSWR("/api/ideas", fetcher);
  const { data: functionalities, mutate: mutateFunctionalities } = useSWR(
    selectedIdea ? `/api/functionalities?ideaId=${selectedIdea.id}` : null,
    fetcher
  );
  const { data: items, mutate: mutateItems } = useSWR(
    selectedFunctionality ? `/api/functionalityItems?functionalityId=${selectedFunctionality.id}` : null,
    fetcher
  );

  // États pour les nouveaux éléments
  const [newIdea, setNewIdea] = useState("");
  const [newFunctionality, setNewFunctionality] = useState("");
  const [newItem, setNewItem] = useState("");

  // Fonction pour ajouter une idée, une fonctionnalité ou un élément
  const handleAdd = async (url: string, data: any, mutate: any, setState: any) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      mutate(); // Rafraîchir les données
      setState(""); // Réinitialiser le champ de saisie
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Please check the console for details.");
    }
  };

  // Fonction pour supprimer une idée, une fonctionnalité ou un élément
  const handleDelete = async (id: string | undefined, url: string, mutate: any) => {
    if (!id) {
      console.error("No ID provided for deletion.");
      return;
    }

    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }

        mutate(); // Rafraîchir les données

        // Réinitialiser les sélections si nécessaire
        if (url === "/api/ideas") {
          setSelectedIdea(null);
          mutateFunctionalities(null);
          mutateItems(null);
        } else if (url === "/api/functionalities") {
          setSelectedFunctionality(null);
          mutateItems(null);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item. Please check the console for details.");
      }
    }
  };

  // Fonction pour mettre à jour une idée, une fonctionnalité ou un élément
  const handleUpdate = async (url: string, data: any, mutate: any) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      mutate(); // Rafraîchir les données
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item. Please check the console for details.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Gestion des Idées</h1>

      {/* Section Idées */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold">Idées</h2>
        <Input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Nouvelle idée"
          className="mb-2"
        />
        <Button onClick={() => handleAdd("/api/ideas", { content: newIdea }, mutateIdeas, setNewIdea)}>
          <FaPlus />
        </Button>
        <ul>
          {ideas?.map((idea: { id: string; content: string }) => (
            <li key={idea.id} className="flex justify-between items-center mb-2">
              <Input
                value={idea.content}
                onChange={(e) =>
                  handleUpdate("/api/ideas", { id: idea.id, content: e.target.value }, mutateIdeas)
                }
              />
              <div className="flex">
                <Button className="m-2" onClick={() => handleDelete(idea.id, "/api/ideas", mutateIdeas)}>
                  <FaTrash />
                </Button>
                <Button className="m-2" onClick={() => setSelectedIdea(idea)}>
                  <FaEdit />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Section Fonctionnalités */}
      {selectedIdea && (
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold">Fonctionnalités</h2>
          <Input
            type="text"
            value={newFunctionality}
            onChange={(e) => setNewFunctionality(e.target.value)}
            placeholder="Nouvelle fonctionnalité"
            className="mb-2"
          />
          <Button
            onClick={() =>
              handleAdd(
                "/api/functionalities",
                { content: newFunctionality, ideaId: selectedIdea.id },
                mutateFunctionalities,
                setNewFunctionality
              )
            }
          >
            <FaPlus />
          </Button>
          <ul>
            {functionalities?.map((func: { id: string; content: string }) => (
              <li key={func.id} className="flex justify-between items-center mb-2">
                <Input
                  value={func.content}
                  onChange={(e) =>
                    handleUpdate("/api/functionalities", { id: func.id, content: e.target.value }, mutateFunctionalities)
                  }
                />
                <div className="flex">
                  <Button className="m-2" onClick={() => handleDelete(func.id, "/api/functionalities", mutateFunctionalities)}>
                    <FaTrash />
                  </Button>
                  <Button className="m-2" onClick={() => setSelectedFunctionality(func)}>
                    <FaEdit />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section Éléments */}
      {selectedFunctionality && (
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold">Éléments</h2>
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nouvel élément"
            className="mb-2"
          />
          <Button
            onClick={() =>
              handleAdd(
                "/api/functionalityItems",
                { item: newItem, functionalityId: selectedFunctionality.id },
                mutateItems,
                setNewItem
              )
            }
          >
            <FaPlus />
          </Button>
          <ul>
            {items?.map((item: { id: string; item: string }) => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <Input
                  value={item.item}
                  onChange={(e) =>
                    handleUpdate("/api/functionalityItems", { id: item.id, item: e.target.value }, mutateItems)
                  }
                />
                <div className="flex">
                  <Button className="m-2" onClick={() => handleDelete(item.id, "/api/functionalityItems", mutateItems)}>
                    <FaTrash />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}