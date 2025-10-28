"use client";

import { GetExerciciosByTreino } from "@/services/getExerciciosByTreino";
import Link from "next/link";
import { useState } from "react";

export default function Exercicios() {
  const [checkedExercises, setCheckedExercises] = useState<boolean[]>(
    new Array(8).fill(false)
  );

  const exercicios = GetExerciciosByTreino.getByTreinoId(1);

  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checkedExercises];
    newChecked[index] = !newChecked[index];
    setCheckedExercises(newChecked);
  };

  const handleRestore = () => {
    setCheckedExercises(new Array(8).fill(false));
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-gray-900 to-black">
      {/* Header com navegação */}
      <header className="flex items-center justify-between p-4">
        <Link 
          href="/treinos"
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        
        <span className="text-gray-400 text-lg font-medium">
          Evelin
        </span>
      </header>

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col items-center px-6 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white tracking-tight">
          Treino A
        </h1>
        
        {/* Lista de exercícios */}
        <div className="w-full max-w-md space-y-4">
          {exercicios.map((exercicio, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={checkedExercises[index]}
                onChange={() => handleCheckboxChange(index)}
                className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
              />
              
              <div className="flex-1 text-white">
                <div className="font-semibold text-lg">{exercicio.nome}</div>
                <div className="text-gray-300 text-sm">
                  {exercicio.peso} • {exercicio.repeticoes} repetições
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Restaurar */}
        <button
          onClick={handleRestore}
          className="mt-8 w-48 h-12 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Restaurar
        </button>
      </main>
    </div>
  );
}