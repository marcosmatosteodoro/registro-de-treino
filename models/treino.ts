export class Treino {
  id: number;
  nome: string;
  userId: number;

  constructor(id: number, nome: string, userId: number) {
    this.id = id;
    this.nome = nome;
    this.userId = userId;
  }
}

// Interface alternativa para tipagem
export interface ITreino {
  id: number;
  nome: string;
  userId: number;
}