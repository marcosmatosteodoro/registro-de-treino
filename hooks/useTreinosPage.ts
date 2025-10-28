import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { ITreino } from "@/models/treino";
import { GetTreinosByUser } from "@/services/getTreinosByUser";

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

  return {
    treinos,
    handleTreinoSelection
  };
};
