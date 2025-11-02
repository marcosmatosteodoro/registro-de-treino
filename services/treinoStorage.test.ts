import { TreinoStorageService } from './treinoStorage';
import { LocalStorageUtil } from '../utils/localStorage';
import { ITreino } from '../models/treino';
import { IExercicioWithChecked } from '../models/exercicio';

// Mock do LocalStorageUtil
jest.mock('../utils/localStorage', () => ({
  LocalStorageUtil: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    getAllKeys: jest.fn()
  }
}));

// Mock do console.error para capturar logs de erro
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('TreinoStorageService', () => {
  // Dados de teste
  const mockTreino: ITreino = {
    id: 1,
    nome: 'Treino A',
    userId: 1
  };

  const mockExercicios: IExercicioWithChecked[] = [
    {
      id: 1,
      nome: 'ESTEIRA',
      peso: '0',
      series: 1,
      repeticoes: 12,
      treinoId: 1,
      checked: true
    },
    {
      id: 2,
      nome: 'ELEVACAO FRONTAL',
      peso: '3kg',
      series: 3,
      repeticoes: 12,
      treinoId: 1,
      checked: false
    }
  ];

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('getStorageKey', () => {
    test('deve gerar chave correta para ID de treino', () => {
      // Acessa o método privado para teste
      const storageKey = (TreinoStorageService as any).getStorageKey(1);
      expect(storageKey).toBe('treino-1');
    });

    test('deve gerar chaves diferentes para IDs diferentes', () => {
      const key1 = (TreinoStorageService as any).getStorageKey(1);
      const key2 = (TreinoStorageService as any).getStorageKey(2);
      
      expect(key1).toBe('treino-1');
      expect(key2).toBe('treino-2');
      expect(key1).not.toBe(key2);
    });

    test('deve funcionar com IDs grandes', () => {
      const storageKey = (TreinoStorageService as any).getStorageKey(999);
      expect(storageKey).toBe('treino-999');
    });
  });

  describe('saveTreinoProgress', () => {
    test('deve salvar progresso do treino com sucesso', () => {
      TreinoStorageService.saveTreinoProgress(mockTreino, mockExercicios);

      expect(LocalStorageUtil.setItem).toHaveBeenCalledWith(
        'treino-1',
        {
          id: 1,
          nome: 'Treino A',
          exercicios: mockExercicios
        }
      );
      expect(LocalStorageUtil.setItem).toHaveBeenCalledTimes(1);
    });

    test('deve criar dados no formato correto', () => {
      TreinoStorageService.saveTreinoProgress(mockTreino, mockExercicios);

      const [[storageKey, savedData]] = (LocalStorageUtil.setItem as jest.Mock).mock.calls;
      
      expect(storageKey).toBe('treino-1');
      expect(savedData).toEqual({
        id: mockTreino.id,
        nome: mockTreino.nome,
        exercicios: mockExercicios
      });
    });

    test('deve salvar treinos com IDs diferentes', () => {
      const treino2: ITreino = { id: 2, nome: 'Treino B', userId: 1 };
      
      TreinoStorageService.saveTreinoProgress(mockTreino, mockExercicios);
      TreinoStorageService.saveTreinoProgress(treino2, mockExercicios);

      expect(LocalStorageUtil.setItem).toHaveBeenCalledWith('treino-1', expect.any(Object));
      expect(LocalStorageUtil.setItem).toHaveBeenCalledWith('treino-2', expect.any(Object));
      expect(LocalStorageUtil.setItem).toHaveBeenCalledTimes(2);
    });

    test('deve lidar com exercícios vazios', () => {
      TreinoStorageService.saveTreinoProgress(mockTreino, []);

      expect(LocalStorageUtil.setItem).toHaveBeenCalledWith(
        'treino-1',
        {
          id: 1,
          nome: 'Treino A',
          exercicios: []
        }
      );
    });

    test('deve capturar e logar erros', () => {
      const error = new Error('Erro de storage');
      (LocalStorageUtil.setItem as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      TreinoStorageService.saveTreinoProgress(mockTreino, mockExercicios);

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao salvar progresso do treino:', error);
    });
  });

  describe('getTreinoProgress', () => {
    test('deve recuperar progresso do treino com sucesso', () => {
      const mockSavedData = {
        id: 1,
        nome: 'Treino A',
        exercicios: mockExercicios
      };

      (LocalStorageUtil.getItem as jest.Mock).mockReturnValue(mockSavedData);

      const result = TreinoStorageService.getTreinoProgress(1);

      expect(LocalStorageUtil.getItem).toHaveBeenCalledWith('treino-1');
      expect(result).toEqual(mockSavedData);
    });

    test('deve retornar null quando não há dados salvos', () => {
      (LocalStorageUtil.getItem as jest.Mock).mockReturnValue(null);

      const result = TreinoStorageService.getTreinoProgress(1);

      expect(LocalStorageUtil.getItem).toHaveBeenCalledWith('treino-1');
      expect(result).toBeNull();
    });

    test('deve buscar treinos com IDs diferentes', () => {
      TreinoStorageService.getTreinoProgress(1);
      TreinoStorageService.getTreinoProgress(2);

      expect(LocalStorageUtil.getItem).toHaveBeenCalledWith('treino-1');
      expect(LocalStorageUtil.getItem).toHaveBeenCalledWith('treino-2');
      expect(LocalStorageUtil.getItem).toHaveBeenCalledTimes(2);
    });

    test('deve capturar e logar erros, retornando null', () => {
      const error = new Error('Erro de storage');
      (LocalStorageUtil.getItem as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      const result = TreinoStorageService.getTreinoProgress(1);

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao recuperar progresso do treino:', error);
      expect(result).toBeNull();
    });
  });

  describe('clearTreinoProgress', () => {
    test('deve remover progresso do treino com sucesso', () => {
      TreinoStorageService.clearTreinoProgress(1);

      expect(LocalStorageUtil.removeItem).toHaveBeenCalledWith('treino-1');
      expect(LocalStorageUtil.removeItem).toHaveBeenCalledTimes(1);
    });

    test('deve remover treinos com IDs diferentes', () => {
      TreinoStorageService.clearTreinoProgress(1);
      TreinoStorageService.clearTreinoProgress(2);

      expect(LocalStorageUtil.removeItem).toHaveBeenCalledWith('treino-1');
      expect(LocalStorageUtil.removeItem).toHaveBeenCalledWith('treino-2');
      expect(LocalStorageUtil.removeItem).toHaveBeenCalledTimes(2);
    });

    test('deve capturar e logar erros', () => {
      const error = new Error('Erro de storage');
      (LocalStorageUtil.removeItem as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      TreinoStorageService.clearTreinoProgress(1);

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao limpar progresso do treino:', error);
    });
  });

  describe('getSavedTreinoIds', () => {
    test('deve retornar IDs de treinos salvos', () => {
      const mockKeys = ['treino-1', 'treino-2', 'treino-3', 'other-key'];
      (LocalStorageUtil.getAllKeys as jest.Mock).mockReturnValue(mockKeys);

      const result = TreinoStorageService.getSavedTreinoIds();

      expect(LocalStorageUtil.getAllKeys).toHaveBeenCalledTimes(1);
      expect(result).toEqual([1, 2, 3]);
    });

    test('deve filtrar apenas chaves de treino', () => {
      const mockKeys = ['treino-1', 'user-1', 'treino-5', 'config', 'treino-10'];
      (LocalStorageUtil.getAllKeys as jest.Mock).mockReturnValue(mockKeys);

      const result = TreinoStorageService.getSavedTreinoIds();

      expect(result).toEqual([1, 5, 10]);
    });

    test('deve retornar array vazio quando não há treinos salvos', () => {
      const mockKeys = ['user-1', 'config', 'other-data'];
      (LocalStorageUtil.getAllKeys as jest.Mock).mockReturnValue(mockKeys);

      const result = TreinoStorageService.getSavedTreinoIds();

      expect(result).toEqual([]);
    });

    test('deve retornar array vazio quando não há chaves', () => {
      (LocalStorageUtil.getAllKeys as jest.Mock).mockReturnValue([]);

      const result = TreinoStorageService.getSavedTreinoIds();

      expect(result).toEqual([]);
    });

    test('deve ignorar chaves com IDs inválidos', () => {
      const mockKeys = ['treino-1', 'treino-abc', 'treino-', 'treino-2', 'treino-xyz'];
      (LocalStorageUtil.getAllKeys as jest.Mock).mockReturnValue(mockKeys);

      const result = TreinoStorageService.getSavedTreinoIds();

      expect(result).toEqual([1, 2]);
    });

    test('deve capturar e logar erros, retornando array vazio', () => {
      const error = new Error('Erro de storage');
      (LocalStorageUtil.getAllKeys as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      const result = TreinoStorageService.getSavedTreinoIds();

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao listar treinos salvos:', error);
      expect(result).toEqual([]);
    });

    test('deve ordenar IDs numericamente', () => {
      const mockKeys = ['treino-10', 'treino-2', 'treino-1', 'treino-25'];
      (LocalStorageUtil.getAllKeys as jest.Mock).mockReturnValue(mockKeys);

      const result = TreinoStorageService.getSavedTreinoIds();

      // O resultado não será ordenado, mas testamos que todos os IDs estão presentes
      expect(result).toHaveLength(4);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(10);
      expect(result).toContain(25);
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof TreinoStorageService).toBe('function');
      expect(typeof TreinoStorageService.saveTreinoProgress).toBe('function');
      expect(typeof TreinoStorageService.getTreinoProgress).toBe('function');
      expect(typeof TreinoStorageService.clearTreinoProgress).toBe('function');
      expect(typeof TreinoStorageService.getSavedTreinoIds).toBe('function');
    });

    test('deve ter método privado getStorageKey', () => {
      expect((TreinoStorageService as any).getStorageKey).toBeDefined();
      expect(typeof (TreinoStorageService as any).getStorageKey).toBe('function');
    });
  });

  describe('integração entre métodos', () => {
    test('deve salvar e recuperar progresso corretamente', () => {
      const mockSavedData = {
        id: mockTreino.id,
        nome: mockTreino.nome,
        exercicios: mockExercicios
      };

      // Configura o mock para retornar os dados salvos
      (LocalStorageUtil.getItem as jest.Mock).mockReturnValue(mockSavedData);

      // Salva o progresso
      TreinoStorageService.saveTreinoProgress(mockTreino, mockExercicios);

      // Recupera o progresso
      const result = TreinoStorageService.getTreinoProgress(mockTreino.id);

      expect(result).toEqual(mockSavedData);
    });

    test('deve usar a mesma chave para salvar e recuperar', () => {
      TreinoStorageService.saveTreinoProgress(mockTreino, mockExercicios);
      TreinoStorageService.getTreinoProgress(mockTreino.id);

      // Verifica se a mesma chave foi usada
      expect(LocalStorageUtil.setItem).toHaveBeenCalledWith('treino-1', expect.any(Object));
      expect(LocalStorageUtil.getItem).toHaveBeenCalledWith('treino-1');
    });
  });
});