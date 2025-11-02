interface NotFoundTextProps {
  children: React.ReactNode;
}

export const NotFoundText = ({ children }: NotFoundTextProps) => {
  return (
    <span 
      className="text-white text-xl"
      data-testid="not-found-text"
    >
      {children}
    </span>
  );
}