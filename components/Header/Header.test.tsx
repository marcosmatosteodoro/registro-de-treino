import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './index';
import { useAppContext } from '@/contexts/AppContext';
import { User } from '@/models/user';

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock do contexto da aplicação
jest.mock('@/contexts/AppContext');

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('Header', () => {
  // Mock data
  const mockUser: User = {
    id: 1,
    nome: 'João Silva'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock padrão
    mockUseAppContext.mockReturnValue({
      currentUser: mockUser,
      currentTreino: null,
      setCurrentUser: jest.fn(),
      setCurrentTreino: jest.fn(),
      clearUser: jest.fn(),
      clearTreino: jest.fn()
    });
  });

  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByTestId('header');
      expect(headerElement).toBeInTheDocument();
    });

    it('deve renderizar como elemento header', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByTestId('header');
      expect(headerElement.tagName).toBe('HEADER');
    });

    it('deve ter as classes CSS corretas', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByTestId('header');
      expect(headerElement).toHaveClass('flex');
      expect(headerElement).toHaveClass('items-center');
      expect(headerElement).toHaveClass('justify-between');
      expect(headerElement).toHaveClass('p-4');
    });

    it('deve ter todas as classes CSS em conjunto', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByTestId('header');
      expect(headerElement).toHaveClass('flex items-center justify-between p-4');
    });
  });

  describe('link de voltar', () => {
    it('deve renderizar o link de voltar', () => {
      render(<Header backRoute="/treinos" />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toBeInTheDocument();
    });

    it('deve ter o href correto', () => {
      const backRoute = '/treinos';
      render(<Header backRoute={backRoute} />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveAttribute('href', backRoute);
    });

    it('deve ter as classes CSS corretas do link', () => {
      render(<Header backRoute="/home" />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveClass('flex');
      expect(backLink).toHaveClass('items-center');
      expect(backLink).toHaveClass('text-gray-400');
      expect(backLink).toHaveClass('hover:text-white');
      expect(backLink).toHaveClass('transition-colors');
      expect(backLink).toHaveClass('cursor-pointer');
    });

    it('deve renderizar o ícone de voltar', () => {
      render(<Header backRoute="/home" />);

      const backIcon = screen.getByTestId('back-icon');
      expect(backIcon).toBeInTheDocument();
      expect(backIcon.tagName).toBe('svg');
    });

    it('deve ter as propriedades corretas do ícone SVG', () => {
      render(<Header backRoute="/home" />);

      const backIcon = screen.getByTestId('back-icon');
      expect(backIcon).toHaveClass('w-6 h-6');
      expect(backIcon).toHaveAttribute('fill', 'none');
      expect(backIcon).toHaveAttribute('stroke', 'currentColor');
      expect(backIcon).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('deve ter o path do ícone correto', () => {
      render(<Header backRoute="/home" />);

      const backIcon = screen.getByTestId('back-icon');
      const pathElement = backIcon.querySelector('path');
      
      expect(pathElement).toBeInTheDocument();
      expect(pathElement).toHaveAttribute('stroke-linecap', 'round');
      expect(pathElement).toHaveAttribute('stroke-linejoin', 'round');
      expect(pathElement).toHaveAttribute('stroke-width', '2');
      expect(pathElement).toHaveAttribute('d', 'M15 19l-7-7 7-7');
    });
  });

  describe('nome do usuário', () => {
    it('deve renderizar o nome do usuário atual', () => {
      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toBeInTheDocument();
      expect(userName).toHaveTextContent('João Silva');
    });

    it('deve ter as classes CSS corretas do nome', () => {
      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveClass('text-gray-400');
      expect(userName).toHaveClass('text-lg');
      expect(userName).toHaveClass('font-medium');
    });

    it('deve renderizar "Usuário" quando não há usuário atual', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: null,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('Usuário');
    });

    it('deve renderizar "Usuário" quando usuário é undefined', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: undefined as any,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('Usuário');
    });

    it('deve renderizar nome de usuário diferente', () => {
      const differentUser: User = {
        id: 2,
        nome: 'Maria Santos'
      };

      mockUseAppContext.mockReturnValue({
        currentUser: differentUser,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('Maria Santos');
    });
  });

  describe('propriedades e navegação', () => {
    it('deve funcionar com diferentes rotas de volta', () => {
      const routes = ['/home', '/treinos', '/exercicios', '/'];
      
      routes.forEach(route => {
        const { unmount } = render(<Header backRoute={route} />);
        
        const backLink = screen.getByTestId('back-link');
        expect(backLink).toHaveAttribute('href', route);
        
        unmount();
      });
    });

    it('deve funcionar com rotas complexas', () => {
      const complexRoute = '/treinos/123/exercicios';
      render(<Header backRoute={complexRoute} />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveAttribute('href', complexRoute);
    });

    it('deve funcionar com query parameters', () => {
      const routeWithQuery = '/treinos?user=1';
      render(<Header backRoute={routeWithQuery} />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveAttribute('href', routeWithQuery);
    });

    it('deve funcionar com fragmentos', () => {
      const routeWithFragment = '/treinos#section';
      render(<Header backRoute={routeWithFragment} />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveAttribute('href', routeWithFragment);
    });
  });

  describe('casos especiais', () => {
    it('deve lidar com nome de usuário vazio', () => {
      const userWithEmptyName: User = {
        id: 3,
        nome: ''
      };

      mockUseAppContext.mockReturnValue({
        currentUser: userWithEmptyName,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('Usuário');
    });

    it('deve lidar com nomes de usuário longos', () => {
      const userWithLongName: User = {
        id: 4,
        nome: 'João Pedro da Silva Santos Oliveira'
      };

      mockUseAppContext.mockReturnValue({
        currentUser: userWithLongName,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('João Pedro da Silva Santos Oliveira');
    });

    it('deve lidar com caracteres especiais no nome', () => {
      const userWithSpecialChars: User = {
        id: 5,
        nome: 'José da Silva Jr.'
      };

      mockUseAppContext.mockReturnValue({
        currentUser: userWithSpecialChars,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('José da Silva Jr.');
    });

    it('deve lidar com rota vazia', () => {
      render(<Header backRoute="" />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveAttribute('href', '');
    });
  });

  describe('acessibilidade', () => {
    it('deve ter estrutura semântica correta', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByRole('banner');
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toBe(screen.getByTestId('header'));
    });

    it('deve ter link acessível', () => {
      render(<Header backRoute="/treinos" />);

      const backLink = screen.getByRole('link');
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/treinos');
    });

    it('deve ser navegável por teclado', () => {
      render(<Header backRoute="/home" />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveClass('cursor-pointer');
      // Link é naturalmente focável
      expect(backLink.tagName).toBe('A');
    });
  });

  describe('integração com contexto', () => {
    it('deve usar o contexto da aplicação', () => {
      render(<Header backRoute="/home" />);

      expect(mockUseAppContext).toHaveBeenCalled();
    });

    it('deve reagir a mudanças no usuário atual', () => {
      const { rerender } = render(<Header backRoute="/home" />);

      let userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('João Silva');

      // Simular mudança de usuário
      const newUser: User = {
        id: 2,
        nome: 'Pedro Oliveira'
      };

      mockUseAppContext.mockReturnValue({
        currentUser: newUser,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      rerender(<Header backRoute="/home" />);

      userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('Pedro Oliveira');
    });

    it('não deve quebrar quando contexto retorna valores inesperados', () => {
      mockUseAppContext.mockReturnValue({
        currentUser: { id: 999, nome: null } as any,
        currentTreino: null,
        setCurrentUser: jest.fn(),
        setCurrentTreino: jest.fn(),
        clearUser: jest.fn(),
        clearTreino: jest.fn()
      });

      render(<Header backRoute="/home" />);

      const userName = screen.getByTestId('user-name');
      expect(userName).toHaveTextContent('Usuário');
    });
  });

  describe('casos de uso reais', () => {
    it('deve funcionar na página de treinos', () => {
      render(<Header backRoute="/" />);

      expect(screen.getByTestId('back-link')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('user-name')).toHaveTextContent('João Silva');
    });

    it('deve funcionar na página de exercícios', () => {
      render(<Header backRoute="/treinos" />);

      expect(screen.getByTestId('back-link')).toHaveAttribute('href', '/treinos');
      expect(screen.getByTestId('user-name')).toHaveTextContent('João Silva');
    });

    it('deve mostrar nome do usuário correto em todas as páginas', () => {
      const pages = [
        { route: '/', user: 'João Silva' },
        { route: '/treinos', user: 'João Silva' },
        { route: '/exercicios', user: 'João Silva' }
      ];

      pages.forEach(({ route, user }) => {
        const { unmount } = render(<Header backRoute={route} />);
        
        expect(screen.getByTestId('user-name')).toHaveTextContent(user);
        
        unmount();
      });
    });
  });

  describe('propriedades HTML', () => {
    it('deve ter data-testids corretos', () => {
      render(<Header backRoute="/home" />);

      expect(screen.getByTestId('header')).toHaveAttribute('data-testid', 'header');
      expect(screen.getByTestId('back-link')).toHaveAttribute('data-testid', 'back-link');
      expect(screen.getByTestId('back-icon')).toHaveAttribute('data-testid', 'back-icon');
      expect(screen.getByTestId('user-name')).toHaveAttribute('data-testid', 'user-name');
    });

    it('deve manter estrutura DOM consistente', () => {
      render(<Header backRoute="/home" />);

      const header = screen.getByTestId('header');
      const backLink = screen.getByTestId('back-link');
      const userName = screen.getByTestId('user-name');

      expect(header).toContainElement(backLink);
      expect(header).toContainElement(userName);
      expect(backLink).toContainElement(screen.getByTestId('back-icon'));
    });
  });

  describe('estilos e layout', () => {
    it('deve ter layout flexbox correto', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByTestId('header');
      expect(headerElement).toHaveClass('flex');
      expect(headerElement).toHaveClass('items-center');
      expect(headerElement).toHaveClass('justify-between');
    });

    it('deve ter espaçamento correto', () => {
      render(<Header backRoute="/home" />);

      const headerElement = screen.getByTestId('header');
      expect(headerElement).toHaveClass('p-4');
    });

    it('deve ter estilos de hover no link', () => {
      render(<Header backRoute="/home" />);

      const backLink = screen.getByTestId('back-link');
      expect(backLink).toHaveClass('hover:text-white');
      expect(backLink).toHaveClass('transition-colors');
    });

    it('deve ter cores consistentes', () => {
      render(<Header backRoute="/home" />);

      const backLink = screen.getByTestId('back-link');
      const userName = screen.getByTestId('user-name');

      expect(backLink).toHaveClass('text-gray-400');
      expect(userName).toHaveClass('text-gray-400');
    });
  });
});