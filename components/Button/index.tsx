interface ButtonProps {
  children: React.ReactNode;
  additionalClasses?: string;
  onClick?: () => void;
}

export const Button = ({ children, onClick, additionalClasses }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-48 h-16 bg-linear-to-r text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${additionalClasses}`}
    >
      {children}
    </button>
  );
};

export const ButtonOrange = ({ children, onClick }: ButtonProps) => {
  return (
    <Button onClick={onClick} additionalClasses="from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
      {children}
    </Button>
  );
}

export const ButtonPurple = ({ children, onClick }: ButtonProps) => {
  return (
    <Button onClick={onClick} additionalClasses="from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
      {children}
    </Button>
  );
}

export const ButtonGrey = ({ children, onClick }: ButtonProps) => {
  return (
    <Button onClick={onClick} additionalClasses="from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
      {children}
    </Button>
  );
}