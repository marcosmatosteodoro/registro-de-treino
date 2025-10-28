import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link"

interface HeaderProps {
  backRoute: string;
}

export const Header = ({ backRoute }: HeaderProps) => {
  const { currentUser } = useAppContext();

  return (
    <header className="flex items-center justify-between p-4">
      <Link 
        href={backRoute}
        className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>
      
      <span className="text-gray-400 text-lg font-medium">
        {currentUser?.nome || "Usuário"}
      </span>
    </header>
  )
}