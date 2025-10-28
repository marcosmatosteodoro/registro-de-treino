import { Treino } from '../models/treino';
import treinosData from '../data/treinos.json';

export class GetTreinosByUser {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToTreino(treinoData: any): Treino {
    return new Treino(treinoData.id, treinoData.nome, treinoData.userId);
  }

  public static getByUserId(userId: number): Treino[] {
    const userTreinos = treinosData.filter(treino => treino.userId === userId);
    return userTreinos.map(this.mapJsonToTreino);
  }
}