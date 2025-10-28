"use client";

import { ButtonGrey, ButtonOrange, ButtonPurple, NotFoundText, Title, Header } from "@/components";
import { useAppContext } from "@/contexts/AppContext";
import { ITreino } from "@/models/treino";
import { GetTreinosByUser } from "@/services/getTreinosByUser";
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
      <Header backRoute="/" />

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