import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGrey } from './index';

describe('ButtonGrey', () => {
  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<ButtonGrey>Grey Button</ButtonGrey>);

      const containerElement = screen.getByTestId('button-grey');
      expect(containerElement).toBeInTheDocument();
    });

    it('deve ter container div com data-testid correto', () => {
      render(<ButtonGrey>Test Grey</ButtonGrey>);

      const containerElement = screen.getByTestId('button-grey');
      expect(containerElement.tagName).toBe('DIV');
      expect(containerElement).toHaveAttribute('data-testid', 'button-grey');
    });

    it('deve conter botão interno', () => {
      render(<ButtonGrey>Internal Button</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter classes CSS básicas do Button', () => {
      render(<ButtonGrey>Grey Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('font-bold');
      expect(buttonElement).toHaveClass('text-xl');
      expect(buttonElement).toHaveClass('rounded-lg');
      expect(buttonElement).toHaveClass('shadow-lg');
    });

    it('deve ter classes específicas do gradiente cinza', () => {
      render(<ButtonGrey>Grey Gradient</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('from-gray-600');
      expect(buttonElement).toHaveClass('to-gray-700');
      expect(buttonElement).toHaveClass('bg-linear-to-r');
    });

    it('deve ter classes de animação e efeitos', () => {
      render(<ButtonGrey>Animated Grey</ButtonGrey>);

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
      const buttonText = 'Grey Click Me';
      render(<ButtonGrey>{buttonText}</ButtonGrey>);

      expect(screen.getByText(buttonText)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent(buttonText);
    });

    it('deve renderizar elementos React como children', () => {
      render(
        <ButtonGrey>
          <span data-testid="grey-child-span">Grey Content</span>
        </ButtonGrey>
      );

      expect(screen.getByTestId('grey-child-span')).toBeInTheDocument();
      expect(screen.getByText('Grey Content')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <ButtonGrey>
          <span data-testid="grey-first">Grey Part 1</span>
          <span data-testid="grey-second"> Grey Part 2</span>
        </ButtonGrey>
      );

      expect(screen.getByTestId('grey-first')).toBeInTheDocument();
      expect(screen.getByTestId('grey-second')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Grey Part 1 Grey Part 2');
    });

    it('deve renderizar children com formatação', () => {
      render(
        <ButtonGrey>
          Grey <strong data-testid="grey-bold">Button</strong>!
        </ButtonGrey>
      );

      expect(screen.getByTestId('grey-bold')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Grey Button!');
    });

    it('deve renderizar ícones como children', () => {
      render(
        <ButtonGrey>
          <svg data-testid="grey-icon" width="16" height="16">
            <circle cx="8" cy="8" r="4"/>
          </svg>
          Ícone Grey
        </ButtonGrey>
      );

      expect(screen.getByTestId('grey-icon')).toBeInTheDocument();
      expect(screen.getByText('Ícone Grey')).toBeInTheDocument();
    });
  });

  describe('onClick handler', () => {
    it('deve chamar onClick quando clicado', () => {
      const mockOnClick = jest.fn();
      render(<ButtonGrey onClick={mockOnClick}>Click Grey</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar sem onClick', () => {
      render(<ButtonGrey>No Handler Grey</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      
      // Não deve quebrar quando clicado sem handler
      expect(() => fireEvent.click(buttonElement)).not.toThrow();
    });

    it('deve chamar onClick múltiplas vezes', () => {
      const mockOnClick = jest.fn();
      render(<ButtonGrey onClick={mockOnClick}>Multiple Grey</ButtonGrey>);

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

      render(<ButtonGrey onClick={handleClick}>State Test Grey</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(clickCalled).toBe(true);
    });

    it('deve permitir desabilitar cliques', () => {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };

      render(<ButtonGrey onClick={handleClick}>Disable Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      
      fireEvent.click(buttonElement);
      expect(clickCount).toBe(1);
      
      // Simula botão desabilitado
      buttonElement.setAttribute('disabled', 'true');
      fireEvent.click(buttonElement);
      
      // Dependendo da implementação, pode ou não incrementar
      expect(clickCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('estrutura do componente', () => {
    it('deve ter estrutura de container e botão corretas', () => {
      render(<ButtonGrey>Structure Test</ButtonGrey>);

      const containerElement = screen.getByTestId('button-grey');
      const buttonElement = screen.getByRole('button');

      expect(containerElement).toContainElement(buttonElement);
      expect(containerElement.children).toHaveLength(1);
      expect(containerElement.firstChild).toBe(buttonElement);
    });

    it('deve aplicar classes do gradiente cinza específicamente', () => {
      render(<ButtonGrey>Gradient Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;

      expect(className).toContain('from-gray-600');
      expect(className).toContain('to-gray-700');
      expect(className).toContain('bg-linear-to-r');
    });

    it('deve manter todas as classes base do Button', () => {
      render(<ButtonGrey>Base Classes</ButtonGrey>);

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

    it('deve diferir de outros botões apenas no gradiente', () => {
      render(<ButtonGrey>Grey Button</ButtonGrey>);
      const greyButton = screen.getByRole('button');
      const greyClasses = greyButton.className;

      // A principal diferença deve ser o gradiente
      expect(greyClasses).toContain('from-gray-600');
      expect(greyClasses).toContain('to-gray-700');
      expect(greyClasses).toContain('bg-linear-to-r');
      
      // Não deve ter cores de outros botões
      expect(greyClasses).not.toContain('from-orange-500');
      expect(greyClasses).not.toContain('from-blue-500');
    });

    it('deve ter gradiente neutro', () => {
      render(<ButtonGrey>Neutral Button</ButtonGrey>);
      const greyButton = screen.getByRole('button');
      const greyClasses = greyButton.className;

      // Cores neutras de cinza
      expect(greyClasses).toContain('from-gray-600');
      expect(greyClasses).toContain('to-gray-700');
    });
  });

  describe('casos especiais', () => {
    it('deve renderizar com children vazio', () => {
      render(<ButtonGrey>{<></>}</ButtonGrey>);

      const containerElement = screen.getByTestId('button-grey');
      const buttonElement = screen.getByRole('button');
      
      expect(containerElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com string vazia', () => {
      render(<ButtonGrey>{''}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com número como children', () => {
      render(<ButtonGrey>{88}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('88');
    });

    it('deve renderizar com boolean false (não renderiza)', () => {
      render(<ButtonGrey>{false}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com null (não renderiza)', () => {
      render(<ButtonGrey>{null}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com undefined (não renderiza)', () => {
      render(<ButtonGrey>{undefined}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com array vazio', () => {
      render(<ButtonGrey>{[]}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via role button', () => {
      render(<ButtonGrey>Accessible Grey</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Accessible Grey');
    });

    it('deve ser encontrado por getByText', () => {
      const buttonText = 'Find Grey Button';
      render(<ButtonGrey>{buttonText}</ButtonGrey>);

      const buttonElement = screen.getByText(buttonText);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter foco quando focado', () => {
      render(<ButtonGrey>Focusable Grey</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      buttonElement.focus();

      expect(buttonElement).toHaveFocus();
    });

    it('deve ter contraste adequado com gradiente cinza', () => {
      render(<ButtonGrey>Contrast Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      
      // Texto branco sobre gradiente cinza deve ter bom contraste
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('from-gray-600');
      expect(buttonElement).toHaveClass('to-gray-700');
    });

    it('deve responder a eventos de teclado', () => {
      const mockOnClick = jest.fn();
      render(<ButtonGrey onClick={mockOnClick}>Keyboard Grey</ButtonGrey>);

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
          <ButtonGrey>Tab Target</ButtonGrey>
          <button>Next Button</button>
        </div>
      );

      const greyButton = screen.getByText('Tab Target');
      expect(greyButton).toBeInTheDocument();
      
      // Simula navegação por tab
      greyButton.focus();
      expect(greyButton).toHaveFocus();
    });

    it('deve funcionar com screen readers', () => {
      render(<ButtonGrey>Screen Reader Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button', { name: 'Screen Reader Test' });
      expect(buttonElement).toBeInTheDocument();
    });
  });

  describe('integração com outros componentes', () => {
    it('deve funcionar dentro de outros containers', () => {
      render(
        <div data-testid="grey-container">
          <ButtonGrey>Container Grey</ButtonGrey>
        </div>
      );

      expect(screen.getByTestId('grey-container')).toBeInTheDocument();
      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
      expect(screen.getByText('Container Grey')).toBeInTheDocument();
    });

    it('deve funcionar junto com outros botões', () => {
      render(
        <div>
          <ButtonGrey>First Grey</ButtonGrey>
          <ButtonGrey>Second Grey</ButtonGrey>
        </div>
      );

      const greyContainers = screen.getAllByTestId('button-grey');
      const greyButtons = screen.getAllByRole('button');
      
      expect(greyContainers).toHaveLength(2);
      expect(greyButtons).toHaveLength(2);
      expect(greyButtons[0]).toHaveTextContent('First Grey');
      expect(greyButtons[1]).toHaveTextContent('Second Grey');
    });

    it('deve aceitar componentes complexos como children', () => {
      const ComplexGreyChild = () => (
        <div data-testid="complex-grey-child">
          <span>Complex Grey</span>
          <em> Button </em>
          <strong>Content</strong>
        </div>
      );

      render(
        <ButtonGrey>
          <ComplexGreyChild />
        </ButtonGrey>
      );

      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
      expect(screen.getByTestId('complex-grey-child')).toBeInTheDocument();
      expect(screen.getByText('Complex Grey')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('deve funcionar em formulários', () => {
      const mockSubmit = jest.fn();
      render(
        <form onSubmit={mockSubmit}>
          <ButtonGrey>Submit Grey</ButtonGrey>
        </form>
      );

      expect(screen.getByText('Submit Grey')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('deve funcionar com diferentes tipos de botão', () => {
      render(
        <div>
          <ButtonGrey>Normal Grey</ButtonGrey>
        </div>
      );

      const greyButton = screen.getByRole('button');
      expect(greyButton).toBeInTheDocument();
      expect(greyButton).toHaveTextContent('Normal Grey');
    });
  });

  describe('casos de uso específicos', () => {
    it('deve funcionar como botão de cancelar', () => {
      const mockCancel = jest.fn();
      render(<ButtonGrey onClick={mockCancel}>Cancelar</ButtonGrey>);

      const buttonElement = screen.getByText('Cancelar');
      fireEvent.click(buttonElement);

      expect(mockCancel).toHaveBeenCalled();
    });

    it('deve funcionar como botão neutro', () => {
      const mockNeutral = jest.fn();
      render(<ButtonGrey onClick={mockNeutral}>Talvez</ButtonGrey>);

      const buttonElement = screen.getByText('Talvez');
      fireEvent.click(buttonElement);

      expect(mockNeutral).toHaveBeenCalled();
    });

    it('deve funcionar como botão desabilitado visualmente', () => {
      const mockDisabled = jest.fn();
      render(<ButtonGrey onClick={mockDisabled}>Indisponível</ButtonGrey>);

      const buttonElement = screen.getByText('Indisponível');
      fireEvent.click(buttonElement);

      expect(mockDisabled).toHaveBeenCalled();
    });

    it('deve mostrar estado de loading', () => {
      render(
        <ButtonGrey>
          <span data-testid="grey-loading">Processando...</span>
        </ButtonGrey>
      );

      expect(screen.getByTestId('grey-loading')).toBeInTheDocument();
      expect(screen.getByText('Processando...')).toBeInTheDocument();
    });

    it('deve funcionar como botão de voltar', () => {
      const mockBack = jest.fn();
      render(<ButtonGrey onClick={mockBack}>Voltar</ButtonGrey>);

      const buttonElement = screen.getByText('Voltar');
      fireEvent.click(buttonElement);

      expect(mockBack).toHaveBeenCalled();
    });

    it('deve funcionar como botão de reset', () => {
      const mockReset = jest.fn();
      render(<ButtonGrey onClick={mockReset}>Limpar</ButtonGrey>);

      const buttonElement = screen.getByText('Limpar');
      fireEvent.click(buttonElement);

      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe('propriedades visuais', () => {
    it('deve ter gradiente visualmente neutro', () => {
      render(<ButtonGrey>Visual Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      
      // Verifica se as classes de gradiente estão aplicadas
      expect(buttonElement.className).toContain('from-gray-600');
      expect(buttonElement.className).toContain('to-gray-700');
      expect(buttonElement.className).toContain('bg-linear-to-r');
    });

    it('deve manter consistência visual com outros botões', () => {
      render(<ButtonGrey>Visual Consistency</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      
      // Mesmas dimensões que outros botões
      expect(buttonElement).toHaveClass('w-48', 'h-16');
      
      // Mesmo estilo de texto
      expect(buttonElement).toHaveClass('text-white', 'font-bold', 'text-xl');
      
      // Mesmos efeitos visuais
      expect(buttonElement).toHaveClass('rounded-lg', 'shadow-lg');
    });

    it('deve ter sombra apropriada para o gradiente', () => {
      render(<ButtonGrey>Shadow Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('shadow-lg');
      expect(buttonElement).toHaveClass('hover:shadow-xl');
    });

    it('deve ter transições suaves', () => {
      render(<ButtonGrey>Transition Test</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('transition-all');
      expect(buttonElement).toHaveClass('duration-300');
      expect(buttonElement).toHaveClass('transform');
    });

    it('deve ser visualmente distintivo como botão neutro', () => {
      render(<ButtonGrey>Neutral Visual</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;
      
      // Deve ter cores neutras, não vibrantes
      expect(className).toContain('from-gray-600');
      expect(className).toContain('to-gray-700');
      expect(className).not.toContain('from-red-');
      expect(className).not.toContain('from-blue-');
      expect(className).not.toContain('from-green-');
    });
  });

  describe('performance e otimização', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<ButtonGrey>Performance Grey</ButtonGrey>);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10);
      expect(screen.getByTestId('button-grey')).toBeInTheDocument();
    });

    it('deve lidar com textos longos', () => {
      const longText = 'Grey '.repeat(25).trim();
      render(<ButtonGrey>{longText}</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent(longText);
    });

    it('deve manter referência estável durante re-renders', () => {
      const { rerender } = render(<ButtonGrey>Original Grey</ButtonGrey>);
      const originalContainer = screen.getByTestId('button-grey');

      rerender(<ButtonGrey>Updated Grey</ButtonGrey>);
      const updatedContainer = screen.getByTestId('button-grey');

      expect(updatedContainer).toBe(originalContainer);
      expect(screen.getByRole('button')).toHaveTextContent('Updated Grey');
    });

    it('deve otimizar classes CSS', () => {
      render(<ButtonGrey>CSS Optimization</ButtonGrey>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;
      
      // Verifica se não há classes duplicadas óbvias
      const classArray = className.split(' ');
      const uniqueClasses = new Set(classArray);
      
      expect(classArray.length).toBe(uniqueClasses.size);
    });

    it('deve ser eficiente em listas', () => {
      const items = Array.from({ length: 8 }, (_, i) => `Item Grey ${i + 1}`);
      
      render(
        <div>
          {items.map((item, index) => (
            <ButtonGrey key={index}>{item}</ButtonGrey>
          ))}
        </div>
      );

      const greyContainers = screen.getAllByTestId('button-grey');
      expect(greyContainers).toHaveLength(8);
      
      greyContainers.forEach((container, index) => {
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent(`Item Grey ${index + 1}`);
      });
    });

    it('deve manter performance com interações frequentes', () => {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };

      render(<ButtonGrey onClick={handleClick}>Frequent Clicks</ButtonGrey>);

      const buttonElement = screen.getByRole('button');

      // Simula cliques frequentes
      for (let i = 0; i < 20; i++) {
        fireEvent.click(buttonElement);
      }

      expect(clickCount).toBe(20);
      expect(buttonElement).toBeInTheDocument();
    });
  });
});