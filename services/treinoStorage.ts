import { LocalStorageUtil } from "@/utils/localStorage";
import { ITreino } from "@/models/treino";
import { IExercicioWithChecked } from "@/models/exercicio";

interface ISavedTreinoData {
  id: number;
  nome: string;
  exercicios: IExercicioWithChecked[];
}

export class TreinoStorageService {
  private static getStorageKey(treinoId: number): string {
    return `treino-${treinoId}`;
  }

  /**
   * Salva o progresso do treino no localStorage
   * @param treino - O treino atual
   * @param exercicios - Lista de exercícios com status de conclusão
   */
  static saveTreinoProgress(treino: ITreino, exercicios: IExercicioWithChecked[]): void {
    try {
      const treinoData: ISavedTreinoData = {
        id: treino.id,
        nome: treino.nome,
        exercicios: exercicios
      };
      
      const storageKey = this.getStorageKey(treino.id);
      LocalStorageUtil.setItem(storageKey, treinoData);
    } catch (error) {
      console.error('Erro ao salvar progresso do treino:', error);
    }
  }

  /**
   * Recupera o progresso salvo do treino do localStorage
   * @param treinoId - ID do treino
   * @returns Os dados salvos do treino ou null se não existirem
   */
  static getTreinoProgress(treinoId: number): ISavedTreinoData | null {
    try {
      const storageKey = this.getStorageKey(treinoId);
      return LocalStorageUtil.getItem<ISavedTreinoData>(storageKey);
    } catch (error) {
      console.error('Erro ao recuperar progresso do treino:', error);
      return null;
    }
  }

  /**
   * Remove o progresso salvo de um treino específico
   * @param treinoId - ID do treino
   */
  static clearTreinoProgress(treinoId: number): void {
    try {
      const storageKey = this.getStorageKey(treinoId);
      LocalStorageUtil.removeItem(storageKey);
    } catch (error) {
      console.error('Erro ao limpar progresso do treino:', error);
    }
  }

  /**
   * Lista todas as chaves de treinos salvos
   * @returns Array com IDs dos treinos que têm progresso salvo
   */
  static getSavedTreinoIds(): number[] {
    try {
      const allKeys = LocalStorageUtil.getAllKeys();
      return allKeys
        .filter(key => key.startsWith('treino-'))
        .map(key => parseInt(key.replace('treino-', '')))
        .filter(id => !isNaN(id));
    } catch (error) {
      console.error('Erro ao listar treinos salvos:', error);
      return [];
    }
  }
}