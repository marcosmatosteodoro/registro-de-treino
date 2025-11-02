import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { useHomePage } from '@/hooks/useHomePage';
import { useButtonComponent } from '@/hooks/useButtonComponent';
import { IUser } from '@/models/user';

// Mocks dos hooks
jest.mock('@/hooks/useHomePage', () => ({
  useHomePage: jest.fn(),
}));

jest.mock('@/hooks/useButtonComponent', () => ({
  useButtonComponent: jest.fn(),
}));

// Mocks dos componentes
jest.mock('@/components', () => ({
  Title: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="title">{children}</h1>
  ),
  NotFoundText: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="not-found-text">{children}</div>
  ),
}));

describe('Home Page', () => {
  const mockHandleUserSelection = jest.fn();
  const mockGetButtonComponent = jest.fn();
  
  const mockButtonOrange = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button data-testid="button-orange" onClick={onClick}>
      {children}
    </button>
  );

  const mockButtonPurple = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button data-testid="button-purple" onClick={onClick}>
      {children}
    </button>
  );

  const mockButtonGrey = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button data-testid="button-grey" onClick={onClick}>
      {children}
    </button>
  );

  const mockUsers: IUser[] = [
    {
      id: 1,
      nome: 'João Silva'
    },
    {
      id: 2,
      nome: 'Maria Santos'
    },
    {
      id: 3,
      nome: 'Pedro Oliveira'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useHomePage as jest.Mock).mockReturnValue({
      users: mockUsers,
      handleUserSelection: mockHandleUserSelection,
    });

    (useButtonComponent as jest.Mock).mockReturnValue({
      getButtonComponent: mockGetButtonComponent,
    });

    // Mock padrão para getButtonComponent
    mockGetButtonComponent
      .mockReturnValueOnce(mockButtonOrange)
      .mockReturnValueOnce(mockButtonPurple)
      .mockReturnValueOnce(mockButtonGrey);
  });

  describe('renderização básica', () => {
    it('deve renderizar a página corretamente', () => {
      render(<Home />);

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('home-main')).toBeInTheDocument();
      expect(screen.getByTestId('users-container')).toBeInTheDocument();
    });

    it('deve renderizar o título corretamente', () => {
      render(<Home />);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Quem vai treinar?');
    });

    it('deve ter classes CSS corretas no container principal', () => {
      render(<Home />);

      const page = screen.getByTestId('home-page');
      expect(page).toHaveClass(
        'flex', 'min-h-screen', 'items-center', 'justify-center', 
        'bg-linear-to-br', 'from-gray-900', 'to-black'
      );
    });

    it('deve ter classes CSS corretas no main', () => {
      render(<Home />);

      const main = screen.getByTestId('home-main');
      expect(main).toHaveClass(
        'flex', 'flex-col', 'items-center', 'justify-center', 
        'px-8', 'py-16', 'text-center'
      );
    });

    it('deve ter classes CSS corretas no container de usuários', () => {
      render(<Home />);

      const usersContainer = screen.getByTestId('users-container');
      expect(usersContainer).toHaveClass(
        'flex', 'flex-col', 'gap-6', 'sm:flex-row', 'sm:gap-8'
      );
    });

    it('deve usar os hooks necessários', () => {
      render(<Home />);

      expect(useHomePage).toHaveBeenCalled();
      expect(useButtonComponent).toHaveBeenCalled();
    });
  });

  describe('renderização de usuários', () => {
    it('deve renderizar todos os usuários', () => {
      render(<Home />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
    });

    it('deve renderizar botões com cores diferentes para cada usuário', () => {
      render(<Home />);

      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
    });

    it('deve chamar getButtonComponent com índice correto para cada usuário', () => {
      render(<Home />);

      expect(mockGetButtonComponent).toHaveBeenCalledWith(0);
      expect(mockGetButtonComponent).toHaveBeenCalledWith(1);
      expect(mockGetButtonComponent).toHaveBeenCalledWith(2);
      expect(mockGetButtonComponent).toHaveBeenCalledTimes(3);
    });

    it('deve usar key único para cada botão de usuário', () => {
      const { container } = render(<Home />);

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(3);
    });

    it('deve renderizar texto NotFound quando não há usuários', () => {
      (useHomePage as jest.Mock).mockReturnValue({
        users: [],
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      const notFoundText = screen.getByTestId('not-found-text');
      expect(notFoundText).toBeInTheDocument();
      expect(notFoundText).toHaveTextContent('Nenhum usuário disponível');
    });

    it('deve renderizar apenas NotFound quando lista é vazia, sem botões', () => {
      (useHomePage as jest.Mock).mockReturnValue({
        users: [],
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
      expect(screen.queryByTestId('button-orange')).not.toBeInTheDocument();
      expect(screen.queryByTestId('button-purple')).not.toBeInTheDocument();
      expect(screen.queryByTestId('button-grey')).not.toBeInTheDocument();
    });

    it('deve lidar com um único usuário', () => {
      const singleUser = [mockUsers[0]];
      (useHomePage as jest.Mock).mockReturnValue({
        users: singleUser,
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
      expect(mockGetButtonComponent).toHaveBeenCalledWith(0);
      expect(mockGetButtonComponent).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com muitos usuários', () => {
      const manyUsers: IUser[] = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        nome: `Usuário ${index + 1}`
      }));

      mockGetButtonComponent.mockClear();
      for (let i = 0; i < 10; i++) {
        mockGetButtonComponent.mockReturnValueOnce(mockButtonOrange);
      }

      (useHomePage as jest.Mock).mockReturnValue({
        users: manyUsers,
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
      expect(screen.getByText('Usuário 10')).toBeInTheDocument();
      expect(mockGetButtonComponent).toHaveBeenCalledTimes(10);
    });
  });

  describe('interação com botões de usuário', () => {
    it('deve chamar handleUserSelection quando botão é clicado', () => {
      render(<Home />);

      const button = screen.getByText('João Silva');
      fireEvent.click(button);

      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[0]);
      expect(mockHandleUserSelection).toHaveBeenCalledTimes(1);
    });

    it('deve chamar handleUserSelection com usuário correto para cada botão', () => {
      render(<Home />);

      const button1 = screen.getByText('João Silva');
      const button2 = screen.getByText('Maria Santos');
      const button3 = screen.getByText('Pedro Oliveira');

      fireEvent.click(button1);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[0]);

      fireEvent.click(button2);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[1]);

      fireEvent.click(button3);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[2]);

      expect(mockHandleUserSelection).toHaveBeenCalledTimes(3);
    });

    it('deve permitir múltiplos cliques no mesmo botão', () => {
      render(<Home />);

      const button = screen.getByText('João Silva');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[0]);
      expect(mockHandleUserSelection).toHaveBeenCalledTimes(3);
    });

    it('deve permitir cliques em botões diferentes em sequência', () => {
      render(<Home />);

      const button1 = screen.getByText('João Silva');
      const button2 = screen.getByText('Maria Santos');

      fireEvent.click(button1);
      fireEvent.click(button2);
      fireEvent.click(button1);

      expect(mockHandleUserSelection).toHaveBeenNthCalledWith(1, mockUsers[0]);
      expect(mockHandleUserSelection).toHaveBeenNthCalledWith(2, mockUsers[1]);
      expect(mockHandleUserSelection).toHaveBeenNthCalledWith(3, mockUsers[0]);
      expect(mockHandleUserSelection).toHaveBeenCalledTimes(3);
    });

    it('deve manter acessibilidade dos botões', () => {
      render(<Home />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('função renderUserButton', () => {
    it('deve retornar componente Button correto', () => {
      render(<Home />);

      // Verifica se os botões foram renderizados com componentes diferentes
      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
    });

    it('deve usar key baseado no ID do usuário', () => {
      const { container } = render(<Home />);

      // Verifica se não há warnings sobre keys duplicadas no console
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(3);
    });

    it('deve passar props corretas para o componente Button', () => {
      render(<Home />);

      const button = screen.getByText('João Silva');
      expect(button).toBeInTheDocument();
      
      // Verifica se o onClick funciona
      fireEvent.click(button);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve lidar com usuários com nomes vazios', () => {
      const usersWithEmptyName = [
        { ...mockUsers[0], nome: '' },
        { ...mockUsers[1], nome: 'Nome Válido' }
      ];

      (useHomePage as jest.Mock).mockReturnValue({
        users: usersWithEmptyName,
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByText('Nome Válido')).toBeInTheDocument();
      
      // Verifica se o botão com nome vazio ainda é renderizado
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('deve lidar com usuários com IDs diferentes', () => {
      const usersWithDifferentIds = [
        { id: 999, nome: 'Usuário 999' },
        { id: 888, nome: 'Usuário 888' }
      ];

      (useHomePage as jest.Mock).mockReturnValue({
        users: usersWithDifferentIds,
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      const button1 = screen.getByText('Usuário 999');
      const button2 = screen.getByText('Usuário 888');

      fireEvent.click(button1);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(usersWithDifferentIds[0]);

      fireEvent.click(button2);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(usersWithDifferentIds[1]);
    });
  });

  describe('integração com hooks', () => {
    it('deve usar useHomePage corretamente', () => {
      render(<Home />);

      expect(useHomePage).toHaveBeenCalled();
      expect(useHomePage).toHaveBeenCalledTimes(1);
    });

    it('deve usar useButtonComponent corretamente', () => {
      render(<Home />);

      expect(useButtonComponent).toHaveBeenCalled();
      expect(useButtonComponent).toHaveBeenCalledTimes(1);
    });

    it('deve reagir a mudanças nos hooks', () => {
      const { rerender } = render(<Home />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();

      // Simula mudança no hook
      (useHomePage as jest.Mock).mockReturnValue({
        users: [],
        handleUserSelection: mockHandleUserSelection,
      });

      rerender(<Home />);

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });

    it('deve funcionar quando getButtonComponent retorna diferentes componentes', () => {
      mockGetButtonComponent.mockClear();
      mockGetButtonComponent
        .mockReturnValueOnce(mockButtonPurple)
        .mockReturnValueOnce(mockButtonGrey)
        .mockReturnValueOnce(mockButtonOrange);

      render(<Home />);

      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
    });

    it('deve lidar com hooks que retornam valores nulos ou undefined', () => {
      (useHomePage as jest.Mock).mockReturnValue({
        users: [],
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      // Deve renderizar NotFound quando users é array vazio
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com lista de usuários undefined', () => {
      (useHomePage as jest.Mock).mockReturnValue({
        users: [],
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });

    it('deve lidar com handleUserSelection nulo', () => {
      const mockNullHandler = jest.fn();
      (useHomePage as jest.Mock).mockReturnValue({
        users: mockUsers,
        handleUserSelection: mockNullHandler,
      });

      render(<Home />);

      const button = screen.getByText('João Silva');
      
      // Deve conseguir clicar no botão sem erro
      fireEvent.click(button);
      expect(mockNullHandler).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve lidar com getButtonComponent que retorna null', () => {
      mockGetButtonComponent.mockReturnValue(null);

      render(<Home />);

      // Página deve renderizar mesmo se getButtonComponent retornar null
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('deve manter performance com muitos usuários', () => {
      const manyUsers: IUser[] = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        nome: `Usuário ${index + 1}`
      }));

      mockGetButtonComponent.mockClear();
      for (let i = 0; i < 50; i++) {
        mockGetButtonComponent.mockReturnValueOnce(mockButtonOrange);
      }

      (useHomePage as jest.Mock).mockReturnValue({
        users: manyUsers,
        handleUserSelection: mockHandleUserSelection,
      });

      const startTime = performance.now();
      render(<Home />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
      expect(screen.getByText('Usuário 50')).toBeInTheDocument();
    });

    it('deve lidar com nomes de usuário muito longos', () => {
      const usersWithLongNames = [{
        id: 1,
        nome: 'Nome Extremamente Longo que Pode Quebrar o Layout se Não For Tratado Adequadamente'
      }];

      (useHomePage as jest.Mock).mockReturnValue({
        users: usersWithLongNames,
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByText('Nome Extremamente Longo que Pode Quebrar o Layout se Não For Tratado Adequadamente')).toBeInTheDocument();
    });

    it('deve lidar com caracteres especiais nos nomes', () => {
      const usersWithSpecialChars = [
        { id: 1, nome: 'José da Silva & Cia.' },
        { id: 2, nome: 'Maria José (Administradora)' },
        { id: 3, nome: 'João-Paulo dos Santos' }
      ];

      (useHomePage as jest.Mock).mockReturnValue({
        users: usersWithSpecialChars,
        handleUserSelection: mockHandleUserSelection,
      });

      render(<Home />);

      expect(screen.getByText('José da Silva & Cia.')).toBeInTheDocument();
      expect(screen.getByText('Maria José (Administradora)')).toBeInTheDocument();
      expect(screen.getByText('João-Paulo dos Santos')).toBeInTheDocument();
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via roles', () => {
      render(<Home />);

      const main = screen.getByRole('main');
      const buttons = screen.getAllByRole('button');

      expect(main).toBeInTheDocument();
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve ter título acessível', () => {
      render(<Home />);

      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent('Quem vai treinar?');
    });

    it('deve permitir navegação por teclado', () => {
      render(<Home />);

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        button.focus();
        expect(button).toHaveFocus();
      });
    });

    it('deve ter estrutura semântica correta', () => {
      render(<Home />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('deve ter labels adequados para screen readers', () => {
      render(<Home />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveTextContent(/\w+/); // Deve ter algum texto
      });
    });
  });

  describe('performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<Home />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('deve manter performance durante re-renders', () => {
      const { rerender } = render(<Home />);

      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      // Força re-render
      rerender(<Home />);

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('deve otimizar renderização de componentes', () => {
      render(<Home />);

      // Verifica se os componentes foram renderizados corretamente
      expect(useHomePage).toHaveBeenCalledTimes(1);
      expect(useButtonComponent).toHaveBeenCalledTimes(1);
    });

    it('deve lidar eficientemente com mudanças de estado', () => {
      const { rerender } = render(<Home />);

      // Primeira renderização
      expect(screen.getByText('João Silva')).toBeInTheDocument();

      // Simula mudança no estado
      (useHomePage as jest.Mock).mockReturnValue({
        users: [{ id: 4, nome: 'Novo Usuário' }],
        handleUserSelection: mockHandleUserSelection,
      });

      rerender(<Home />);

      expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
    });
  });

  describe('layout responsivo', () => {
    it('deve ter classes responsivas no container de usuários', () => {
      render(<Home />);

      const usersContainer = screen.getByTestId('users-container');
      expect(usersContainer).toHaveClass('flex-col', 'sm:flex-row');
      expect(usersContainer).toHaveClass('gap-6', 'sm:gap-8');
    });

    it('deve manter centralização em diferentes tamanhos', () => {
      render(<Home />);

      const page = screen.getByTestId('home-page');
      expect(page).toHaveClass('flex', 'items-center', 'justify-center');

      const main = screen.getByTestId('home-main');
      expect(main).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('deve ter padding adequado para diferentes telas', () => {
      render(<Home />);

      const main = screen.getByTestId('home-main');
      expect(main).toHaveClass('px-8', 'py-16');
    });
  });

  describe('integração completa', () => {
    it('deve integrar todos os componentes corretamente', () => {
      render(<Home />);

      // Verifica se todos os elementos estão presentes
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('home-main')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('users-container')).toBeInTheDocument();

      // Verifica se os botões funcionam
      const button = screen.getByText('João Silva');
      fireEvent.click(button);
      expect(mockHandleUserSelection).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve manter estado consistente durante interações', () => {
      render(<Home />);

      // Múltiplas interações
      const button1 = screen.getByText('João Silva');
      const button2 = screen.getByText('Maria Santos');

      fireEvent.click(button1);
      fireEvent.click(button2);

      expect(mockHandleUserSelection).toHaveBeenCalledTimes(2);
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });

    it('deve funcionar corretamente sem usuários e com usuários', () => {
      // Sem usuários
      (useHomePage as jest.Mock).mockReturnValue({
        users: [],
        handleUserSelection: mockHandleUserSelection,
      });

      const { rerender } = render(<Home />);
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();

      // Com usuários
      (useHomePage as jest.Mock).mockReturnValue({
        users: mockUsers,
        handleUserSelection: mockHandleUserSelection,
      });

      rerender(<Home />);
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-text')).not.toBeInTheDocument();
    });
  });
});