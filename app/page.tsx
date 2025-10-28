"use client";

import { GetUsers } from "@/services/getUsers";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect } from "react";
import { ButtonGrey, ButtonOrange, ButtonPurple, Title } from "@/components/";
import { IUser } from "@/models/user";

export default function Home() {
  const users = GetUsers.getAll();
  const router = useRouter();
  const { changeUser, clearUser } = useAppContext();

  useEffect(() => {
    clearUser();
  }, [clearUser]);

  const handleUserSelection = (userId: number) => {
    const selectedUser = users.find(user => user.id === userId);
    
    if (selectedUser) {
      changeUser(selectedUser);
      console.log(`Usuário selecionado: ${selectedUser.nome}`);
      
      router.push("/treinos");
    }
  };

  const renderUserButton = (user: IUser, index: number) => {
    switch (index) {
      case 0:
        return (
          <ButtonOrange
            key={user.id}
            onClick={() => handleUserSelection(user.id)}
          >
            {user.nome}
          </ButtonOrange>
        );

      case 1:
        return (
          <ButtonPurple
            key={user.id}
            onClick={() => handleUserSelection(user.id)}
          >
            {user.nome}
          </ButtonPurple>
        );

      default:
        return (
          <ButtonGrey
            key={user.id}
            onClick={() => handleUserSelection(user.id)}
          >
          {user.nome}
        </ButtonGrey>
      );
    }
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
