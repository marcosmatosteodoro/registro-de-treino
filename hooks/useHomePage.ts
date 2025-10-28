import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GetUsers } from "@/services/getUsers";
import { useAppContext } from "@/contexts/AppContext";
import { IUser } from "@/models/user";
import { ButtonGrey, ButtonOrange, ButtonPurple } from "@/components/";

export const useHomePage = () => {
  const users = GetUsers.getAll();
  const router = useRouter();
  const { setCurrentUser, clearUser } = useAppContext();

  useEffect(() => {
    clearUser();
  }, []);

  const handleUserSelection = (user: IUser) => {
    if (user) {
      setCurrentUser(user);
      console.log(`Usuário selecionado: ${user.nome}`);
      
      router.push("/treinos");
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
    users,
    handleUserSelection,
    getButtonComponent
  };
};