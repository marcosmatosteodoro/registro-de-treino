interface NotFoundTextProps {
  children: React.ReactNode;
}

export const NotFoundText = ({ children }: NotFoundTextProps) => {
  return (
    <span className="text-white text-xl">{children}</span>
  );
}