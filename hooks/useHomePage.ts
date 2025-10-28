import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GetUsers } from "@/services/getUsers";
import { useAppContext } from "@/contexts/AppContext";
import { IUser } from "@/models/user";

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

  return {
    users,
    handleUserSelection
  };
};