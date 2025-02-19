/*Le composant ShowFunctionality affiche les fonctionnalités associées à l'idée survolée.


*/


//@/app/dev/components/ShowIdeas.ts
"use client"; // Indique que ce composant est un Client Component

import React, { useState } from 'react'; // Import de React
import { Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import useSWR from 'swr';
import { useIdeaStore } from '@/lib/store/useIdeaStore';
//import ShowFunctionality from '@/app/dev/components/showFunctionality';
import CompTest from './CompTest';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShowIdeas() {
  const { data: ideas, error, mutate } = useSWR('/api/ideas', fetcher); // Appel GET pour récupérer les idées
  const { selectedIdea, setSelectedIdea } = useIdeaStore();
  const [newIdeaContent, setNewIdeaContent] = useState('');

  // Supprime une idée
  const handleDelete = async (id: string) => {
    await fetch('/api/ideas', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Passer l'ID dans le corps de la requête
    });
    mutate(); // Recharge les données après suppression
  };

  // Ajoute une nouvelle idée
  const handleAddIdea = async () => {
    await fetch('/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newIdeaContent }), // Passer le contenu dans le corps de la requête
    });
    setNewIdeaContent(''); // Réinitialise le champ de saisie
    mutate(); // Recharge les données après ajout
  };

 
  const handleUpdateIdea = async (id: string, content: string) => {
    await fetch('/api/ideas', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content }), // Passer l'ID et le contenu dans le corps de la requête
    });
    mutate(); // Recharge les données après mise à jour
  };

  // Déplace une idée vers le haut
  const handleMoveUp = async (id: string, currentOrder: number) => {
    if (currentOrder === 0) return; // Ne rien faire si l'idée est déjà en première position

    // Trouve l'idée précédente
    const previousIdea = ideas.find((idea: any) => idea.order === currentOrder - 1);

    if (previousIdea) {
      // Met à jour l'ordre des deux idées
      await fetch('/api/ideas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, order: currentOrder - 1 }),
      });

      await fetch('/api/ideas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: previousIdea.id, order: currentOrder }),
      });

      mutate(); // Recharge les données après mise à jour
    }
  };

  // Déplace une idée vers le bas
  const handleMoveDown = async (id: string, currentOrder: number) => {
    if (currentOrder === ideas.length - 1) return; // Ne rien faire si l'idée est déjà en dernière position

    // Trouve l'idée suivante
    const nextIdea = ideas.find((idea: any) => idea.order === currentOrder + 1);

    if (nextIdea) {
      // Met à jour l'ordre des deux idées
      await fetch('/api/ideas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, order: currentOrder + 1 }),
      });

      await fetch('/api/ideas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: nextIdea.id, order: currentOrder }),
      });

      mutate(); // Recharge les données après mise à jour
    }
  };

  if (error) return <div>Failed to load ideas</div>;
  if (!ideas) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
            <div className="space-y-2">
        {ideas
          .sort((a: any, b: any) => a.order - b.order) // Trie les idées par ordre
          .map((idea: any) => (
            <div key={idea.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{idea.content}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveUp(idea.id, idea.order)}
                    className="p-2 text-green-500 hover:text-green-700"
                  >
                    <ArrowUp size={20} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idea.id, idea.order)}
                    className="p-2 text-green-500 hover:text-green-700"
                  >
                    <ArrowDown size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedIdea(idea);
                      const newContent = prompt('Modifier l\'idée', idea.content);
                      if (newContent !== null) {
                        handleUpdateIdea(idea.id, newContent);
                      }
                    }}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <CompTest/>
            </div>
          ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newIdeaContent}
          onChange={(e) => setNewIdeaContent(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Ajouter une nouvelle idée"
        />
        <button
          onClick={handleAddIdea}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Ajouter
        </button>
      </div>

    </div>
  );
}
/* 
modifie ce code pour que le store sois mis a jour avec onmouseEnter sans casser ce code qui est fonctionnel
*/