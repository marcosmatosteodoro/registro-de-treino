import { Exercicio } from '../models/exercicio';
import exerciciosData from '../data/exercicios.json';

export class GetExerciciosByTreino {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToExercicio(exercicioData: any): Exercicio {
    return new Exercicio(exercicioData.id, exercicioData.nome, exercicioData.peso, exercicioData.repeticoes, exercicioData.treinoId);
  }

  public static getByTreinoId(treinoId: number): Exercicio[] {
    const treinoExercicios = exerciciosData.filter(exercicio => exercicio.treinoId === treinoId);
    return treinoExercicios.map(this.mapJsonToExercicio);
  }
}