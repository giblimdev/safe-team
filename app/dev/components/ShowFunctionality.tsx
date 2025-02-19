
//app/dev/components/ShowFunctionality.tsx
"use client"; 

import React from 'react'; 
import { useFunctionalityStore } from '@/lib/store/useFunctionalityStore';
import useSWR from 'swr';
import { Edit, Trash2, ArrowUp, ArrowDown} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShowFunctionality() {
  const { selectedFunctionality, setSelectedFunctionality } = useFunctionalityStore();
  const { data: functionalities, error, mutate } = useSWR(
    selectedFunctionality ? `/api/functionalities?ideaId=${selectedFunctionality.id}` : null,
    fetcher
  );

  if (error) return <div>Failed to load functionalities</div>;
  if (!selectedFunctionality) return <div>No functionality selected</div>;
  if (!functionalities) return <div>Loading...</div>;

    function handleDelete(id: any): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="space-y-4">
        <p>ShowFunctionality</p>
      <div className="space-y-2">
        {functionalities.map((functionality: any) => (
          <div key={functionality.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{functionality.content}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFunctionality(functionality)}
                  className="p-2 text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(functionality.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}