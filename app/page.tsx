"use client";

import { GetUsers } from "@/services/getUsers";
import { useRouter } from "next/navigation";

export default function Home() {
  const users = GetUsers.getAll();
  const router = useRouter();

  const handleUserSelection = (userId: number) => {
    // Aqui você pode adicionar outras lógicas depois
    console.log(`Usuário selecionado: ${userId}`);
    
    // Redireciona para a página de treinos
    router.push("/treinos");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 to-black">
      <main className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="mb-16 text-5xl font-bold text-white tracking-tight">
          Quem vai treinar?
        </h1>
        
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <button 
            onClick={() => handleUserSelection(users[0].id)}
            className="w-48 h-16 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            {users[0].nome}
          </button>
          
          <button 
            onClick={() => handleUserSelection(users[1].id)}
            className="w-48 h-16 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            {users[1].nome}
          </button>
        </div>
      </main>
    </div>
  );
}
