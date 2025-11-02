import { renderHook, act } from '@testing-library/react';
import { useHomePage } from './useHomePage';
import { useRouter } from 'next/navigation';
import { GetUsers } from '@/services/getUsers';
import { useAppContext } from '@/contexts/AppContext';
import { User, IUser } from '@/models/user';

// Mock dos módulos externos
jest.mock('next/navigation');
jest.mock('@/services/getUsers');
jest.mock('@/contexts/AppContext');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockGetUsers = GetUsers as jest.Mocked<typeof GetUsers>;
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('useHomePage', () => {
  const mockPush = jest.fn();
  const mockSetCurrentUser = jest.fn();
  const mockClearUser = jest.fn();
  
  // Mock data
  const mockUsers: IUser[] = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Santos' },
    { id: 3, nome: 'Pedro Oliveira' }
  ];

  // Console.log spy
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup console spy
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Setup mocks default
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn()
    } as any);
    
    mockGetUsers.getAll.mockReturnValue(mockUsers);
    
    mockUseAppContext.mockReturnValue({
      currentUser: null,
      currentTreino: null,
      setCurrentUser: mockSetCurrentUser,
      setCurrentTreino: jest.fn(),
      clearUser: mockClearUser,
      clearTreino: jest.fn()
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('inicialização', () => {
    it('deve retornar as propriedades corretas', () => {
      const { result } = renderHook(() => useHomePage());

      expect(result.current).toHaveProperty('users');
      expect(result.current).toHaveProperty('handleUserSelection');
      expect(typeof result.current.handleUserSelection).toBe('function');
    });

    it('deve buscar todos os usuários', () => {
      const { result } = renderHook(() => useHomePage());

      expect(mockGetUsers.getAll).toHaveBeenCalled();
      expect(result.current.users).toBe(mockUsers);
    });

    it('deve limpar usuário atual no useEffect', () => {
      renderHook(() => useHomePage());

      expect(mockClearUser).toHaveBeenCalled();
    });

    it('deve usar router do Next.js', () => {
      renderHook(() => useHomePage());

      expect(mockUseRouter).toHaveBeenCalled();
    });

    it('deve usar contexto da aplicação', () => {
      renderHook(() => useHomePage());

      expect(mockUseAppContext).toHaveBeenCalled();
    });
  });

  describe('handleUserSelection', () => {
    it('deve definir usuário atual quando usuário válido é selecionado', () => {
      const { result } = renderHook(() => useHomePage());
      const selectedUser = mockUsers[0];

      act(() => {
        result.current.handleUserSelection(selectedUser);
      });

      expect(mockSetCurrentUser).toHaveBeenCalledWith(selectedUser);
    });

    it('deve logar nome do usuário selecionado', () => {
      const { result } = renderHook(() => useHomePage());
      const selectedUser = mockUsers[1];

      act(() => {
        result.current.handleUserSelection(selectedUser);
      });

      expect(consoleSpy).toHaveBeenCalledWith(`Usuário selecionado: ${selectedUser.nome}`);
    });

    it('deve navegar para página de treinos após seleção', () => {
      const { result } = renderHook(() => useHomePage());
      const selectedUser = mockUsers[2];

      act(() => {
        result.current.handleUserSelection(selectedUser);
      });

      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });

    it('deve executar todas as ações em sequência', () => {
      const { result } = renderHook(() => useHomePage());
      const selectedUser = mockUsers[0];

      act(() => {
        result.current.handleUserSelection(selectedUser);
      });

      expect(mockSetCurrentUser).toHaveBeenCalledWith(selectedUser);
      expect(consoleSpy).toHaveBeenCalledWith(`Usuário selecionado: ${selectedUser.nome}`);
      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });

    it('deve funcionar com diferentes usuários', () => {
      const { result } = renderHook(() => useHomePage());

      // Selecionar primeiro usuário
      act(() => {
        result.current.handleUserSelection(mockUsers[0]);
      });

      expect(mockSetCurrentUser).toHaveBeenCalledWith(mockUsers[0]);
      expect(consoleSpy).toHaveBeenCalledWith(`Usuário selecionado: ${mockUsers[0].nome}`);

      // Limpar mocks
      mockSetCurrentUser.mockClear();
      consoleSpy.mockClear();
      mockPush.mockClear();

      // Selecionar segundo usuário
      act(() => {
        result.current.handleUserSelection(mockUsers[1]);
      });

      expect(mockSetCurrentUser).toHaveBeenCalledWith(mockUsers[1]);
      expect(consoleSpy).toHaveBeenCalledWith(`Usuário selecionado: ${mockUsers[1].nome}`);
      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });
  });

  describe('casos extremos', () => {
    it('não deve executar ações quando usuário é null', () => {
      const { result } = renderHook(() => useHomePage());

      act(() => {
        result.current.handleUserSelection(null as any);
      });

      expect(mockSetCurrentUser).not.toHaveBeenCalled();
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('não deve executar ações quando usuário é undefined', () => {
      const { result } = renderHook(() => useHomePage());

      act(() => {
        result.current.handleUserSelection(undefined as any);
      });

      expect(mockSetCurrentUser).not.toHaveBeenCalled();
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve lidar com lista de usuários vazia', () => {
      mockGetUsers.getAll.mockReturnValue([]);

      const { result } = renderHook(() => useHomePage());

      expect(result.current.users).toEqual([]);
      expect(mockClearUser).toHaveBeenCalled();
    });

    it('deve lidar com usuário sem nome', () => {
      const { result } = renderHook(() => useHomePage());
      const userWithoutName = { id: 999, nome: '' };

      act(() => {
        result.current.handleUserSelection(userWithoutName);
      });

      expect(mockSetCurrentUser).toHaveBeenCalledWith(userWithoutName);
      expect(consoleSpy).toHaveBeenCalledWith('Usuário selecionado: ');
      expect(mockPush).toHaveBeenCalledWith('/treinos');
    });
  });

  describe('integração entre métodos', () => {
    it('deve manter consistência entre users retornados e handleUserSelection', () => {
      const { result } = renderHook(() => useHomePage());

      // Verificar se os usuários retornados podem ser selecionados
      const firstUser = result.current.users[0];

      act(() => {
        result.current.handleUserSelection(firstUser);
      });

      expect(mockSetCurrentUser).toHaveBeenCalledWith(firstUser);
      expect(result.current.users).toContain(firstUser);
    });

    it('deve executar clearUser apenas uma vez no mount', () => {
      const { rerender } = renderHook(() => useHomePage());

      expect(mockClearUser).toHaveBeenCalledTimes(1);

      // Rerender não deve chamar clearUser novamente
      rerender();

      expect(mockClearUser).toHaveBeenCalledTimes(1);
    });

    it('deve usar a mesma instância de router para navegação', () => {
      const { result } = renderHook(() => useHomePage());

      act(() => {
        result.current.handleUserSelection(mockUsers[0]);
      });

      act(() => {
        result.current.handleUserSelection(mockUsers[1]);
      });

      expect(mockUseRouter).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledTimes(2);
    });
  });

  describe('dependências do useEffect', () => {
    it('deve ter array de dependências vazio', () => {
      // Este teste verifica indiretamente se o useEffect não é chamado novamente
      const { rerender } = renderHook(() => useHomePage());

      expect(mockClearUser).toHaveBeenCalledTimes(1);

      // Simular múltiplos rerenders
      rerender();
      rerender();
      rerender();

      // clearUser deve ter sido chamado apenas uma vez
      expect(mockClearUser).toHaveBeenCalledTimes(1);
    });
  });
});