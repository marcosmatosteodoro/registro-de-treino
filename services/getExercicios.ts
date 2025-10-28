import { Exercicio } from '../models/exercicio';
import exerciciosData from '../data/exercicios.json';

export class GetExercicios {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToExercicio(exercicioData: any): Exercicio {
    return new Exercicio(exercicioData.id, exercicioData.nome, exercicioData.peso, exercicioData.series, exercicioData.repeticoes, exercicioData.treinoId);
  }

  public static getAll(): Exercicio[] {
    return exerciciosData.map(this.mapJsonToExercicio);
  }
}