"use client";

import { GetTreinos } from "@/services/getTreinos";
import { GetTreinosByUser } from "@/services/getTreinosByUser";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Treinos() {
  const treinos = GetTreinosByUser.getByUserId(1);
  const router = useRouter();

  const handleTreinoSelection = (treinoId: number) => {
    // Aqui você pode adicionar outras lógicas depois
    console.log(`Treino selecionado: ${treinoId}`);
    
    // Redireciona para a página de exercícios
    router.push("/exercicios");
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-gray-900 to-black">
      {/* Header com navegação */}
      <header className="flex items-center justify-between p-4">
        <Link 
          href="/"
          className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
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
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="mb-16 text-5xl font-bold text-white tracking-tight">
          Escolha seu treino
        </h1>
        
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <button 
            onClick={() => handleTreinoSelection(treinos[0].id)}
            className="w-48 h-16 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            {treinos[0].nome}
          </button>
          
          <button 
            onClick={() => handleTreinoSelection(treinos[1].id)}
            className="w-48 h-16 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            {treinos[1].nome}
          </button>
        </div>
      </main>
    </div>
  );
}