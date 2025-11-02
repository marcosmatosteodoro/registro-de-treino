import { renderHook, act } from '@testing-library/react';
import { useTreinosPage } from './useTreinosPage';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { GetTreinosByUser } from '@/services/getTreinosByUser';
import { User } from '@/models/user';
import { Treino, ITreino } from '@/models/treino';

// Mock dos módulos externos
jest.mock('next/navigation');
jest.mock('@/contexts/AppContext');
jest.mock('@/services/getTreinosByUser');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;
const mockGetTreinosByUser = GetTreinosByUser as jest.Mocked<typeof GetTreinosByUser>;

describe('useTreinosPage', () => {
  const mockPush = jest.fn();
  const mockSetCurrentTreino = jest.fn();
  const mockClearTreino = jest.fn();
  
  // Mock data
  const mockUser: User = {
    id: 1,
    nome: 'João Silva'
  };

  const mockTreinos: ITreino[] = [
    { id: 1, nome: 'Treino A', userId: 1 },
    { id: 2, nome: 'Treino B', userId: 1 },
    { id: 3, nome: 'Treino C', userId: 1 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks default
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn()
    } as any);
    
    mockUseAppContext.mockReturnValue({
      currentUser: mockUser,
      currentTreino: null,
      setCurrentUser: jest.fn(),
      setCurrentTreino: mockSetCurrentTreino,
      clearUser: jest.fn(),
      clearTreino: mockClearTreino
    });
    
    mockGetTreinosByUser.getByUserId.mockReturnValue(mockTreinos);
  });

  describe('inicialização', () => {
    it('deve retornar as propriedades corretas', () => {
      const { result } = renderHook(() => useTreinosPage());

      expect(result.current).toHaveProperty('treinos');
      expect(result.current).toHaveProperty('handleTreinoSelection');
      expect(typeof result.current.handleTreinoSelection).toBe('function');
    });

    it('deve buscar treinos do usuário atual', () => {
      const { result } = renderHook(() => useTreinosPage());

      expect(mockGetTreinosByUser.getByUserId).toHaveBeenCalledWith(1);
      expect(result.current.treinos).toBe(mockTreinos);
    });

    it('deve buscar treinos com ID 0 quando não há usuário atual', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: mockSetCurrentTreino,
        clearUser: jest.fn(),
        clearTreino: mockClearTreino
      });

      renderHook(() => useTreinosPage());

      expect(mockGetTreinosByUser.getByUserId).toHaveBeenCalledWith(0);
    });

    it('deve limpar treino atual no useEffect', () => {
      renderHook(() => useTreinosPage());

      expect(mockClearTreino).toHaveBeenCalled();
    });

    it('deve usar router do Next.js', () => {
      renderHook(() => useTreinosPage());

      expect(mockUseRouter).toHaveBeenCalled();
    });

    it('deve usar contexto da aplicação', () => {
      renderHook(() => useTreinosPage());

      expect(mockUseAppContext).toHaveBeenCalled();
    });
  });

  describe('handleTreinoSelection', () => {
    it('deve definir treino atual quando treino válido é selecionado', () => {
      const { result } = renderHook(() => useTreinosPage());
      const selectedTreino = mockTreinos[0];

      act(() => {
        result.current.handleTreinoSelection(selectedTreino);
      });

      expect(mockSetCurrentTreino).toHaveBeenCalledWith(selectedTreino);
    });

    it('deve navegar para página de exercícios após seleção', () => {
      const { result } = renderHook(() => useTreinosPage());
      const selectedTreino = mockTreinos[1];

      act(() => {
        result.current.handleTreinoSelection(selectedTreino);
      });

      expect(mockPush).toHaveBeenCalledWith('/exercicios');
    });

    it('deve executar todas as ações em sequência', () => {
      const { result } = renderHook(() => useTreinosPage());
      const selectedTreino = mockTreinos[2];

      act(() => {
        result.current.handleTreinoSelection(selectedTreino);
      });

      expect(mockSetCurrentTreino).toHaveBeenCalledWith(selectedTreino);
      expect(mockPush).toHaveBeenCalledWith('/exercicios');
    });

    it('deve funcionar com diferentes treinos', () => {
      const { result } = renderHook(() => useTreinosPage());

      // Selecionar primeiro treino
      act(() => {
        result.current.handleTreinoSelection(mockTreinos[0]);
      });

      expect(mockSetCurrentTreino).toHaveBeenCalledWith(mockTreinos[0]);
      expect(mockPush).toHaveBeenCalledWith('/exercicios');

      // Limpar mocks
      mockSetCurrentTreino.mockClear();
      mockPush.mockClear();

      // Selecionar segundo treino
      act(() => {
        result.current.handleTreinoSelection(mockTreinos[1]);
      });

      expect(mockSetCurrentTreino).toHaveBeenCalledWith(mockTreinos[1]);
      expect(mockPush).toHaveBeenCalledWith('/exercicios');
    });
  });

  describe('casos extremos', () => {
    it('não deve executar ações quando treino é null', () => {
      const { result } = renderHook(() => useTreinosPage());

      act(() => {
        result.current.handleTreinoSelection(null as any);
      });

      expect(mockSetCurrentTreino).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('não deve executar ações quando treino é undefined', () => {
      const { result } = renderHook(() => useTreinosPage());

      act(() => {
        result.current.handleTreinoSelection(undefined as any);
      });

      expect(mockSetCurrentTreino).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve lidar com lista de treinos vazia', () => {
      mockGetTreinosByUser.getByUserId.mockReturnValue([]);

      const { result } = renderHook(() => useTreinosPage());

      expect(result.current.treinos).toEqual([]);
      expect(mockClearTreino).toHaveBeenCalled();
    });

    it('deve lidar com usuário sem ID', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: { id: 0, nome: 'Usuário sem ID' } as any,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: mockSetCurrentTreino,
        clearUser: jest.fn(),
        clearTreino: mockClearTreino
      });

      renderHook(() => useTreinosPage());

      expect(mockGetTreinosByUser.getByUserId).toHaveBeenCalledWith(0);
    });

    it('deve lidar com treino sem nome', () => {
      const { result } = renderHook(() => useTreinosPage());
      const treinoWithoutName = { id: 999, nome: '', userId: 1 };

      act(() => {
        result.current.handleTreinoSelection(treinoWithoutName);
      });

      expect(mockSetCurrentTreino).toHaveBeenCalledWith(treinoWithoutName);
      expect(mockPush).toHaveBeenCalledWith('/exercicios');
    });
  });

  describe('integração entre métodos', () => {
    it('deve manter consistência entre treinos retornados e handleTreinoSelection', () => {
      const { result } = renderHook(() => useTreinosPage());

      // Verificar se os treinos retornados podem ser selecionados
      const firstTreino = result.current.treinos[0];

      act(() => {
        result.current.handleTreinoSelection(firstTreino);
      });

      expect(mockSetCurrentTreino).toHaveBeenCalledWith(firstTreino);
      expect(result.current.treinos).toContain(firstTreino);
    });

    it('deve buscar treinos do usuário correto', () => {
      const differentUser = { id: 2, nome: 'Maria Santos' };
      
      mockUseAppContext.mockReturnValue({
        currentUser: differentUser,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: mockSetCurrentTreino,
        clearUser: jest.fn(),
        clearTreino: mockClearTreino
      });

      renderHook(() => useTreinosPage());

      expect(mockGetTreinosByUser.getByUserId).toHaveBeenCalledWith(2);
    });

    it('deve executar clearTreino apenas uma vez no mount', () => {
      const { rerender } = renderHook(() => useTreinosPage());

      expect(mockClearTreino).toHaveBeenCalledTimes(1);

      // Rerender não deve chamar clearTreino novamente
      rerender();

      expect(mockClearTreino).toHaveBeenCalledTimes(1);
    });

    it('deve usar a mesma instância de router para navegação', () => {
      const { result } = renderHook(() => useTreinosPage());

      act(() => {
        result.current.handleTreinoSelection(mockTreinos[0]);
      });

      act(() => {
        result.current.handleTreinoSelection(mockTreinos[1]);
      });

      expect(mockUseRouter).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledTimes(2);
    });
  });

  describe('reatividade aos dados do usuário', () => {
    it('deve buscar treinos novamente quando usuário muda', () => {
      const { rerender } = renderHook(() => useTreinosPage());

      expect(mockGetTreinosByUser.getByUserId).toHaveBeenCalledWith(1);

      // Simular mudança de usuário
      const newUser = { id: 3, nome: 'Pedro Oliveira' };
      mockUseAppContext.mockReturnValue({
        currentUser: newUser,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: mockSetCurrentTreino,
        clearUser: jest.fn(),
        clearTreino: mockClearTreino
      });

      rerender();

      expect(mockGetTreinosByUser.getByUserId).toHaveBeenCalledWith(3);
    });

    it('deve retornar treinos vazios quando usuário é removido', () => {
      mockGetTreinosByUser.getByUserId.mockImplementation((userId) => {
        return userId === 0 ? [] : mockTreinos;
      });

      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: mockSetCurrentTreino,
        clearUser: jest.fn(),
        clearTreino: mockClearTreino
      });

      const { result } = renderHook(() => useTreinosPage());

      expect(result.current.treinos).toEqual([]);
    });
  });

  describe('dependências do useEffect', () => {
    it('deve ter array de dependências vazio', () => {
      // Este teste verifica indiretamente se o useEffect não é chamado novamente
      const { rerender } = renderHook(() => useTreinosPage());

      expect(mockClearTreino).toHaveBeenCalledTimes(1);

      // Simular múltiplos rerenders
      rerender();
      rerender();
      rerender();

      // clearTreino deve ter sido chamado apenas uma vez
      expect(mockClearTreino).toHaveBeenCalledTimes(1);
    });
  });
});