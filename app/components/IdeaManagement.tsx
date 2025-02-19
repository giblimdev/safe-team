/* modifie le script suivant :00
Le paramètre 'mutate' possède implicitement un type 'any'.ts(7006)
(parameter) mutate: any.
et utlise des iconnes pour les boutton */


"use client";

import { SetStateAction, Key, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import { useIdeaStore } from "@/lib/store/useIdeaStore";
import { useFunctionalityStore } from "@/lib/store/useFunctionalityStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Importez les icônes nécessaires

const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());

export default function IdeaManager() {
  const { selectedIdea, setSelectedIdea } = useIdeaStore();
  const { selectedFunctionality, setSelectedFunctionality } = useFunctionalityStore();

  const { data: ideas, mutate: mutateIdeas } = useSWR("/api/ideas", fetcher);
  const { data: functionalities, mutate: mutateFunctionalities } = useSWR(
    selectedIdea ? `/api/functionalities?ideaId=${selectedIdea.id}` : null,
    fetcher
  );
  const { data: items, mutate: mutateItems } = useSWR(
    selectedFunctionality ? `/api/items?functionalityId=${selectedFunctionality.id}` : null,
    fetcher
  );

  const [newIdea, setNewIdea] = useState("");
  const [newFunctionality, setNewFunctionality] = useState("");
  const [newItem, setNewItem] = useState("");

  const handleAdd = async (
    url: string | URL | Request,
    data: { content?: string; ideaId?: any; item?: string; functionalityId?: any },
    mutate: KeyedMutator<any>,
    setState: (value: SetStateAction<string>) => void
  ) => {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    mutate();
    setState("");
  };

  const handleDelete = async (url: string | URL | Request, mutate: KeyedMutator<any>) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      await fetch(url, { method: "DELETE" });
      mutate();
    }
  };

  const handleUpdate = async (
    url: string | URL | Request,
    data: { content?: string; item?: string },
    mutate: KeyedMutator<any>
  ) => {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    mutate();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Gestion des Idées</h1>
      <div className="space-y-2">
        <Input value={newIdea} onChange={(e) => setNewIdea(e.target.value)} placeholder="Nouvelle idée" />
        <Button onClick={() => handleAdd("/api/ideas", { content: newIdea }, mutateIdeas, setNewIdea)}>
          <FaPlus /> Ajouter
        </Button>
      </div>
      <ul>
        {ideas?.map((idea: { id: Key | null | undefined; content: string | number | readonly string[] | undefined; }) => (
          <li key={idea.id} className="flex justify-between items-center">
            <Input
              value={idea.content}
              onChange={(e) => handleUpdate(`/api/ideas/${idea.id}`, { content: e.target.value }, mutateIdeas)}
            />
            <div>
              <Button onClick={() => handleDelete(`/api/ideas/${idea.id}`, mutateIdeas)}>
                <FaTrash /> Supprimer
              </Button>
              <Button onClick={() => setSelectedIdea(idea)}>
                <FaEdit /> Sélectionner
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {selectedIdea && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Fonctionnalités de {selectedIdea.content}</h2>
          <Input value={newFunctionality} onChange={(e) => setNewFunctionality(e.target.value)} placeholder="Nouvelle fonctionnalité" />
          <Button onClick={() => handleAdd("/api/functionalities", { content: newFunctionality, ideaId: selectedIdea.id }, mutateFunctionalities, setNewFunctionality)}>
            <FaPlus /> Ajouter
          </Button>
          <ul>
            {functionalities?.map((func: { id: Key | null | undefined; content: string | number | readonly string[] | undefined; }) => (
              <li key={func.id} className="flex justify-between items-center">
                <Input
                  value={func.content}
                  onChange={(e) => handleUpdate(`/api/functionalities/${func.id}`, { content: e.target.value }, mutateFunctionalities)}
                />
                <div>
                  <Button onClick={() => handleDelete(`/api/functionalities/${func.id}`, mutateFunctionalities)}>
                    <FaTrash /> Supprimer
                  </Button>
                  <Button onClick={() => setSelectedFunctionality(func)}>
                    <FaEdit /> Sélectionner
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedFunctionality && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Éléments de {selectedFunctionality.content}</h2>
          <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Nouvel élément" />
          <Button onClick={() => handleAdd("/api/items", { item: newItem, functionalityId: selectedFunctionality.id }, mutateItems, setNewItem)}>
            <FaPlus /> Ajouter
          </Button>
          <ul>
            {items?.map((item: { id: Key | null | undefined; item: string | number | readonly string[] | undefined; }) => (
              <li key={item.id} className="flex justify-between items-center">
                <Input
                  value={item.item}
                  onChange={(e) => handleUpdate(`/api/items/${item.id}`, { item: e.target.value }, mutateItems)}
                />
                <Button onClick={() => handleDelete(`/api/items/${item.id}`, mutateItems)}>
                  <FaTrash /> Supprimer
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
