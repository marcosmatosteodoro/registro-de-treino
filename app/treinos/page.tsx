"use client";

import { ButtonGrey, ButtonOrange, ButtonPurple, NotFoundText, Title } from "@/components";
import { useAppContext } from "@/contexts/AppContext";
import { ITreino } from "@/models/treino";
import { GetTreinos } from "@/services/getTreinos";
import { GetTreinosByUser } from "@/services/getTreinosByUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Treinos() {
  const { currentUser, setCurrentTreino, clearTreino } = useAppContext();
  const treinos = GetTreinosByUser.getByUserId(currentUser?.id || 0);
  const router = useRouter();

  useEffect(() => {
    clearTreino();
  }, []);

  const handleTreinoSelection = (treino: ITreino) => {
    if (treino) {
      setCurrentTreino(treino);
      
      router.push("/exercicios");
    }
  };

  const getButtonComponent = (index: number) => {
    switch (index) {
      case 0: return ButtonOrange;
      case 1: return ButtonPurple;
      default: return ButtonGrey;
    }
  };

  const renderTreinoButton = (treino: ITreino, index: number) => {
      const Button = getButtonComponent(index);
  
      return (
        <Button
          key={treino.id}
          onClick={() => handleTreinoSelection(treino)}
        >
          {treino.nome}
        </Button>
      );
    }


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
          {currentUser?.nome || "Usuário"}
        </span>
      </header>

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <Title>Escolha seu treino</Title>
        
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          {treinos.length >= 2 
            ? treinos.map((treino, index) => renderTreinoButton(treino, index)) 
            : <NotFoundText> Nenhum treino encontrado para este usuário.</NotFoundText>
          }
        </div>
      </main>
    </div>
  );
}