import { Treino } from '../models/treino';
import treinosData from '../data/treinos.json';

export class GetTreinoById {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToTreino(treinoData: any): Treino {
    return new Treino(treinoData.id, treinoData.nome, treinoData.userId);
  }

  public static getById(id: number): Treino | null {
    const treinoData = treinosData.find(treino => treino.id === id);
    
    if (!treinoData) {
      return null;
    }
    
    return this.mapJsonToTreino(treinoData);
  }
}