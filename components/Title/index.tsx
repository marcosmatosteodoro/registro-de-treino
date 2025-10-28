interface TitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="mb-16 text-5xl font-bold text-white tracking-tight">
      {children}
    </h1>
  );
};