"use client";

import { Title, Header } from "@/components";
import { useAppContext } from "@/contexts/AppContext";
import { GetExerciciosByTreino } from "@/services/getExerciciosByTreino";
import { useValidation } from "@/hooks/useValidation";
import { useEffect, useState } from "react";
import { IExercicio } from "@/models/exercicio";

export default function Exercicios() {
  const { currentTreino } = useAppContext();
  const { userValidate, treinoValidate } = useValidation();
  const [checkedExercises, setCheckedExercises] = useState<boolean[]>(
    new Array(8).fill(false)
  );

  useEffect(() => {
    userValidate();
    treinoValidate();
  }, []);

  const exercicios = GetExerciciosByTreino.getByTreinoId(currentTreino?.id || 0);

  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checkedExercises];
    newChecked[index] = !newChecked[index];
    setCheckedExercises(newChecked);
  };

  const handleRestore = () => {
    setCheckedExercises(new Array(8).fill(false));
  };

  const getSeriesText = (series: number) => {
    return `${series} ${series > 1 ? "séries" : "série"} • `;
  }

  const getRepeticoesText = (repeticoes: number) => {
    return `${repeticoes} ${repeticoes > 1 ? "repetições" : "repetição"}`;
  }

  const getText = (exercicio: IExercicio) => {
    let text = [
      !!exercicio.peso && exercicio.peso != "0" ? `${exercicio.peso} • ` : "",
      getSeriesText(exercicio.series),
      exercicio.nome.toLowerCase() != "esteira" ? getRepeticoesText(exercicio.repeticoes) : `${exercicio.repeticoes} Minutos`,
    ]
    return text.join("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-gray-900 to-black">
      {/* Header com navegação */}
      <Header backRoute="/treinos" />

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col items-center px-6 py-8">
        <Title>{currentTreino?.nome}</Title>

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
                <div className="text-gray-300 text-sm">{getText(exercicio)}</div>
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