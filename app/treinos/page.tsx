"use client";

import { NotFoundText, Title, Header } from "@/components";
import { ITreino } from "@/models/treino";
import { useTreinosPage } from "@/hooks/useTreinosPage";
import { useButtonComponent } from "@/hooks/useButtonComponent";
import { useValidation } from "@/hooks/useValidation";
import { useEffect } from "react";

export default function Treinos() {
  const { treinos, handleTreinoSelection } = useTreinosPage();
  const { getButtonComponent } = useButtonComponent();
  const { userValidate } = useValidation();

  // Valida se tem usuário logado
  useEffect(() => {
    userValidate();
  }, []);

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