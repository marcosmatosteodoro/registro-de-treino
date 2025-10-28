import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

export const useValidation = () => {
  const router = useRouter();
  const { currentUser, currentTreino } = useAppContext();

  const userValidate = (): void => {
    if (!currentUser) {
      router.push("/");
    }
  };

  const treinoValidate = (): void => {
    if (!currentTreino) {
      router.push("/treinos");
    }
  };

  return {
    userValidate,
    treinoValidate
  };
};