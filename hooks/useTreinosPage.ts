import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { ITreino } from "@/models/treino";
import { GetTreinosByUser } from "@/services/getTreinosByUser";
import { ButtonGrey, ButtonOrange, ButtonPurple } from "@/components";

export const useTreinosPage = () => {
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

  return {
    treinos,
    handleTreinoSelection,
    getButtonComponent
  };
};
