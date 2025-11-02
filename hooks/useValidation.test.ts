import { renderHook } from '@testing-library/react';
import { useValidation } from './useValidation';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { User } from '@/models/user';
import { Treino } from '@/models/treino';

// Mock dos módulos externos
jest.mock('next/navigation');
jest.mock('@/contexts/AppContext');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('useValidation', () => {
  const mockPush = jest.fn();
  
  // Mock data
  const mockUser: User = {
    id: 1,
    nome: 'João Silva'
  };

  const mockTreino: Treino = {
    id: 1,
    nome: 'Treino A',
    userId: 1
  };

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
      currentTreino: mockTreino,
      setCurrentUser: jest.fn(),
      setCurrentTreino: jest.fn(),
      clearUser: jest.fn(),
      clearTreino: jest.fn()
    });
  });

  describe('inicialização', () => {
    it('deve retornar as funções corretas', () => {
      const { result } = renderHook(() => useValidation());

      expect(result.current).toHaveProperty('userValidate');
      expect(result.current).toHaveProperty('treinoValidate');
      expect(typeof result.current.userValidate).toBe('function');
      expect(typeof result.current.treinoValidate).toBe('function');
    });

    it('deve usar router do Next.js', () => {
      renderHook(() => useValidation());

      expect(mockUseRouter).toHaveBeenCalled();
    });

    it('deve usar contexto da aplicação', () => {
      renderHook(() => useValidation());

      expect(mockUseAppContext).toHaveBeenCalled();
    });
  });

  describe('userValidate', () => {
    it('não deve redirecionar quando há usuário logado', () => {
      const { result } = renderHook(() => useValidation());

      result.current.userValidate();

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve redirecionar para home quando não há usuário logado', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: mockTreino,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.userValidate();

      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('deve redirecionar para home quando usuário é undefined', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: undefined as any,
        currentTreino: mockTreino,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.userValidate();

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('treinoValidate', () => {
    it('não deve redirecionar quando há treino selecionado', () => {
      const { result } = renderHook(() => useValidation());

      result.current.treinoValidate();

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve redirecionar para treinos quando não há treino selecionado', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: mockUser,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.treinoValidate();

      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });

    it('deve redirecionar para treinos quando treino é undefined', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: mockUser,
        currentTreino: undefined as any,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.treinoValidate();

      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com ambos user e treino nulos', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.userValidate();
      expect(mockPush).toHaveBeenCalledWith('/');

      mockPush.mockClear();

      result.current.treinoValidate();
      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });

    it('deve funcionar com múltiplas chamadas', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.userValidate();
      result.current.userValidate();
      result.current.treinoValidate();
      result.current.treinoValidate();

      expect(mockPush).toHaveBeenCalledTimes(4);
      expect(mockPush).toHaveBeenNthCalledWith(1, '/');
      expect(mockPush).toHaveBeenNthCalledWith(2, '/');
      expect(mockPush).toHaveBeenNthCalledWith(3, '/treinos');
      expect(mockPush).toHaveBeenNthCalledWith(4, '/treinos');
    });
  });

  describe('integração', () => {
    it('deve validar user e treino independentemente', () => {
      // User válido, treino nulo
      mockUseAppContext.mockReturnValue({
        currentUser: mockUser,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.userValidate();
      expect(mockPush).not.toHaveBeenCalled();

      result.current.treinoValidate();
      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });

    it('deve usar a mesma instância do router para ambas validações', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      const { result } = renderHook(() => useValidation());

      result.current.userValidate();
      result.current.treinoValidate();

      expect(mockUseRouter).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledTimes(2);
    });
  });
});