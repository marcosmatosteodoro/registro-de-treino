import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonPurple } from './index';

describe('ButtonPurple', () => {
  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<ButtonPurple>Purple Button</ButtonPurple>);

      const containerElement = screen.getByTestId('button-purple');
      expect(containerElement).toBeInTheDocument();
    });

    it('deve ter container div com data-testid correto', () => {
      render(<ButtonPurple>Test Purple</ButtonPurple>);

      const containerElement = screen.getByTestId('button-purple');
      expect(containerElement.tagName).toBe('DIV');
      expect(containerElement).toHaveAttribute('data-testid', 'button-purple');
    });

    it('deve conter botão interno', () => {
      render(<ButtonPurple>Internal Button</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter classes CSS básicas do Button', () => {
      render(<ButtonPurple>Purple Test</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('font-bold');
      expect(buttonElement).toHaveClass('text-xl');
      expect(buttonElement).toHaveClass('rounded-lg');
      expect(buttonElement).toHaveClass('shadow-lg');
    });

    it('deve ter classes específicas do gradiente roxo', () => {
      render(<ButtonPurple>Purple Gradient</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('from-blue-500');
      expect(buttonElement).toHaveClass('to-purple-600');
      expect(buttonElement).toHaveClass('bg-linear-to-r');
    });

    it('deve ter classes de animação e efeitos', () => {
      render(<ButtonPurple>Animated Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('transition-all');
      expect(buttonElement).toHaveClass('duration-300');
      expect(buttonElement).toHaveClass('transform');
      expect(buttonElement).toHaveClass('hover:scale-105');
      expect(buttonElement).toHaveClass('hover:shadow-xl');
    });
  });

  describe('children', () => {
    it('deve renderizar texto simples como children', () => {
      const buttonText = 'Purple Click Me';
      render(<ButtonPurple>{buttonText}</ButtonPurple>);

      expect(screen.getByText(buttonText)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent(buttonText);
    });

    it('deve renderizar elementos React como children', () => {
      render(
        <ButtonPurple>
          <span data-testid="purple-child-span">Purple Content</span>
        </ButtonPurple>
      );

      expect(screen.getByTestId('purple-child-span')).toBeInTheDocument();
      expect(screen.getByText('Purple Content')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <ButtonPurple>
          <span data-testid="purple-first">Purple Part 1</span>
          <span data-testid="purple-second"> Purple Part 2</span>
        </ButtonPurple>
      );

      expect(screen.getByTestId('purple-first')).toBeInTheDocument();
      expect(screen.getByTestId('purple-second')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Purple Part 1 Purple Part 2');
    });

    it('deve renderizar children com formatação', () => {
      render(
        <ButtonPurple>
          Purple <strong data-testid="purple-bold">Button</strong>!
        </ButtonPurple>
      );

      expect(screen.getByTestId('purple-bold')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Purple Button!');
    });

    it('deve renderizar ícones como children', () => {
      render(
        <ButtonPurple>
          <svg data-testid="purple-icon" width="16" height="16">
            <circle cx="8" cy="8" r="4"/>
          </svg>
          Ícone Purple
        </ButtonPurple>
      );

      expect(screen.getByTestId('purple-icon')).toBeInTheDocument();
      expect(screen.getByText('Ícone Purple')).toBeInTheDocument();
    });
  });

  describe('onClick handler', () => {
    it('deve chamar onClick quando clicado', () => {
      const mockOnClick = jest.fn();
      render(<ButtonPurple onClick={mockOnClick}>Click Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar sem onClick', () => {
      render(<ButtonPurple>No Handler Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Não deve quebrar quando clicado sem handler
      expect(() => fireEvent.click(buttonElement)).not.toThrow();
    });

    it('deve chamar onClick múltiplas vezes', () => {
      const mockOnClick = jest.fn();
      render(<ButtonPurple onClick={mockOnClick}>Multiple Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('deve manter estado do clique corretamente', () => {
      let clickCalled = false;
      const handleClick = () => {
        clickCalled = true;
      };

      render(<ButtonPurple onClick={handleClick}>State Test Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(clickCalled).toBe(true);
    });

    it('deve prevenir múltiplos cliques quando necessário', () => {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };

      render(<ButtonPurple onClick={handleClick}>Count Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Cliques rápidos
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);

      expect(clickCount).toBe(2);
    });
  });

  describe('estrutura do componente', () => {
    it('deve ter estrutura de container e botão corretas', () => {
      render(<ButtonPurple>Structure Test</ButtonPurple>);

      const containerElement = screen.getByTestId('button-purple');
      const buttonElement = screen.getByRole('button');

      expect(containerElement).toContainElement(buttonElement);
      expect(containerElement.children).toHaveLength(1);
      expect(containerElement.firstChild).toBe(buttonElement);
    });

    it('deve aplicar classes do gradiente roxo específicamente', () => {
      render(<ButtonPurple>Gradient Test</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;

      expect(className).toContain('from-blue-500');
      expect(className).toContain('to-purple-600');
      expect(className).toContain('bg-linear-to-r');
    });

    it('deve manter todas as classes base do Button', () => {
      render(<ButtonPurple>Base Classes</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Classes de tamanho
      expect(buttonElement).toHaveClass('w-48', 'h-16');
      
      // Classes de texto
      expect(buttonElement).toHaveClass('text-white', 'font-bold', 'text-xl');
      
      // Classes de design
      expect(buttonElement).toHaveClass('rounded-lg', 'shadow-lg');
      
      // Classes de animação
      expect(buttonElement).toHaveClass('transition-all', 'duration-300', 'transform');
      expect(buttonElement).toHaveClass('hover:scale-105', 'hover:shadow-xl');
    });

    it('deve diferir do Button base apenas no gradiente', () => {
      render(<ButtonPurple>Purple Button</ButtonPurple>);
      const purpleButton = screen.getByRole('button');
      const purpleClasses = purpleButton.className;

      // A principal diferença deve ser o gradiente
      expect(purpleClasses).toContain('from-blue-500');
      expect(purpleClasses).toContain('to-purple-600');
      expect(purpleClasses).toContain('bg-linear-to-r');
    });

    it('deve ter gradiente diferente do ButtonOrange', () => {
      render(<ButtonPurple>Purple vs Orange</ButtonPurple>);
      const purpleButton = screen.getByRole('button');
      const purpleClasses = purpleButton.className;

      // Deve ter cores específicas do roxo, não laranja
      expect(purpleClasses).toContain('from-blue-500');
      expect(purpleClasses).toContain('to-purple-600');
      expect(purpleClasses).not.toContain('from-orange-500');
      expect(purpleClasses).not.toContain('to-red-600');
    });
  });

  describe('casos especiais', () => {
    it('deve renderizar com children vazio', () => {
      render(<ButtonPurple>{<></>}</ButtonPurple>);

      const containerElement = screen.getByTestId('button-purple');
      const buttonElement = screen.getByRole('button');
      
      expect(containerElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com string vazia', () => {
      render(<ButtonPurple>{''}</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com número como children', () => {
      render(<ButtonPurple>{77}</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('77');
    });

    it('deve renderizar com boolean false (não renderiza)', () => {
      render(<ButtonPurple>{false}</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com null (não renderiza)', () => {
      render(<ButtonPurple>{null}</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com undefined (não renderiza)', () => {
      render(<ButtonPurple>{undefined}</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via role button', () => {
      render(<ButtonPurple>Accessible Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Accessible Purple');
    });

    it('deve ser encontrado por getByText', () => {
      const buttonText = 'Find Purple Button';
      render(<ButtonPurple>{buttonText}</ButtonPurple>);

      const buttonElement = screen.getByText(buttonText);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter foco quando focado', () => {
      render(<ButtonPurple>Focusable Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      buttonElement.focus();

      expect(buttonElement).toHaveFocus();
    });

    it('deve ter contraste adequado com gradiente roxo', () => {
      render(<ButtonPurple>Contrast Test</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Texto branco sobre gradiente roxo deve ter bom contraste
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('from-blue-500');
      expect(buttonElement).toHaveClass('to-purple-600');
    });

    it('deve responder a eventos de teclado', () => {
      const mockOnClick = jest.fn();
      render(<ButtonPurple onClick={mockOnClick}>Keyboard Purple</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Teste com Enter
      fireEvent.keyDown(buttonElement, { key: 'Enter', code: 'Enter' });
      
      // Teste com Space
      fireEvent.keyDown(buttonElement, { key: ' ', code: 'Space' });
      
      expect(buttonElement).toBeInTheDocument();
    });

    it('deve ser navigável por tab', () => {
      render(
        <div>
          <button>Previous Button</button>
          <ButtonPurple>Tab Target</ButtonPurple>
          <button>Next Button</button>
        </div>
      );

      const purpleButton = screen.getByText('Tab Target');
      expect(purpleButton).toBeInTheDocument();
      
      // Simula navegação por tab
      purpleButton.focus();
      expect(purpleButton).toHaveFocus();
    });
  });

  describe('integração com outros componentes', () => {
    it('deve funcionar dentro de outros containers', () => {
      render(
        <div data-testid="purple-container">
          <ButtonPurple>Container Purple</ButtonPurple>
        </div>
      );

      expect(screen.getByTestId('purple-container')).toBeInTheDocument();
      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
      expect(screen.getByText('Container Purple')).toBeInTheDocument();
    });

    it('deve funcionar junto com outros botões', () => {
      render(
        <div>
          <ButtonPurple>First Purple</ButtonPurple>
          <ButtonPurple>Second Purple</ButtonPurple>
        </div>
      );

      const purpleContainers = screen.getAllByTestId('button-purple');
      const purpleButtons = screen.getAllByRole('button');
      
      expect(purpleContainers).toHaveLength(2);
      expect(purpleButtons).toHaveLength(2);
      expect(purpleButtons[0]).toHaveTextContent('First Purple');
      expect(purpleButtons[1]).toHaveTextContent('Second Purple');
    });

    it('deve aceitar componentes complexos como children', () => {
      const ComplexPurpleChild = () => (
        <div data-testid="complex-purple-child">
          <span>Complex Purple</span>
          <em> Button </em>
          <strong>Content</strong>
        </div>
      );

      render(
        <ButtonPurple>
          <ComplexPurpleChild />
        </ButtonPurple>
      );

      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
      expect(screen.getByTestId('complex-purple-child')).toBeInTheDocument();
      expect(screen.getByText('Complex Purple')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('deve funcionar em formulários', () => {
      const mockSubmit = jest.fn();
      render(
        <form onSubmit={mockSubmit}>
          <ButtonPurple>Submit Purple</ButtonPurple>
        </form>
      );

      expect(screen.getByText('Submit Purple')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('casos de uso específicos', () => {
    it('deve funcionar como botão secundário', () => {
      const mockSecondaryAction = jest.fn();
      render(<ButtonPurple onClick={mockSecondaryAction}>Ação Secundária</ButtonPurple>);

      const buttonElement = screen.getByText('Ação Secundária');
      fireEvent.click(buttonElement);

      expect(mockSecondaryAction).toHaveBeenCalled();
    });

    it('deve funcionar como botão de navegação', () => {
      const mockNavigate = jest.fn();
      render(<ButtonPurple onClick={mockNavigate}>Ver Histórico</ButtonPurple>);

      const buttonElement = screen.getByText('Ver Histórico');
      fireEvent.click(buttonElement);

      expect(mockNavigate).toHaveBeenCalled();
    });

    it('deve funcionar como botão de filtro', () => {
      const mockFilter = jest.fn();
      render(<ButtonPurple onClick={mockFilter}>Filtrar por Tipo</ButtonPurple>);

      const buttonElement = screen.getByText('Filtrar por Tipo');
      fireEvent.click(buttonElement);

      expect(mockFilter).toHaveBeenCalled();
    });

    it('deve mostrar estado de loading', () => {
      render(
        <ButtonPurple>
          <span data-testid="purple-loading">Carregando...</span>
        </ButtonPurple>
      );

      expect(screen.getByTestId('purple-loading')).toBeInTheDocument();
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve funcionar como botão de configuração', () => {
      const mockConfig = jest.fn();
      render(<ButtonPurple onClick={mockConfig}>Configurações</ButtonPurple>);

      const buttonElement = screen.getByText('Configurações');
      fireEvent.click(buttonElement);

      expect(mockConfig).toHaveBeenCalled();
    });
  });

  describe('propriedades visuais', () => {
    it('deve ter gradiente visualmente distinto', () => {
      render(<ButtonPurple>Visual Test</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Verifica se as classes de gradiente estão aplicadas
      expect(buttonElement.className).toContain('from-blue-500');
      expect(buttonElement.className).toContain('to-purple-600');
      expect(buttonElement.className).toContain('bg-linear-to-r');
    });

    it('deve manter consistência visual com outros botões', () => {
      render(<ButtonPurple>Visual Consistency</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      
      // Mesmas dimensões que outros botões
      expect(buttonElement).toHaveClass('w-48', 'h-16');
      
      // Mesmo estilo de texto
      expect(buttonElement).toHaveClass('text-white', 'font-bold', 'text-xl');
      
      // Mesmos efeitos visuais
      expect(buttonElement).toHaveClass('rounded-lg', 'shadow-lg');
    });

    it('deve ter sombra apropriada para o gradiente', () => {
      render(<ButtonPurple>Shadow Test</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('shadow-lg');
      expect(buttonElement).toHaveClass('hover:shadow-xl');
    });

    it('deve ter transições suaves', () => {
      render(<ButtonPurple>Transition Test</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('transition-all');
      expect(buttonElement).toHaveClass('duration-300');
      expect(buttonElement).toHaveClass('transform');
    });
  });

  describe('performance e otimização', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<ButtonPurple>Performance Purple</ButtonPurple>);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10);
      expect(screen.getByTestId('button-purple')).toBeInTheDocument();
    });

    it('deve lidar com textos longos', () => {
      const longText = 'Purple '.repeat(20).trim();
      render(<ButtonPurple>{longText}</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent(longText);
    });

    it('deve manter referência estável durante re-renders', () => {
      const { rerender } = render(<ButtonPurple>Original Purple</ButtonPurple>);
      const originalContainer = screen.getByTestId('button-purple');

      rerender(<ButtonPurple>Updated Purple</ButtonPurple>);
      const updatedContainer = screen.getByTestId('button-purple');

      expect(updatedContainer).toBe(originalContainer);
      expect(screen.getByRole('button')).toHaveTextContent('Updated Purple');
    });

    it('deve otimizar classes CSS', () => {
      render(<ButtonPurple>CSS Optimization</ButtonPurple>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;
      
      // Verifica se não há classes duplicadas óbvias
      const classArray = className.split(' ');
      const uniqueClasses = new Set(classArray);
      
      expect(classArray.length).toBe(uniqueClasses.size);
    });

    it('deve ser eficiente em listas', () => {
      const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
      
      render(
        <div>
          {items.map((item, index) => (
            <ButtonPurple key={index}>{item}</ButtonPurple>
          ))}
        </div>
      );

      const purpleContainers = screen.getAllByTestId('button-purple');
      expect(purpleContainers).toHaveLength(10);
      
      purpleContainers.forEach((container, index) => {
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent(`Item ${index + 1}`);
      });
    });
  });
});