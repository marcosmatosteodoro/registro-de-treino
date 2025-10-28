"use client";

import { IUser } from "@/models/user";
import { Title } from "@/components/";
import { useHomePage } from "@/hooks/useHomePage";

export default function Home() {
  const { users, handleUserSelection, getButtonComponent } = useHomePage();
  
  const renderUserButton = (user: IUser, index: number) => {
    const Button = getButtonComponent(index);

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
