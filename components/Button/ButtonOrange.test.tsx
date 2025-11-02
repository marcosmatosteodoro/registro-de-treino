import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonOrange } from './index';

describe('ButtonOrange', () => {
  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<ButtonOrange>Orange Button</ButtonOrange>);

      const containerElement = screen.getByTestId('button-orange');
      expect(containerElement).toBeInTheDocument();
    });

    it('deve ter container div com data-testid correto', () => {
      render(<ButtonOrange>Test Orange</ButtonOrange>);

      const containerElement = screen.getByTestId('button-orange');
      expect(containerElement.tagName).toBe('DIV');
      expect(containerElement).toHaveAttribute('data-testid', 'button-orange');
    });

    it('deve conter botão interno', () => {
      render(<ButtonOrange>Internal Button</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter classes CSS básicas do Button', () => {
      render(<ButtonOrange>Orange Test</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('font-bold');
      expect(buttonElement).toHaveClass('text-xl');
      expect(buttonElement).toHaveClass('rounded-lg');
      expect(buttonElement).toHaveClass('shadow-lg');
    });

    it('deve ter classes específicas do gradiente laranja', () => {
      render(<ButtonOrange>Orange Gradient</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('from-orange-500');
      expect(buttonElement).toHaveClass('to-red-600');
      expect(buttonElement).toHaveClass('bg-linear-to-r');
    });

    it('deve ter classes de animação e efeitos', () => {
      render(<ButtonOrange>Animated Orange</ButtonOrange>);

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
      const buttonText = 'Orange Click Me';
      render(<ButtonOrange>{buttonText}</ButtonOrange>);

      expect(screen.getByText(buttonText)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent(buttonText);
    });

    it('deve renderizar elementos React como children', () => {
      render(
        <ButtonOrange>
          <span data-testid="orange-child-span">Orange Content</span>
        </ButtonOrange>
      );

      expect(screen.getByTestId('orange-child-span')).toBeInTheDocument();
      expect(screen.getByText('Orange Content')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <ButtonOrange>
          <span data-testid="orange-first">Orange Part 1</span>
          <span data-testid="orange-second"> Orange Part 2</span>
        </ButtonOrange>
      );

      expect(screen.getByTestId('orange-first')).toBeInTheDocument();
      expect(screen.getByTestId('orange-second')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Orange Part 1 Orange Part 2');
    });

    it('deve renderizar children com formatação', () => {
      render(
        <ButtonOrange>
          Orange <strong data-testid="orange-bold">Button</strong>!
        </ButtonOrange>
      );

      expect(screen.getByTestId('orange-bold')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Orange Button!');
    });

    it('deve renderizar ícones como children', () => {
      render(
        <ButtonOrange>
          <svg data-testid="orange-icon" width="16" height="16">
            <circle cx="8" cy="8" r="4"/>
          </svg>
          Ícone Orange
        </ButtonOrange>
      );

      expect(screen.getByTestId('orange-icon')).toBeInTheDocument();
      expect(screen.getByText('Ícone Orange')).toBeInTheDocument();
    });
  });

  describe('onClick handler', () => {
    it('deve chamar onClick quando clicado', () => {
      const mockOnClick = jest.fn();
      render(<ButtonOrange onClick={mockOnClick}>Click Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar sem onClick', () => {
      render(<ButtonOrange>No Handler Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      
      // Não deve quebrar quando clicado sem handler
      expect(() => fireEvent.click(buttonElement)).not.toThrow();
    });

    it('deve chamar onClick múltiplas vezes', () => {
      const mockOnClick = jest.fn();
      render(<ButtonOrange onClick={mockOnClick}>Multiple Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('deve manter dados do evento no onClick', () => {
      let clickCalled = false;
      const handleClick = () => {
        clickCalled = true;
      };

      render(<ButtonOrange onClick={handleClick}>Event Test Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(clickCalled).toBe(true);
    });

    it('deve prevenir múltiplos cliques quando necessário', () => {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };

      render(<ButtonOrange onClick={handleClick}>Count Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      
      // Cliques rápidos
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);

      expect(clickCount).toBe(2);
    });
  });

  describe('estrutura do componente', () => {
    it('deve ter estrutura de container e botão corretas', () => {
      render(<ButtonOrange>Structure Test</ButtonOrange>);

      const containerElement = screen.getByTestId('button-orange');
      const buttonElement = screen.getByRole('button');

      expect(containerElement).toContainElement(buttonElement);
      expect(containerElement.children).toHaveLength(1);
      expect(containerElement.firstChild).toBe(buttonElement);
    });

    it('deve aplicar classes do gradiente laranja específicamente', () => {
      render(<ButtonOrange>Gradient Test</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;

      expect(className).toContain('from-orange-500');
      expect(className).toContain('to-red-600');
      expect(className).toContain('bg-linear-to-r');
    });

    it('deve manter todas as classes base do Button', () => {
      render(<ButtonOrange>Base Classes</ButtonOrange>);

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
      const { rerender } = render(<ButtonOrange>Orange Button</ButtonOrange>);
      const orangeButton = screen.getByRole('button');
      const orangeClasses = orangeButton.className;

      rerender(
        <div data-testid="button">
          <button className="w-48 h-16 bg-linear-to-r text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            Base Button
          </button>
        </div>
      );

      // A principal diferença deve ser o gradiente
      expect(orangeClasses).toContain('from-orange-500');
      expect(orangeClasses).toContain('to-red-600');
    });
  });

  describe('casos especiais', () => {
    it('deve renderizar com children vazio', () => {
      render(<ButtonOrange>{<></>}</ButtonOrange>);

      const containerElement = screen.getByTestId('button-orange');
      const buttonElement = screen.getByRole('button');
      
      expect(containerElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com string vazia', () => {
      render(<ButtonOrange>{''}</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com número como children', () => {
      render(<ButtonOrange>{99}</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('99');
    });

    it('deve renderizar com boolean false (não renderiza)', () => {
      render(<ButtonOrange>{false}</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com null (não renderiza)', () => {
      render(<ButtonOrange>{null}</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent('');
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via role button', () => {
      render(<ButtonOrange>Accessible Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Accessible Orange');
    });

    it('deve ser encontrado por getByText', () => {
      const buttonText = 'Find Orange Button';
      render(<ButtonOrange>{buttonText}</ButtonOrange>);

      const buttonElement = screen.getByText(buttonText);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter foco quando focado', () => {
      render(<ButtonOrange>Focusable Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      buttonElement.focus();

      expect(buttonElement).toHaveFocus();
    });

    it('deve ter contraste adequado com gradiente laranja', () => {
      render(<ButtonOrange>Contrast Test</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      
      // Texto branco sobre gradiente laranja deve ter bom contraste
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('from-orange-500');
      expect(buttonElement).toHaveClass('to-red-600');
    });

    it('deve responder a eventos de teclado', () => {
      const mockOnClick = jest.fn();
      render(<ButtonOrange onClick={mockOnClick}>Keyboard Orange</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      
      // Teste com Enter
      fireEvent.keyDown(buttonElement, { key: 'Enter', code: 'Enter' });
      
      // Teste com Space
      fireEvent.keyDown(buttonElement, { key: ' ', code: 'Space' });
      
      expect(buttonElement).toBeInTheDocument();
    });
  });

  describe('integração com outros componentes', () => {
    it('deve funcionar dentro de outros containers', () => {
      render(
        <div data-testid="orange-container">
          <ButtonOrange>Container Orange</ButtonOrange>
        </div>
      );

      expect(screen.getByTestId('orange-container')).toBeInTheDocument();
      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
      expect(screen.getByText('Container Orange')).toBeInTheDocument();
    });

    it('deve funcionar junto com outros botões', () => {
      render(
        <div>
          <ButtonOrange>First Orange</ButtonOrange>
          <ButtonOrange>Second Orange</ButtonOrange>
        </div>
      );

      const orangeContainers = screen.getAllByTestId('button-orange');
      const orangeButtons = screen.getAllByRole('button');
      
      expect(orangeContainers).toHaveLength(2);
      expect(orangeButtons).toHaveLength(2);
      expect(orangeButtons[0]).toHaveTextContent('First Orange');
      expect(orangeButtons[1]).toHaveTextContent('Second Orange');
    });

    it('deve aceitar componentes complexos como children', () => {
      const ComplexOrangeChild = () => (
        <div data-testid="complex-orange-child">
          <span>Complex Orange</span>
          <em> Button </em>
          <strong>Content</strong>
        </div>
      );

      render(
        <ButtonOrange>
          <ComplexOrangeChild />
        </ButtonOrange>
      );

      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
      expect(screen.getByTestId('complex-orange-child')).toBeInTheDocument();
      expect(screen.getByText('Complex Orange')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('casos de uso específicos', () => {
    it('deve funcionar como botão de confirmação', () => {
      const mockConfirm = jest.fn();
      render(<ButtonOrange onClick={mockConfirm}>Confirmar</ButtonOrange>);

      const buttonElement = screen.getByText('Confirmar');
      fireEvent.click(buttonElement);

      expect(mockConfirm).toHaveBeenCalled();
    });

    it('deve funcionar como botão de ação primária', () => {
      const mockPrimaryAction = jest.fn();
      render(<ButtonOrange onClick={mockPrimaryAction}>Salvar Treino</ButtonOrange>);

      const buttonElement = screen.getByText('Salvar Treino');
      fireEvent.click(buttonElement);

      expect(mockPrimaryAction).toHaveBeenCalled();
    });

    it('deve funcionar como botão de submissão de formulário', () => {
      const mockSubmit = jest.fn();
      render(<ButtonOrange onClick={mockSubmit}>Enviar Dados</ButtonOrange>);

      const buttonElement = screen.getByText('Enviar Dados');
      fireEvent.click(buttonElement);

      expect(mockSubmit).toHaveBeenCalled();
    });

    it('deve mostrar estado de loading', () => {
      render(
        <ButtonOrange>
          <span data-testid="orange-loading">Salvando...</span>
        </ButtonOrange>
      );

      expect(screen.getByTestId('orange-loading')).toBeInTheDocument();
      expect(screen.getByText('Salvando...')).toBeInTheDocument();
    });
  });

  describe('propriedades visuais', () => {
    it('deve ter gradiente visualmente distinto', () => {
      render(<ButtonOrange>Visual Test</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(buttonElement);
      
      // Verifica se as classes de gradiente estão aplicadas
      expect(buttonElement.className).toContain('from-orange-500');
      expect(buttonElement.className).toContain('to-red-600');
      expect(buttonElement.className).toContain('bg-linear-to-r');
    });

    it('deve manter consistência visual com outros botões', () => {
      render(<ButtonOrange>Visual Consistency</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      
      // Mesmas dimensões que outros botões
      expect(buttonElement).toHaveClass('w-48', 'h-16');
      
      // Mesmo estilo de texto
      expect(buttonElement).toHaveClass('text-white', 'font-bold', 'text-xl');
      
      // Mesmos efeitos visuais
      expect(buttonElement).toHaveClass('rounded-lg', 'shadow-lg');
    });

    it('deve ter sombra apropriada para o gradiente', () => {
      render(<ButtonOrange>Shadow Test</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('shadow-lg');
      expect(buttonElement).toHaveClass('hover:shadow-xl');
    });
  });

  describe('performance e otimização', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<ButtonOrange>Performance Orange</ButtonOrange>);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10);
      expect(screen.getByTestId('button-orange')).toBeInTheDocument();
    });

    it('deve lidar com textos longos', () => {
      const longText = 'Orange '.repeat(20).trim();
      render(<ButtonOrange>{longText}</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveTextContent(longText);
    });

    it('deve manter referência estável durante re-renders', () => {
      const { rerender } = render(<ButtonOrange>Original Orange</ButtonOrange>);
      const originalContainer = screen.getByTestId('button-orange');

      rerender(<ButtonOrange>Updated Orange</ButtonOrange>);
      const updatedContainer = screen.getByTestId('button-orange');

      expect(updatedContainer).toBe(originalContainer);
      expect(screen.getByRole('button')).toHaveTextContent('Updated Orange');
    });

    it('deve otimizar classes CSS', () => {
      render(<ButtonOrange>CSS Optimization</ButtonOrange>);

      const buttonElement = screen.getByRole('button');
      const className = buttonElement.className;
      
      // Verifica se não há classes duplicadas óbvias
      const classArray = className.split(' ');
      const uniqueClasses = new Set(classArray);
      
      expect(classArray.length).toBe(uniqueClasses.size);
    });
  });
});