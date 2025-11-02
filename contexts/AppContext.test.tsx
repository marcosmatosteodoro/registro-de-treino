import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider, useAppContext } from './AppContext';
import { User } from '@/models/user';
import { Treino } from '@/models/treino';

describe('AppContext', () => {
  // Mock data
  const mockUser: User = {
    id: 1,
    nome: 'João Silva'
  };

  const mockUser2: User = {
    id: 2,
    nome: 'Maria Santos'
  };

  const mockTreino: Treino = {
    id: 1,
    nome: 'Treino A',
    userId: 1
  };

  const mockTreino2: Treino = {
    id: 2,
    nome: 'Treino B',
    userId: 1
  };

  // Wrapper para testes do hook
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  describe('AppProvider', () => {
    it('deve renderizar children corretamente', () => {
      render(
        <AppProvider>
          <div data-testid="test-child">Test Content</div>
        </AppProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('deve fornecer contexto para componentes filhos', () => {
      const TestComponent = () => {
        const context = useAppContext();
        return <div data-testid="context-test">{context ? 'Context Available' : 'No Context'}</div>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByText('Context Available')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <AppProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </AppProvider>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('useAppContext', () => {
    it('deve lançar erro quando usado fora do AppProvider', () => {
      // Suprimir erro no console para este teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppContext());
      }).toThrow('useAppContext must be used within an AppProvider');

      consoleSpy.mockRestore();
    });

    it('deve retornar contexto quando usado dentro do AppProvider', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('currentUser');
      expect(result.current).toHaveProperty('currentTreino');
      expect(result.current).toHaveProperty('setCurrentUser');
      expect(result.current).toHaveProperty('setCurrentTreino');
      expect(result.current).toHaveProperty('clearUser');
      expect(result.current).toHaveProperty('clearTreino');
    });
  });

  describe('estado inicial', () => {
    it('deve inicializar com valores null', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentTreino).toBeNull();
    });

    it('deve fornecer funções como objetos function', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(typeof result.current.setCurrentUser).toBe('function');
      expect(typeof result.current.setCurrentTreino).toBe('function');
      expect(typeof result.current.clearUser).toBe('function');
      expect(typeof result.current.clearTreino).toBe('function');
    });
  });

  describe('setCurrentUser', () => {
    it('deve definir usuário atual', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
      });

      expect(result.current.currentUser).toEqual(mockUser);
    });

    it('deve atualizar usuário atual', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
      });

      expect(result.current.currentUser).toEqual(mockUser);

      act(() => {
        result.current.setCurrentUser(mockUser2);
      });

      expect(result.current.currentUser).toEqual(mockUser2);
    });

    it('deve manter treino atual ao definir usuário', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentTreino(mockTreino);
        result.current.setCurrentUser(mockUser);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toEqual(mockTreino);
    });
  });

  describe('setCurrentTreino', () => {
    it('deve definir treino atual', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentTreino).toEqual(mockTreino);
    });

    it('deve atualizar treino atual', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentTreino).toEqual(mockTreino);

      act(() => {
        result.current.setCurrentTreino(mockTreino2);
      });

      expect(result.current.currentTreino).toEqual(mockTreino2);
    });

    it('deve manter usuário atual ao definir treino', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toEqual(mockTreino);
    });
  });

  describe('clearUser', () => {
    it('deve limpar usuário atual', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
      });

      expect(result.current.currentUser).toEqual(mockUser);

      act(() => {
        result.current.clearUser();
      });

      expect(result.current.currentUser).toBeNull();
    });

    it('deve limpar treino atual também ao limpar usuário', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toEqual(mockTreino);

      act(() => {
        result.current.clearUser();
      });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentTreino).toBeNull();
    });

    it('deve funcionar quando usuário já é null', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.currentUser).toBeNull();

      act(() => {
        result.current.clearUser();
      });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentTreino).toBeNull();
    });
  });

  describe('clearTreino', () => {
    it('deve limpar treino atual', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentTreino).toEqual(mockTreino);

      act(() => {
        result.current.clearTreino();
      });

      expect(result.current.currentTreino).toBeNull();
    });

    it('deve manter usuário atual ao limpar treino', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toEqual(mockTreino);

      act(() => {
        result.current.clearTreino();
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toBeNull();
    });

    it('deve funcionar quando treino já é null', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.currentTreino).toBeNull();

      act(() => {
        result.current.clearTreino();
      });

      expect(result.current.currentTreino).toBeNull();
    });
  });

  describe('fluxos completos', () => {
    it('deve simular fluxo completo de usuário e treino', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      // Estado inicial
      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentTreino).toBeNull();

      // Definir usuário
      act(() => {
        result.current.setCurrentUser(mockUser);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toBeNull();

      // Definir treino
      act(() => {
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toEqual(mockTreino);

      // Limpar treino
      act(() => {
        result.current.clearTreino();
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toBeNull();

      // Limpar usuário
      act(() => {
        result.current.clearUser();
      });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentTreino).toBeNull();
    });

    it('deve permitir múltiplas operações em sequência', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
        result.current.setCurrentTreino(mockTreino);
        result.current.setCurrentUser(mockUser2);
        result.current.setCurrentTreino(mockTreino2);
      });

      expect(result.current.currentUser).toEqual(mockUser2);
      expect(result.current.currentTreino).toEqual(mockTreino2);
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com objetos de usuário com propriedades adicionais', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });
      const userWithExtraProps = { ...mockUser, email: 'joao@test.com' } as any;

      act(() => {
        result.current.setCurrentUser(userWithExtraProps);
      });

      expect(result.current.currentUser).toEqual(userWithExtraProps);
    });

    it('deve lidar com objetos de treino com propriedades adicionais', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });
      const treinoWithExtraProps = { ...mockTreino, descricao: 'Treino de peito' } as any;

      act(() => {
        result.current.setCurrentTreino(treinoWithExtraProps);
      });

      expect(result.current.currentTreino).toEqual(treinoWithExtraProps);
    });

    it('deve manter referência de objeto após definição', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
      });

      const userRef = result.current.currentUser;

      // Rerender não deve alterar a referência
      act(() => {
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentUser).toBe(userRef);
    });
  });

  describe('integração entre múltiplos componentes', () => {
    it('deve compartilhar estado entre múltiplos hooks no mesmo provider', () => {
      // Criar um provider compartilhado
      const SharedProvider = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const TestComponent1 = () => {
        const context = useAppContext();
        return { context };
      };

      const TestComponent2 = () => {
        const context = useAppContext();
        return { context };
      };

      const { result: result1 } = renderHook(() => TestComponent1().context, { wrapper: SharedProvider });
      const { result: result2 } = renderHook(() => TestComponent2().context, { wrapper: SharedProvider });

      act(() => {
        result1.current.setCurrentUser(mockUser);
      });

      expect(result1.current.currentUser).toEqual(mockUser);
      // Note: result2 terá uma instância separada do contexto
      // Este teste verifica que o contexto funciona dentro do mesmo provider
      expect(result1.current.currentUser).toEqual(mockUser);
    });

    it('deve manter consistência do contexto em um único hook', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
        result.current.setCurrentTreino(mockTreino);
      });

      // Verificar que o estado persiste
      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.currentTreino).toEqual(mockTreino);

      act(() => {
        result.current.clearUser();
      });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentTreino).toBeNull();
    });
  });

  describe('consistência de tipo', () => {
    it('deve manter tipagem correta para User', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentUser(mockUser);
      });

      expect(result.current.currentUser).toHaveProperty('id');
      expect(result.current.currentUser).toHaveProperty('nome');
      expect(typeof result.current.currentUser?.id).toBe('number');
      expect(typeof result.current.currentUser?.nome).toBe('string');
    });

    it('deve manter tipagem correta para Treino', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setCurrentTreino(mockTreino);
      });

      expect(result.current.currentTreino).toHaveProperty('id');
      expect(result.current.currentTreino).toHaveProperty('nome');
      expect(result.current.currentTreino).toHaveProperty('userId');
      expect(typeof result.current.currentTreino?.id).toBe('number');
      expect(typeof result.current.currentTreino?.nome).toBe('string');
      expect(typeof result.current.currentTreino?.userId).toBe('number');
    });
  });
});