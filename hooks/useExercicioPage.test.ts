import { renderHook, act } from '@testing-library/react';
import { useExercicioPage } from './useExercicioPage';
import { useAppContext } from '@/contexts/AppContext';
import { GetExerciciosByTreino } from '@/services/getExerciciosByTreino';
import { TreinoStorageService } from '@/services/treinoStorage';
import { Treino } from '@/models/treino';
import { IExercicio, IExercicioWithChecked } from '@/models/exercicio';

// Mock dos módulos externos
jest.mock('@/contexts/AppContext');
jest.mock('@/services/getExerciciosByTreino');
jest.mock('@/services/treinoStorage');

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;
const mockGetExerciciosByTreino = GetExerciciosByTreino as jest.Mocked<typeof GetExerciciosByTreino>;
const mockTreinoStorageService = TreinoStorageService as jest.Mocked<typeof TreinoStorageService>;

describe('useExercicioPage', () => {
  // Mock data
  const mockTreino: Treino = {
    id: 1,
    nome: 'Treino A',
    userId: 1
  };

  const mockExercicios: IExercicio[] = [
    { id: 1, nome: 'Supino', peso: '70kg', series: 3, repeticoes: 12, treinoId: 1 },
    { id: 2, nome: 'Agachamento', peso: '80kg', series: 4, repeticoes: 10, treinoId: 1 },
    { id: 3, nome: 'Esteira', peso: '0', series: 1, repeticoes: 20, treinoId: 1 },
  ];

  const mockExerciciosComChecked: IExercicioWithChecked[] = [
    { id: 1, nome: 'Supino', peso: '70kg', series: 3, repeticoes: 12, treinoId: 1, checked: false },
    { id: 2, nome: 'Agachamento', peso: '80kg', series: 4, repeticoes: 10, treinoId: 1, checked: false },
    { id: 3, nome: 'Esteira', peso: '0', series: 1, repeticoes: 20, treinoId: 1, checked: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks default
    mockUseAppContext.mockReturnValue({
      currentTreino: mockTreino,
      setCurrentTreino: jest.fn(),
      currentUser: null,
      setCurrentUser: jest.fn(),
      clearUser: jest.fn(),
      clearTreino: jest.fn()
    });
    
    mockGetExerciciosByTreino.getByTreinoId.mockReturnValue(mockExercicios);
    mockTreinoStorageService.getTreinoProgress.mockReturnValue(null);
    mockTreinoStorageService.saveTreinoProgress.mockImplementation(() => {});
  });

  describe('inicialização', () => {
    it('deve retornar as propriedades corretas', () => {
      const { result } = renderHook(() => useExercicioPage());

      expect(result.current).toHaveProperty('currentTreino');
      expect(result.current).toHaveProperty('exerciciosComChecked');
      expect(result.current).toHaveProperty('handleCheckboxChange');
      expect(result.current).toHaveProperty('handleRestore');
      expect(result.current).toHaveProperty('getText');
    });

    it('deve retornar o treino atual do contexto', () => {
      const { result } = renderHook(() => useExercicioPage());

      expect(result.current.currentTreino).toBe(mockTreino);
    });

    it('deve buscar exercícios baseado no treino atual', () => {
      renderHook(() => useExercicioPage());

      expect(mockGetExerciciosByTreino.getByTreinoId).toHaveBeenCalledWith(1);
    });

    it('deve buscar exercícios com ID 0 quando não há treino atual', () => {
      mockUseAppContext.mockReturnValue({
        currentTreino: null,
        setCurrentTreino: jest.fn(),
        currentUser: null,
        setCurrentUser: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      renderHook(() => useExercicioPage());

      expect(mockGetExerciciosByTreino.getByTreinoId).toHaveBeenCalledWith(0);
    });
  });

  describe('estado inicial dos exercícios', () => {
    it('deve inicializar exercícios com checked false quando não há dados salvos', async () => {
      const { result } = renderHook(() => useExercicioPage());

      // Aguarda o useEffect ser executado
      await act(async () => {});

      expect(result.current.exerciciosComChecked).toEqual(mockExerciciosComChecked);
      expect(mockTreinoStorageService.saveTreinoProgress).toHaveBeenCalledWith(mockTreino, mockExerciciosComChecked);
    });

    it('deve restaurar estado salvo quando há dados no storage', async () => {
      const savedProgress = {
        id: mockTreino.id,
        nome: mockTreino.nome,
        exercicios: [
          { ...mockExerciciosComChecked[0], checked: true },
          { ...mockExerciciosComChecked[1], checked: false },
          { ...mockExerciciosComChecked[2], checked: true },
        ]
      };

      mockTreinoStorageService.getTreinoProgress.mockReturnValue(savedProgress);

      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      expect(result.current.exerciciosComChecked[0].checked).toBe(true);
      expect(result.current.exerciciosComChecked[1].checked).toBe(false);
      expect(result.current.exerciciosComChecked[2].checked).toBe(true);
    });

    it('deve usar checked false para exercícios não encontrados no storage', async () => {
      const savedProgress = {
        id: mockTreino.id,
        nome: mockTreino.nome,
        exercicios: [
          { ...mockExerciciosComChecked[0], checked: true },
          // Faltando exercícios 2 e 3
        ]
      };

      mockTreinoStorageService.getTreinoProgress.mockReturnValue(savedProgress);

      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      expect(result.current.exerciciosComChecked[0].checked).toBe(true);
      expect(result.current.exerciciosComChecked[1].checked).toBe(false);
      expect(result.current.exerciciosComChecked[2].checked).toBe(false);
    });
  });

  describe('handleCheckboxChange', () => {
    it('deve alternar o status checked do exercício correto', async () => {
      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      act(() => {
        result.current.handleCheckboxChange(1);
      });

      expect(result.current.exerciciosComChecked[0].checked).toBe(true);
      expect(result.current.exerciciosComChecked[1].checked).toBe(false);
      expect(result.current.exerciciosComChecked[2].checked).toBe(false);
    });

    it('deve salvar progresso após alternar checkbox', async () => {
      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      act(() => {
        result.current.handleCheckboxChange(2);
      });

      const expectedExercicios = [
        { ...mockExerciciosComChecked[0], checked: false },
        { ...mockExerciciosComChecked[1], checked: true },
        { ...mockExerciciosComChecked[2], checked: false },
      ];

      expect(mockTreinoStorageService.saveTreinoProgress).toHaveBeenCalledWith(mockTreino, expectedExercicios);
    });

    it('deve alternar de volta quando chamado novamente com mesmo ID', async () => {
      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      act(() => {
        result.current.handleCheckboxChange(1);
      });

      expect(result.current.exerciciosComChecked[0].checked).toBe(true);

      act(() => {
        result.current.handleCheckboxChange(1);
      });

      expect(result.current.exerciciosComChecked[0].checked).toBe(false);
    });
  });

  describe('handleRestore', () => {
    it('deve resetar todos os exercícios para não checked', async () => {
      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      // Primeiro marcar alguns exercícios
      act(() => {
        result.current.handleCheckboxChange(1);
      });

      act(() => {
        result.current.handleCheckboxChange(2);
      });

      expect(result.current.exerciciosComChecked[0].checked).toBe(true);
      expect(result.current.exerciciosComChecked[1].checked).toBe(true);

      // Depois restaurar
      act(() => {
        result.current.handleRestore();
      });

      expect(result.current.exerciciosComChecked[0].checked).toBe(false);
      expect(result.current.exerciciosComChecked[1].checked).toBe(false);
      expect(result.current.exerciciosComChecked[2].checked).toBe(false);
    });

    it('deve salvar progresso após restaurar', async () => {
      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      act(() => {
        result.current.handleRestore();
      });

      expect(mockTreinoStorageService.saveTreinoProgress).toHaveBeenCalledWith(mockTreino, mockExerciciosComChecked);
    });
  });

  describe('getText', () => {
    it('deve formatar texto para exercício com peso, séries e repetições', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = mockExercicios[0]; // Supino

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('70kg • 3 séries • 12 repetições');
    });

    it('deve formatar texto para exercício sem peso', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = { ...mockExercicios[0], peso: '0' };

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('3 séries • 12 repetições');
    });

    it('deve formatar texto para exercício com peso vazio', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = { ...mockExercicios[0], peso: '' };

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('3 séries • 12 repetições');
    });

    it('deve usar singular para 1 série', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = { ...mockExercicios[0], series: 1 };

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('70kg • 1 série • 12 repetições');
    });

    it('deve usar singular para 1 repetição', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = { ...mockExercicios[0], repeticoes: 1 };

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('70kg • 3 séries • 1 repetição');
    });

    it('deve mostrar "Minutos" para esteira', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = mockExercicios[2]; // Esteira

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('1 série • 20 Minutos');
    });

    it('deve mostrar "Minutos" para esteira (case insensitive)', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = { ...mockExercicios[2], nome: 'ESTEIRA' };

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('1 série • 20 Minutos');
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com currentTreino null', () => {
      mockUseAppContext.mockReturnValue({
        currentTreino: null,
        setCurrentTreino: jest.fn(),
        currentUser: null,
        setCurrentUser: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useExercicioPage());

      expect(result.current.currentTreino).toBeNull();
      expect(mockTreinoStorageService.saveTreinoProgress).not.toHaveBeenCalled();
    });

    it('deve lidar com lista de exercícios vazia', () => {
      mockGetExerciciosByTreino.getByTreinoId.mockReturnValue([]);

      const { result } = renderHook(() => useExercicioPage());

      expect(result.current.exerciciosComChecked).toEqual([]);
    });

    it('deve lidar com exercício sem nome', () => {
      const { result } = renderHook(() => useExercicioPage());
      const exercicio = { ...mockExercicios[0], nome: '' };

      const texto = result.current.getText(exercicio);

      expect(texto).toBe('70kg • 3 séries • 12 repetições');
    });
  });

  describe('integração entre métodos', () => {
    it('deve manter consistência entre handleCheckboxChange e getText', async () => {
      const { result } = renderHook(() => useExercicioPage());

      await act(async () => {});

      act(() => {
        result.current.handleCheckboxChange(1);
      });

      const exercicioMarcado = result.current.exerciciosComChecked.find(ex => ex.id === 1);
      const texto = result.current.getText(exercicioMarcado!);

      expect(exercicioMarcado?.checked).toBe(true);
      expect(texto).toBe('70kg • 3 séries • 12 repetições');
    });

    it('deve recarregar quando treino muda', async () => {
      const { result, rerender } = renderHook(() => useExercicioPage());

      await act(async () => {});

      // Simular mudança de treino
      const novoTreino = { ...mockTreino, id: 2 };
      mockUseAppContext.mockReturnValue({
        currentTreino: novoTreino,
        setCurrentTreino: jest.fn(),
        currentUser: null,
        setCurrentUser: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      rerender();

      await act(async () => {});

      expect(mockGetExerciciosByTreino.getByTreinoId).toHaveBeenCalledWith(2);
    });
  });
});