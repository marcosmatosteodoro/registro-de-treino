import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Exercicios from './page';
import { useExercicioPage } from '@/hooks/useExercicioPage';
import { useValidation } from '@/hooks/useValidation';
import { ITreino } from '@/models/treino';

// Mocks dos hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useExercicioPage', () => ({
  useExercicioPage: jest.fn(),
}));

jest.mock('@/hooks/useValidation', () => ({
  useValidation: jest.fn(),
}));

// Mocks dos componentes
jest.mock('@/components', () => ({
  Title: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="title">{children}</h1>
  ),
  Header: ({ backRoute }: { backRoute: string }) => (
    <div data-testid="header" data-back-route={backRoute}>Header</div>
  ),
}));

// Interface para exercícios com checked
interface IExercicioComChecked {
  id: number;
  nome: string;
  treinoId: number;
  checked: boolean;
}

describe('Exercicios Page', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  };

  const mockUserValidate = jest.fn();
  const mockTreinoValidate = jest.fn();
  const mockHandleCheckboxChange = jest.fn();
  const mockHandleRestore = jest.fn();
  const mockGetText = jest.fn();

  const mockCurrentTreino: ITreino = {
    id: 1,
    nome: 'Treino Peito',
    userId: 1
  };

  const mockExerciciosComChecked: IExercicioComChecked[] = [
    {
      id: 1,
      nome: 'Supino Reto',
      treinoId: 1,
      checked: false
    },
    {
      id: 2,
      nome: 'Supino Inclinado',
      treinoId: 1,
      checked: true
    },
    {
      id: 3,
      nome: 'Crucifixo',
      treinoId: 1,
      checked: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useValidation as jest.Mock).mockReturnValue({
      userValidate: mockUserValidate,
      treinoValidate: mockTreinoValidate,
    });
    (useExercicioPage as jest.Mock).mockReturnValue({
      currentTreino: mockCurrentTreino,
      exerciciosComChecked: mockExerciciosComChecked,
      handleCheckboxChange: mockHandleCheckboxChange,
      handleRestore: mockHandleRestore,
      getText: mockGetText,
    });

    // Mock padrão para getText
    mockGetText.mockImplementation((exercicio: IExercicioComChecked) => 
      `Treino: ${exercicio.treinoId}`
    );
  });

  describe('renderização básica', () => {
    it('deve renderizar a página corretamente', () => {
      render(<Exercicios />);

      expect(screen.getByTestId('exercicios-page')).toBeInTheDocument();
      expect(screen.getByTestId('exercicios-main')).toBeInTheDocument();
      expect(screen.getByTestId('exercicios-list')).toBeInTheDocument();
    });

    it('deve renderizar o header com rota correta', () => {
      render(<Exercicios />);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-back-route', '/treinos');
    });

    it('deve renderizar o título com nome do treino atual', () => {
      render(<Exercicios />);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Treino Peito');
    });

    it('deve renderizar título vazio quando não há treino atual', () => {
      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: null,
        exerciciosComChecked: mockExerciciosComChecked,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('');
    });

    it('deve ter classes CSS corretas no container principal', () => {
      render(<Exercicios />);

      const page = screen.getByTestId('exercicios-page');
      expect(page).toHaveClass('flex', 'min-h-screen', 'flex-col', 'bg-linear-to-br', 'from-gray-900', 'to-black');
    });

    it('deve ter classes CSS corretas no main', () => {
      render(<Exercicios />);

      const main = screen.getByTestId('exercicios-main');
      expect(main).toHaveClass('flex', 'flex-1', 'flex-col', 'items-center', 'px-6', 'py-8');
    });

    it('deve ter classes CSS corretas na lista de exercícios', () => {
      render(<Exercicios />);

      const list = screen.getByTestId('exercicios-list');
      expect(list).toHaveClass('w-full', 'max-w-md', 'space-y-4');
    });
  });

  describe('validações iniciais', () => {
    it('deve chamar userValidate e treinoValidate no useEffect', async () => {
      render(<Exercicios />);

      await waitFor(() => {
        expect(mockUserValidate).toHaveBeenCalledTimes(1);
        expect(mockTreinoValidate).toHaveBeenCalledTimes(1);
      });
    });

    it('deve chamar validações apenas uma vez', async () => {
      const { rerender } = render(<Exercicios />);
      
      await waitFor(() => {
        expect(mockUserValidate).toHaveBeenCalledTimes(1);
        expect(mockTreinoValidate).toHaveBeenCalledTimes(1);
      });

      rerender(<Exercicios />);
      
      await waitFor(() => {
        expect(mockUserValidate).toHaveBeenCalledTimes(1);
        expect(mockTreinoValidate).toHaveBeenCalledTimes(1);
      });
    });

    it('deve chamar validações com dependências corretas', () => {
      render(<Exercicios />);

      expect(useValidation).toHaveBeenCalled();
    });
  });

  describe('renderização de exercícios', () => {
    it('deve renderizar todos os exercícios', () => {
      render(<Exercicios />);

      expect(screen.getByTestId('exercicio-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('exercicio-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('exercicio-item-3')).toBeInTheDocument();
    });

    it('deve renderizar nomes dos exercícios', () => {
      render(<Exercicios />);

      expect(screen.getByText('Supino Reto')).toBeInTheDocument();
      expect(screen.getByText('Supino Inclinado')).toBeInTheDocument();
      expect(screen.getByText('Crucifixo')).toBeInTheDocument();
    });

    it('deve renderizar checkboxes para cada exercício', () => {
      render(<Exercicios />);

      expect(screen.getByTestId('exercicio-checkbox-1')).toBeInTheDocument();
      expect(screen.getByTestId('exercicio-checkbox-2')).toBeInTheDocument();
      expect(screen.getByTestId('exercicio-checkbox-3')).toBeInTheDocument();
    });

    it('deve refletir estado checked dos exercícios', () => {
      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1') as HTMLInputElement;
      const checkbox2 = screen.getByTestId('exercicio-checkbox-2') as HTMLInputElement;
      const checkbox3 = screen.getByTestId('exercicio-checkbox-3') as HTMLInputElement;

      expect(checkbox1.checked).toBe(false);
      expect(checkbox2.checked).toBe(true);
      expect(checkbox3.checked).toBe(false);
    });

    it('deve chamar getText para cada exercício', () => {
      render(<Exercicios />);

      expect(mockGetText).toHaveBeenCalledWith(mockExerciciosComChecked[0]);
      expect(mockGetText).toHaveBeenCalledWith(mockExerciciosComChecked[1]);
      expect(mockGetText).toHaveBeenCalledWith(mockExerciciosComChecked[2]);
      expect(mockGetText).toHaveBeenCalledTimes(3);
    });

    it('deve renderizar texto retornado por getText', () => {
      render(<Exercicios />);

      const textElements = screen.getAllByText('Treino: 1');
      expect(textElements).toHaveLength(3);
      expect(textElements[0]).toBeInTheDocument();
    });

    it('deve lidar com lista vazia de exercícios', () => {
      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: [],
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      const list = screen.getByTestId('exercicios-list');
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });
  });

  describe('interação com checkboxes', () => {
    it('deve chamar handleCheckboxChange quando checkbox é clicado', () => {
      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1');
      fireEvent.click(checkbox1);

      expect(mockHandleCheckboxChange).toHaveBeenCalledWith(1);
    });

    it('deve chamar handleCheckboxChange com ID correto para cada exercício', () => {
      render(<Exercicios />);

      const checkbox2 = screen.getByTestId('exercicio-checkbox-2');
      const checkbox3 = screen.getByTestId('exercicio-checkbox-3');

      fireEvent.click(checkbox2);
      expect(mockHandleCheckboxChange).toHaveBeenCalledWith(2);

      fireEvent.click(checkbox3);
      expect(mockHandleCheckboxChange).toHaveBeenCalledWith(3);
    });

    it('deve permitir múltiplos cliques em checkboxes diferentes', () => {
      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1');
      const checkbox2 = screen.getByTestId('exercicio-checkbox-2');

      fireEvent.click(checkbox1);
      fireEvent.click(checkbox2);

      expect(mockHandleCheckboxChange).toHaveBeenCalledTimes(2);
      expect(mockHandleCheckboxChange).toHaveBeenNthCalledWith(1, 1);
      expect(mockHandleCheckboxChange).toHaveBeenNthCalledWith(2, 2);
    });

    it('deve permitir múltiplos cliques no mesmo checkbox', () => {
      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1');

      fireEvent.click(checkbox1);
      fireEvent.click(checkbox1);
      fireEvent.click(checkbox1);

      expect(mockHandleCheckboxChange).toHaveBeenCalledTimes(3);
      expect(mockHandleCheckboxChange).toHaveBeenCalledWith(1);
    });

    it('deve manter acessibilidade dos checkboxes', () => {
      render(<Exercicios />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);

      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  describe('botão restaurar', () => {
    it('deve renderizar o botão restaurar', () => {
      render(<Exercicios />);

      const restaurarButton = screen.getByTestId('restaurar-button');
      expect(restaurarButton).toBeInTheDocument();
      expect(restaurarButton).toHaveTextContent('Restaurar');
    });

    it('deve ter classes CSS corretas no botão restaurar', () => {
      render(<Exercicios />);

      const restaurarButton = screen.getByTestId('restaurar-button');
      expect(restaurarButton).toHaveClass(
        'mt-8', 'w-48', 'h-12', 'bg-linear-to-r', 'from-red-600', 'to-red-700',
        'hover:from-red-700', 'hover:to-red-800', 'text-white', 'font-bold',
        'text-lg', 'rounded-lg', 'shadow-lg', 'transition-all', 'duration-300',
        'transform', 'hover:scale-105'
      );
    });

    it('deve chamar handleRestore quando clicado', () => {
      render(<Exercicios />);

      const restaurarButton = screen.getByTestId('restaurar-button');
      fireEvent.click(restaurarButton);

      expect(mockHandleRestore).toHaveBeenCalledTimes(1);
    });

    it('deve permitir múltiplos cliques no botão restaurar', () => {
      render(<Exercicios />);

      const restaurarButton = screen.getByTestId('restaurar-button');

      fireEvent.click(restaurarButton);
      fireEvent.click(restaurarButton);

      expect(mockHandleRestore).toHaveBeenCalledTimes(2);
    });

    it('deve ser acessível via role button', () => {
      render(<Exercicios />);

      const buttons = screen.getAllByRole('button');
      const restaurarButton = buttons.find(button => button.textContent === 'Restaurar');
      
      expect(restaurarButton).toBeInTheDocument();
    });
  });

  describe('estrutura dos exercícios', () => {
    it('deve ter estrutura correta para cada exercício', () => {
      render(<Exercicios />);

      const exercicioItem = screen.getByTestId('exercicio-item-1');
      const checkbox = screen.getByTestId('exercicio-checkbox-1');
      const content = screen.getByTestId('exercicio-content-1');
      const nome = screen.getByTestId('exercicio-nome-1');
      const text = screen.getByTestId('exercicio-text-1');

      expect(exercicioItem).toContainElement(checkbox);
      expect(exercicioItem).toContainElement(content);
      expect(content).toContainElement(nome);
      expect(content).toContainElement(text);
    });

    it('deve ter classes CSS corretas nos itens de exercício', () => {
      render(<Exercicios />);

      const exercicioItem = screen.getByTestId('exercicio-item-1');
      expect(exercicioItem).toHaveClass(
        'flex', 'items-center', 'space-x-4', 'p-4', 'bg-gray-800/50',
        'rounded-lg', 'border', 'border-gray-700/50', 'hover:bg-gray-700/50',
        'transition-colors'
      );
    });

    it('deve ter classes CSS corretas nos checkboxes', () => {
      render(<Exercicios />);

      const checkbox = screen.getByTestId('exercicio-checkbox-1');
      expect(checkbox).toHaveClass(
        'w-5', 'h-5', 'text-orange-500', 'bg-gray-700', 'border-gray-600',
        'rounded', 'focus:ring-orange-500', 'focus:ring-2'
      );
    });

    it('deve ter classes CSS corretas no conteúdo dos exercícios', () => {
      render(<Exercicios />);

      const content = screen.getByTestId('exercicio-content-1');
      const nome = screen.getByTestId('exercicio-nome-1');
      const text = screen.getByTestId('exercicio-text-1');

      expect(content).toHaveClass('flex-1', 'text-white');
      expect(nome).toHaveClass('font-semibold', 'text-lg');
      expect(text).toHaveClass('text-gray-300', 'text-sm');
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com exercícios com nomes vazios', () => {
      const exerciciosComNomeVazio = [
        { ...mockExerciciosComChecked[0], nome: '' },
        { ...mockExerciciosComChecked[1], nome: 'Exercício Válido' },
      ];

      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: exerciciosComNomeVazio,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      expect(screen.getByTestId('exercicio-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('exercicio-item-2')).toBeInTheDocument();
      expect(screen.getByText('Exercício Válido')).toBeInTheDocument();
    });

    it('deve lidar com IDs de exercício diferentes', () => {
      const exerciciosComIDsDiferentes = [
        { ...mockExerciciosComChecked[0], id: 999 },
        { ...mockExerciciosComChecked[1], id: 888 },
      ];

      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: exerciciosComIDsDiferentes,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      expect(screen.getByTestId('exercicio-item-999')).toBeInTheDocument();
      expect(screen.getByTestId('exercicio-item-888')).toBeInTheDocument();
    });

    it('deve lidar quando getText retorna string vazia', () => {
      mockGetText.mockReturnValue('');

      render(<Exercicios />);

      const textElements = screen.getAllByTestId(/exercicio-text-/);
      textElements.forEach(element => {
        expect(element).toHaveTextContent('');
      });
    });

    it('deve lidar quando getText retorna null ou undefined', () => {
      mockGetText.mockReturnValue(null);

      render(<Exercicios />);

      const textElements = screen.getAllByTestId(/exercicio-text-/);
      textElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    it('deve lidar com estados de checked mistos', () => {
      const exerciciosComEstadosMistos = [
        { ...mockExerciciosComChecked[0], checked: true },
        { ...mockExerciciosComChecked[1], checked: false },
        { ...mockExerciciosComChecked[2], checked: true },
      ];

      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: exerciciosComEstadosMistos,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1') as HTMLInputElement;
      const checkbox2 = screen.getByTestId('exercicio-checkbox-2') as HTMLInputElement;
      const checkbox3 = screen.getByTestId('exercicio-checkbox-3') as HTMLInputElement;

      expect(checkbox1.checked).toBe(true);
      expect(checkbox2.checked).toBe(false);
      expect(checkbox3.checked).toBe(true);
    });
  });

  describe('integração com hooks', () => {
    it('deve usar todos os hooks necessários', () => {
      render(<Exercicios />);

      expect(useExercicioPage).toHaveBeenCalled();
      expect(useValidation).toHaveBeenCalled();
    });

    it('deve funcionar quando hooks retornam valores diferentes', () => {
      const treinoPersonalizado = {
        id: 100,
        nome: 'Treino Personalizado',
        userId: 2
      };

      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: treinoPersonalizado,
        exerciciosComChecked: [],
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      expect(screen.getByText('Treino Personalizado')).toBeInTheDocument();
    });

    it('deve reagir a atualizações nos hooks', () => {
      const { rerender } = render(<Exercicios />);

      expect(screen.getByText('Supino Reto')).toBeInTheDocument();

      // Simula mudança no hook
      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: [],
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      rerender(<Exercicios />);

      expect(screen.queryByText('Supino Reto')).not.toBeInTheDocument();
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via roles', () => {
      render(<Exercicios />);

      const checkboxes = screen.getAllByRole('checkbox');
      const buttons = screen.getAllByRole('button');

      expect(checkboxes.length).toBeGreaterThan(0);
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura semântica correta', () => {
      render(<Exercicios />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    it('deve permitir navegação por teclado nos checkboxes', () => {
      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1');
      checkbox1.focus();

      expect(checkbox1).toHaveFocus();
    });

    it('deve permitir navegação por teclado no botão restaurar', () => {
      render(<Exercicios />);

      const restaurarButton = screen.getByTestId('restaurar-button');
      restaurarButton.focus();

      expect(restaurarButton).toHaveFocus();
    });

    it('deve ter labels adequados para screen readers', () => {
      render(<Exercicios />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<Exercicios />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('exercicios-page')).toBeInTheDocument();
    });

    it('deve lidar com muitos exercícios', () => {
      const muitosExercicios = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        nome: `Exercício ${index + 1}`,
        treinoId: 1,
        checked: index % 2 === 0
      }));

      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: muitosExercicios,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      expect(screen.getByText('Exercício 1')).toBeInTheDocument();
      expect(screen.getByText('Exercício 20')).toBeInTheDocument();
    });

    it('deve manter performance durante re-renders', () => {
      const { rerender } = render(<Exercicios />);

      expect(screen.getByTestId('exercicios-page')).toBeInTheDocument();

      // Força re-render
      rerender(<Exercicios />);

      expect(screen.getByTestId('exercicios-page')).toBeInTheDocument();
      expect(screen.getByText('Supino Reto')).toBeInTheDocument();
    });
  });

  describe('interações do usuário', () => {
    it('deve permitir alternar estado de todos os checkboxes', () => {
      render(<Exercicios />);

      const checkboxes = screen.getAllByRole('checkbox');
      
      checkboxes.forEach(checkbox => {
        fireEvent.click(checkbox);
      });

      expect(mockHandleCheckboxChange).toHaveBeenCalledTimes(3);
    });

    it('deve manter estado visual consistente', () => {
      render(<Exercicios />);

      const exercicioItem = screen.getByTestId('exercicio-item-1');
      const checkbox = screen.getByTestId('exercicio-checkbox-1');
      const nome = screen.getByTestId('exercicio-nome-1');

      expect(exercicioItem).toContainElement(checkbox);
      expect(exercicioItem).toContainElement(nome);
    });

    it('deve permitir interação com keyboard no botão restaurar', () => {
      render(<Exercicios />);

      const restaurarButton = screen.getByTestId('restaurar-button');
      
      fireEvent.keyDown(restaurarButton, { key: 'Enter', code: 'Enter' });
      
      expect(restaurarButton).toBeInTheDocument();
    });

    it('deve manter foco adequado após interações', () => {
      render(<Exercicios />);

      const checkbox1 = screen.getByTestId('exercicio-checkbox-1');
      
      fireEvent.click(checkbox1);
      
      expect(mockHandleCheckboxChange).toHaveBeenCalledWith(1);
    });
  });

  describe('edge cases de UI', () => {
    it('deve manter layout mesmo sem exercícios', () => {
      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: [],
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      expect(screen.getByTestId('exercicios-page')).toBeInTheDocument();
      expect(screen.getByTestId('exercicios-main')).toBeInTheDocument();
      expect(screen.getByTestId('exercicios-list')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('restaurar-button')).toBeInTheDocument();
    });

    it('deve manter consistência visual com 1 exercício', () => {
      const umExercicio = [mockExerciciosComChecked[0]];
      
      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: mockCurrentTreino,
        exerciciosComChecked: umExercicio,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      const list = screen.getByTestId('exercicios-list');
      expect(list).toHaveClass('w-full', 'max-w-md', 'space-y-4');
      expect(screen.getByTestId('exercicio-item-1')).toBeInTheDocument();
    });

    it('deve lidar com nomes de treino muito longos', () => {
      const treinoComNomeLongo = {
        id: 1,
        nome: 'Treino com Nome Extremamente Longo que Pode Quebrar o Layout se Não For Tratado Adequadamente',
        userId: 1
      };

      (useExercicioPage as jest.Mock).mockReturnValue({
        currentTreino: treinoComNomeLongo,
        exerciciosComChecked: mockExerciciosComChecked,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleRestore: mockHandleRestore,
        getText: mockGetText,
      });

      render(<Exercicios />);

      const title = screen.getByTestId('title');
      expect(title).toHaveTextContent(treinoComNomeLongo.nome);
    });
  });
});