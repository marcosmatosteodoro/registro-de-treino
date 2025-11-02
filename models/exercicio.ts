export class Exercicio {
  id: number;
  nome: string;
  peso: string;
  series: number;
  repeticoes: number;
  treinoId: number;

  constructor(id: number, nome: string, peso: string, series: number, repeticoes: number, treinoId: number) {
    this.id = id;
    this.nome = nome;
    this.peso = peso;
    this.series = series;
    this.repeticoes = repeticoes;
    this.treinoId = treinoId;
  }
}

// Interface alternativa para tipagem
export interface IExercicio {
  id: number;
  nome: string;
  peso: string;
  series: number;
  repeticoes: number;
  treinoId: number;
}

export interface IExercicioWithChecked extends IExercicio {
  checked: boolean;
}