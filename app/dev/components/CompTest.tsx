/*se composant dois afficher les les functionalities de l'idea sélectiner et le boutton ajouter avant meme qu'il y est une functionality sélectionéé.
en suite je veux les meme fonctionnalité pour une functionality que pour idea supprimer ajouter et modifier l'ordre.  */
"use client"; // Indique que ce composant est un Client Component

import React, { useEffect, useState } from 'react'; // Import de React
import { Trash2, Edit } from 'lucide-react';
import useSWR from 'swr';
import { useFunctionalityStore } from '@/lib/store/useFunctionalityStore';
import { useFunctionalityItemStore } from '@/lib/store/useFunctionalityItemStore';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShowFunctionality() {
  const { selectedFunctionality } = useFunctionalityStore(); // Récupère la fonctionnalité sélectionnée depuis le store
  const { selectedFunctionalityItem, setSelectedFunctionalityItem } = useFunctionalityItemStore(); // Store pour gérer les éléments de fonctionnalité
  const [newFunctionalityItemContent, setNewFunctionalityItemContent] = useState('');

  // Récupère les éléments de fonctionnalité en fonction de la fonctionnalité sélectionnée
  const { data: functionalityItems, error, mutate } = useSWR(
    selectedFunctionality ? `/api/functionalityItems?functionalityId=${selectedFunctionality.id}` : null,
    fetcher
  );

  // Supprime un élément de fonctionnalité
  const handleDelete = async (id: string) => {
    await fetch(`/api/functionalityItems/${id}`, {
      method: 'DELETE',
    });
    mutate(); // Recharge les données après suppression
  };

  // Ajoute un nouvel élément de fonctionnalité
  const handleAddFunctionalityItem = async () => {
    if (!selectedFunctionality) return; // Vérifie qu'une fonctionnalité est sélectionnée

    await fetch('/api/functionalityItems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: newFunctionalityItemContent,
        functionalityId: selectedFunctionality.id,
      }),
    });
    setNewFunctionalityItemContent(''); // Réinitialise le champ de saisie
    mutate(); // Recharge les données après ajout
  };

  if (error) return <div>Failed to load functionality items</div>;
  if (!selectedFunctionality) return <div>No functionality selected</div>;
  if (!functionalityItems) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {functionalityItems.map((item: any) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{item.item}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFunctionalityItem(item)}
                  className="p-2 text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newFunctionalityItemContent}
          onChange={(e) => setNewFunctionalityItemContent(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Ajouter un nouvel élément de fonctionnalité"
        />
        <button
          onClick={handleAddFunctionalityItem}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}