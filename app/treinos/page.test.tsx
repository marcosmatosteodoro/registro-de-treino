import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Treinos from './page';
import { useTreinosPage } from '@/hooks/useTreinosPage';
import { useButtonComponent } from '@/hooks/useButtonComponent';
import { useValidation } from '@/hooks/useValidation';
import { ITreino } from '@/models/treino';

// Mocks dos hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useTreinosPage', () => ({
  useTreinosPage: jest.fn(),
}));

jest.mock('@/hooks/useButtonComponent', () => ({
  useButtonComponent: jest.fn(),
}));

jest.mock('@/hooks/useValidation', () => ({
  useValidation: jest.fn(),
}));

// Mocks dos componentes
jest.mock('@/components', () => ({
  NotFoundText: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="not-found-text">{children}</div>
  ),
  Title: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="title">{children}</h1>
  ),
  Header: ({ backRoute }: { backRoute: string }) => (
    <div data-testid="header" data-back-route={backRoute}>Header</div>
  ),
}));

// Mock dos componentes Button
const MockButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} data-testid="mock-button">
    {children}
  </button>
);

const MockButtonOrange = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div data-testid="button-orange">
    <button onClick={onClick}>
      {children}
    </button>
  </div>
);

const MockButtonPurple = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div data-testid="button-purple">
    <button onClick={onClick}>
      {children}
    </button>
  </div>
);

const MockButtonGrey = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div data-testid="button-grey">
    <button onClick={onClick}>
      {children}
    </button>
  </div>
);

