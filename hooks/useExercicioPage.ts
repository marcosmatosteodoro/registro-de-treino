import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { GetExerciciosByTreino } from "@/services/getExerciciosByTreino";
import { TreinoStorageService } from "@/services/treinoStorage";
import { IExercicio, IExercicioWithChecked } from "@/models/exercicio";

export const useExercicioPage = () => {
  const { currentTreino } = useAppContext();
  const [exerciciosComChecked, setExerciciosComChecked] = useState<IExercicioWithChecked[]>([]);

  const exercicios = useMemo(() => {
    return GetExerciciosByTreino.getByTreinoId(currentTreino?.id || 0);
  }, [currentTreino]);

  const handleSetExercicios = (newChecked: IExercicioWithChecked[]) => {
    if (currentTreino) {
      TreinoStorageService.saveTreinoProgress(currentTreino, newChecked);
    }
    
    setExerciciosComChecked(newChecked);
  };

  const getInitialCheckedState = () => {
    if (currentTreino) {
      const savedTreino = TreinoStorageService.getTreinoProgress(currentTreino.id);
      if (savedTreino && savedTreino.exercicios) {
        return exercicios.map(exercicio => {
          const savedExercicio = savedTreino.exercicios.find((ex: IExercicioWithChecked) => ex.id === exercicio.id);
          return { 
            ...exercicio, 
            checked: savedExercicio ? savedExercicio.checked : false 
          };
        });
      }
    }
    
    return exercicios.map(exercicio => ({ ...exercicio, checked: false }));
  };

  const handleCheckboxChange = (id: number) => {
    const newChecked = exerciciosComChecked.map(exercicio => ({ 
      ...exercicio, 
      checked: exercicio.id === id ? !exercicio.checked : exercicio.checked 
    }));
    handleSetExercicios(newChecked);
  };

  const handleRestore = () => {
    handleSetExercicios(exercicios.map(exercicio => ({ ...exercicio, checked: false })));
  };

  const getSeriesText = (series: number) => {
    return `${series} ${series > 1 ? "séries" : "série"} • `;
  };

  const getRepeticoesText = (repeticoes: number) => {
    return `${repeticoes} ${repeticoes > 1 ? "repetições" : "repetição"}`;
  };

  const getText = (exercicio: IExercicio) => {
    const text = [
      !!exercicio.peso && exercicio.peso !== "0" ? `${exercicio.peso} • ` : "",
      getSeriesText(exercicio.series),
      exercicio.nome.toLowerCase() !== "esteira" 
        ? getRepeticoesText(exercicio.repeticoes) 
        : `${exercicio.repeticoes} Minutos`,
    ];
    return text.join("");
  };

  // Carrega estado inicial dos exercícios
  useEffect(() => {
    const initialCheckedState = getInitialCheckedState();
    handleSetExercicios(initialCheckedState);
  }, [exercicios]); // Dependência em exercicios para recarregar quando treino mudar

  return {
    currentTreino,
    exerciciosComChecked,
    handleCheckboxChange,
    handleRestore,
    getText
  };
};