/**
 * Utilitário para gerenciar itens no localStorage
 */
export class LocalStorageUtil {
  /**
   * Salva um item no localStorage
   * @param key Chave do item
   * @param value Valor a ser salvo (será convertido para JSON)
   */
  static setItem<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined') {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error(`Erro ao salvar item no localStorage com chave "${key}":`, error);
    }
  }

  /**
   * Recupera um item do localStorage
   * @param key Chave do item
   * @param defaultValue Valor padrão caso o item não exista
   * @returns O valor recuperado ou o valor padrão
   */
  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      }
      return defaultValue;
    } catch (error) {
      console.error(`Erro ao recuperar item do localStorage com chave "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Remove um item do localStorage
   * @param key Chave do item a ser removido
   */
  static removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erro ao remover item do localStorage com chave "${key}":`, error);
    }
  }

  /**
   * Limpa todo o localStorage
   */
  static clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Erro ao limpar o localStorage:', error);
    }
  }

  /**
   * Verifica se uma chave existe no localStorage
   * @param key Chave a ser verificada
   * @returns true se a chave existir, false caso contrário
   */
  static hasItem(key: string): boolean {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key) !== null;
      }
      return false;
    } catch (error) {
      console.error(`Erro ao verificar item no localStorage com chave "${key}":`, error);
      return false;
    }
  }

  /**
   * Obtém todas as chaves do localStorage
   * @returns Array com todas as chaves
   */
  static getAllKeys(): string[] {
    try {
      if (typeof window !== 'undefined') {
        return Object.keys(localStorage);
      }
      return [];
    } catch (error) {
      console.error('Erro ao obter chaves do localStorage:', error);
      return [];
    }
  }
}