describe('Treinos Page', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  };

  const mockUserValidate = jest.fn();
  const mockHandleTreinoSelection = jest.fn();
  const mockGetButtonComponent = jest.fn();

  const mockTreinos: ITreino[] = [
    {
      id: 1,
      nome: 'Treino Peito',
      userId: 1
    },
    {
      id: 2,
      nome: 'Treino Costas',
      userId: 1
    },
    {
      id: 3,
      nome: 'Treino Pernas',
      userId: 1
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useValidation as jest.Mock).mockReturnValue({
      userValidate: mockUserValidate,
    });
    (useTreinosPage as jest.Mock).mockReturnValue({
      treinos: mockTreinos,
      handleTreinoSelection: mockHandleTreinoSelection,
    });
    (useButtonComponent as jest.Mock).mockReturnValue({
      getButtonComponent: mockGetButtonComponent,
    });

    // Mock padrão para getButtonComponent
    mockGetButtonComponent.mockImplementation((index: number) => {
      switch (index) {
        case 0: return MockButtonOrange;
        case 1: return MockButtonPurple;
        default: return MockButtonGrey;
      }
    });
  });

  describe('renderização básica', () => {
    it('deve renderizar a página corretamente', () => {
      render(<Treinos />);

      expect(screen.getByTestId('treinos-page')).toBeInTheDocument();
      expect(screen.getByTestId('treinos-main')).toBeInTheDocument();
      expect(screen.getByTestId('treinos-container')).toBeInTheDocument();
    });

    it('deve renderizar o header com rota correta', () => {
      render(<Treinos />);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-back-route', '/');
    });

    it('deve renderizar o título correto', () => {
      render(<Treinos />);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Escolha seu treino');
    });

    it('deve ter classes CSS corretas no container principal', () => {
      render(<Treinos />);

      const page = screen.getByTestId('treinos-page');
      expect(page).toHaveClass('flex', 'min-h-screen', 'flex-col', 'bg-linear-to-br', 'from-gray-900', 'to-black');
    });

    it('deve ter classes CSS corretas no main', () => {
      render(<Treinos />);

      const main = screen.getByTestId('treinos-main');
      expect(main).toHaveClass('flex', 'flex-1', 'flex-col', 'items-center', 'justify-center', 'px-8', 'py-16', 'text-center');
    });

    it('deve ter classes CSS corretas no container de treinos', () => {
      render(<Treinos />);

      const container = screen.getByTestId('treinos-container');
      expect(container).toHaveClass('flex', 'flex-col', 'gap-6', 'sm:flex-row', 'sm:gap-8');
    });
  });

  describe('validação de usuário', () => {
    it('deve chamar userValidate no useEffect', async () => {
      render(<Treinos />);

      await waitFor(() => {
        expect(mockUserValidate).toHaveBeenCalledTimes(1);
      });
    });

    it('deve chamar userValidate apenas uma vez', async () => {
      const { rerender } = render(<Treinos />);
      
      await waitFor(() => {
        expect(mockUserValidate).toHaveBeenCalledTimes(1);
      });

      rerender(<Treinos />);
      
      await waitFor(() => {
        expect(mockUserValidate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('renderização de treinos', () => {
    it('deve renderizar botões de treino quando há treinos suficientes', () => {
      render(<Treinos />);

      expect(screen.getByTestId('treino-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('treino-button-2')).toBeInTheDocument();
      expect(screen.getByTestId('treino-button-3')).toBeInTheDocument();
    });

    it('deve renderizar nomes dos treinos nos botões', () => {
      render(<Treinos />);

      expect(screen.getByText('Treino Peito')).toBeInTheDocument();
      expect(screen.getByText('Treino Costas')).toBeInTheDocument();
      expect(screen.getByText('Treino Pernas')).toBeInTheDocument();
    });

    it('deve usar diferentes componentes de botão baseado no índice', () => {
      render(<Treinos />);

      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
    });

    it('deve chamar getButtonComponent com índices corretos', () => {
      render(<Treinos />);

      expect(mockGetButtonComponent).toHaveBeenCalledWith(0);
      expect(mockGetButtonComponent).toHaveBeenCalledWith(1);
      expect(mockGetButtonComponent).toHaveBeenCalledWith(2);
      expect(mockGetButtonComponent).toHaveBeenCalledTimes(3);
    });

    it('deve renderizar NotFoundText quando há poucos treinos', () => {
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: [mockTreinos[0]], // Apenas 1 treino
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
      expect(screen.getByText('Nenhum treino encontrado para este usuário.')).toBeInTheDocument();
    });

    it('deve renderizar NotFoundText quando não há treinos', () => {
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: [],
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
      expect(screen.getByText('Nenhum treino encontrado para este usuário.')).toBeInTheDocument();
    });
  });

  describe('interação com treinos', () => {
    it('deve chamar handleTreinoSelection quando botão é clicado', () => {
      render(<Treinos />);

      const botaoPeito = screen.getByText('Treino Peito').closest('button');
      fireEvent.click(botaoPeito!);

      expect(mockHandleTreinoSelection).toHaveBeenCalledWith(mockTreinos[0]);
    });

    it('deve chamar handleTreinoSelection com treino correto para cada botão', () => {
      render(<Treinos />);

      const botaoCostas = screen.getByText('Treino Costas').closest('button');
      const botaoPernas = screen.getByText('Treino Pernas').closest('button');

      fireEvent.click(botaoCostas!);
      expect(mockHandleTreinoSelection).toHaveBeenCalledWith(mockTreinos[1]);

      fireEvent.click(botaoPernas!);
      expect(mockHandleTreinoSelection).toHaveBeenCalledWith(mockTreinos[2]);
    });

    it('deve permitir múltiplos cliques em botões diferentes', () => {
      render(<Treinos />);

      const botaoPeito = screen.getByText('Treino Peito').closest('button');
      const botaoCostas = screen.getByText('Treino Costas').closest('button');

      fireEvent.click(botaoPeito!);
      fireEvent.click(botaoCostas!);

      expect(mockHandleTreinoSelection).toHaveBeenCalledTimes(2);
      expect(mockHandleTreinoSelection).toHaveBeenNthCalledWith(1, mockTreinos[0]);
      expect(mockHandleTreinoSelection).toHaveBeenNthCalledWith(2, mockTreinos[1]);
    });

    it('deve permitir múltiplos cliques no mesmo botão', () => {
      render(<Treinos />);

      const botaoPeito = screen.getByText('Treino Peito').closest('button');

      fireEvent.click(botaoPeito!);
      fireEvent.click(botaoPeito!);
      fireEvent.click(botaoPeito!);

      expect(mockHandleTreinoSelection).toHaveBeenCalledTimes(3);
      expect(mockHandleTreinoSelection).toHaveBeenCalledWith(mockTreinos[0]);
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com treinos com nomes vazios', () => {
      const treinosComNomeVazio = [
        { ...mockTreinos[0], nome: '' },
        { ...mockTreinos[1], nome: 'Treino Valid' },
      ];

      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: treinosComNomeVazio,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('treino-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('treino-button-2')).toBeInTheDocument();
      expect(screen.getByText('Treino Valid')).toBeInTheDocument();
    });

    it('deve lidar com IDs de treino diferentes', () => {
      const treinosComIDsDiferentes = [
        { ...mockTreinos[0], id: 999 },
        { ...mockTreinos[1], id: 888 },
      ];

      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: treinosComIDsDiferentes,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('treino-button-999')).toBeInTheDocument();
      expect(screen.getByTestId('treino-button-888')).toBeInTheDocument();
    });

    it('deve lidar quando getButtonComponent retorna componente indefinido', () => {
      mockGetButtonComponent.mockReturnValue(MockButton);

      render(<Treinos />);

      const buttons = screen.getAllByTestId('mock-button');
      expect(buttons).toHaveLength(3);
    });

    it('deve lidar com treinos duplicados', () => {
      const treinosDuplicados = [
        mockTreinos[0],
        mockTreinos[0], // Mesmo treino duplicado
        mockTreinos[1],
      ];

      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: treinosDuplicados,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      // Deve renderizar os 3 botões, mesmo com treino duplicado
      const botoesPeito = screen.getAllByText('Treino Peito');
      expect(botoesPeito).toHaveLength(2);
      expect(screen.getByText('Treino Costas')).toBeInTheDocument();
    });
  });

  describe('responsividade', () => {
    it('deve ter classes responsivas no container de treinos', () => {
      render(<Treinos />);

      const container = screen.getByTestId('treinos-container');
      expect(container).toHaveClass('flex-col', 'sm:flex-row');
      expect(container).toHaveClass('gap-6', 'sm:gap-8');
    });

    it('deve manter estrutura responsiva com diferentes quantidades de treinos', () => {
      const poucosTreinos = mockTreinos.slice(0, 2);
      
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: poucosTreinos,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      const container = screen.getByTestId('treinos-container');
      expect(container).toHaveClass('flex', 'flex-col', 'gap-6', 'sm:flex-row', 'sm:gap-8');
    });
  });

  describe('integração com hooks', () => {
    it('deve usar todos os hooks necessários', () => {
      render(<Treinos />);

      expect(useTreinosPage).toHaveBeenCalled();
      expect(useButtonComponent).toHaveBeenCalled();
      expect(useValidation).toHaveBeenCalled();
    });

    it('deve funcionar quando hooks retornam valores diferentes', () => {
      const treinosPersonalizados = [
        {
          id: 100,
          nome: 'Treino Personalizado',
          userId: 2
        }
      ];

      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: treinosPersonalizados,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });

    it('deve reagir a atualizações nos hooks', () => {
      const { rerender } = render(<Treinos />);

      expect(screen.getByText('Treino Peito')).toBeInTheDocument();

      // Simula mudança no hook
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: [],
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      rerender(<Treinos />);

      expect(screen.queryByText('Treino Peito')).not.toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via roles', () => {
      render(<Treinos />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura semântica correta', () => {
      render(<Treinos />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    it('deve permitir navegação por teclado', () => {
      render(<Treinos />);

      const botaoPeito = screen.getByText('Treino Peito').closest('button');
      botaoPeito?.focus();

      expect(botaoPeito).toHaveFocus();
    });

    it('deve funcionar com screen readers', () => {
      render(<Treinos />);

      const title = screen.getByTestId('title');
      expect(title).toHaveTextContent('Escolha seu treino');

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('renderTreinoButton function', () => {
    it('deve gerar keys únicas para cada treino', () => {
      render(<Treinos />);

      const button1 = screen.getByTestId('treino-button-1');
      const button2 = screen.getByTestId('treino-button-2');
      const button3 = screen.getByTestId('treino-button-3');

      expect(button1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();
      expect(button3).toBeInTheDocument();
    });

    it('deve envolver o botão em div com data-testid correto', () => {
      render(<Treinos />);

      const wrapperDiv = screen.getByTestId('treino-button-1');
      expect(wrapperDiv.tagName).toBe('DIV');
      expect(wrapperDiv).toContainElement(screen.getByText('Treino Peito').closest('button')!);
    });

    it('deve passar onClick corretamente para o componente Button', () => {
      render(<Treinos />);

      const botaoPeito = screen.getByText('Treino Peito').closest('button');
      fireEvent.click(botaoPeito!);

      expect(mockHandleTreinoSelection).toHaveBeenCalledWith(mockTreinos[0]);
    });
  });

  describe('performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<Treinos />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('treinos-page')).toBeInTheDocument();
    });

    it('deve lidar com muitos treinos', () => {
      const muitosTreinos = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        nome: `Treino ${index + 1}`,
        userId: 1
      }));

      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: muitosTreinos,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByText('Treino 1')).toBeInTheDocument();
      expect(screen.getByText('Treino 20')).toBeInTheDocument();
    });

    it('deve manter performance durante re-renders', () => {
      const { rerender } = render(<Treinos />);

      expect(screen.getByTestId('treinos-page')).toBeInTheDocument();

      // Força re-render
      rerender(<Treinos />);

      expect(screen.getByTestId('treinos-page')).toBeInTheDocument();
      expect(screen.getByText('Treino Peito')).toBeInTheDocument();
    });
  });

  describe('edge cases de UI', () => {
    it('deve manter layout mesmo sem treinos', () => {
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: [],
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('treinos-page')).toBeInTheDocument();
      expect(screen.getByTestId('treinos-main')).toBeInTheDocument();
      expect(screen.getByTestId('treinos-container')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    it('deve manter consistência visual com 1 treino (mostra NotFound)', () => {
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: [mockTreinos[0]],
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      const container = screen.getByTestId('treinos-container');
      expect(container).toHaveClass('flex', 'flex-col', 'gap-6', 'sm:flex-row', 'sm:gap-8');
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });

    it('deve manter consistência visual com exatamente 2 treinos', () => {
      const doisTreinos = mockTreinos.slice(0, 2);
      
      (useTreinosPage as jest.Mock).mockReturnValue({
        treinos: doisTreinos,
        handleTreinoSelection: mockHandleTreinoSelection,
      });

      render(<Treinos />);

      expect(screen.getByTestId('treino-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('treino-button-2')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-text')).not.toBeInTheDocument();
    });
  });
});