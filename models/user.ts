export class User {
  id: number;
  nome: string;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }
}

// Interface alternativa para tipagem
export interface IUser {
  id: number;
  nome: string;
}