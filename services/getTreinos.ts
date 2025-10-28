import { Treino } from '../models/treino';
import treinosData from '../data/treinos.json';

export class GetTreinos {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToTreino(treinoData: any): Treino {
    return new Treino(treinoData.id, treinoData.nome, treinoData.userId);
  }

  public static getAll(): Treino[] {
    return treinosData.map(this.mapJsonToTreino);
  }
}