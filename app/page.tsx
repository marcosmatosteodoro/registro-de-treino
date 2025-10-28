"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GetUsers } from "@/services/getUsers";
import { useAppContext } from "@/contexts/AppContext";
import { IUser } from "@/models/user";
import { ButtonGrey, ButtonOrange, ButtonPurple, Title } from "@/components/";

export default function Home() {
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
  
  const renderUserButton = (user: IUser, index: number) => {
    let Button;
    switch (index) {
      case 0: Button = ButtonOrange; break;
      case 1: Button = ButtonPurple; break;
      default: Button = ButtonGrey; break;
    }

    return (
      <Button
        key={user.id}
        onClick={() => handleUserSelection(user)}
      >
        {user.nome}
      </Button>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 to-black">
      <main className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <Title>Quem vai treinar?</Title>
        
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          {users.length > 0 ? 
            users.map((user, index) => renderUserButton(user, index)) 
            : <span className="text-white text-xl">Nenhum usuário disponível</span>
          }
        </div>
      </main>
    </div>
  );
}
