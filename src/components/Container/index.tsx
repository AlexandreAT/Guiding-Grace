import { ContainerStyled } from "./styles";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <ContainerStyled className={className}>{children}</ContainerStyled>;
}
