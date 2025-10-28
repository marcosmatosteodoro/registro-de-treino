export class Exercicio {
  id: number;
  nome: string;
  peso: string;
  repeticoes: number;

  constructor(id: number, nome: string, peso: string, repeticoes: number) {
    this.id = id;
    this.nome = nome;
    this.peso = peso;
    this.repeticoes = repeticoes;
  }
}

// Interface alternativa para tipagem
export interface IExercicio {
  id: number;
  nome: string;
  peso: string;
  repeticoes: number;
}