"use client";

import { Title, Header } from "@/components";
import { useAppContext } from "@/contexts/AppContext";
import { GetExerciciosByTreino } from "@/services/getExerciciosByTreino";
import { useValidation } from "@/hooks/useValidation";
import { useEffect, useMemo, useState } from "react";
import { IExercicio } from "@/models/exercicio";
import { LocalStorageUtil } from "@/utils/localStorage";

interface IExercicioWithChecked extends IExercicio {
  checked: boolean;
}

interface ISavedTreinoData {
  id: number;
  nome: string;
  exercicios: IExercicioWithChecked[];
}

export default function Exercicios() {
  const { currentTreino } = useAppContext();
  const { userValidate, treinoValidate } = useValidation();
  const [exerciciosComChecked, setExerciciosComChecked] = useState<IExercicioWithChecked[]>([]);

  const exercicios = useMemo(() => {
    return GetExerciciosByTreino.getByTreinoId(currentTreino?.id || 0);
  }, [currentTreino]);

  const handleSetExercicios = (newChecked: IExercicioWithChecked[]) => {
    // Salva no localStorage antes de persistir no useState
    if (currentTreino) {
      const treinoData = {
        ...currentTreino,
        exercicios: newChecked
      };
      LocalStorageUtil.setItem(`treino-${currentTreino.id}`, treinoData);
    }
    
    setExerciciosComChecked(newChecked);
  };

  const getInitialCheckedState = () => {
    // Tenta recuperar dados salvos do localStorage
    if (currentTreino) {
      const savedTreino = LocalStorageUtil.getItem<ISavedTreinoData>(`treino-${currentTreino.id}`);
      if (savedTreino && savedTreino.exercicios) {
        // Mapeia os exercícios com os estados salvos
        return exercicios.map(exercicio => {
          const savedExercicio = savedTreino.exercicios.find((ex: IExercicioWithChecked) => ex.id === exercicio.id);
          return { 
            ...exercicio, 
            checked: savedExercicio ? savedExercicio.checked : false 
          };
        });
      }
    }
    
    // Se não houver dados salvos, retorna com todos desmarcados
    return exercicios.map(exercicio => ({ ...exercicio, checked: false }));
  };

  const handleCheckboxChange = (id: number) => {
    const newChecked = exerciciosComChecked.map(exercicio => ({ ...exercicio, checked: exercicio.id === id ? !exercicio.checked : exercicio.checked }));
    handleSetExercicios(newChecked);
  };

  const handleRestore = () => {
    handleSetExercicios(exercicios.map(exercicio => ({ ...exercicio, checked: false })));
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

  useEffect(() => {
    userValidate();
    treinoValidate();
  }, []);

  useEffect(() => {
    const initialCheckedState = getInitialCheckedState()
    handleSetExercicios(initialCheckedState);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-gray-900 to-black">
      {/* Header com navegação */}
      <Header backRoute="/treinos" />

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col items-center px-6 py-8">
        <Title>{currentTreino?.nome}</Title>

        {/* Lista de exercícios */}
        <div className="w-full max-w-md space-y-4">
          {exerciciosComChecked.map((exercicio, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={exercicio.checked}
                onChange={() => handleCheckboxChange(exercicio.id)}
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