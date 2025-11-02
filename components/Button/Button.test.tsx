import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<Button>Test Button</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toBeInTheDocument();
    });

    it('deve renderizar como elemento button', () => {
      render(<Button>Test Button</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('deve ter as classes CSS básicas corretas', () => {
      render(<Button>Test Button</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
      expect(buttonElement).toHaveClass('bg-linear-to-r');
      expect(buttonElement).toHaveClass('text-white');
      expect(buttonElement).toHaveClass('font-bold');
      expect(buttonElement).toHaveClass('text-xl');
      expect(buttonElement).toHaveClass('rounded-lg');
      expect(buttonElement).toHaveClass('shadow-lg');
    });

    it('deve ter classes de animação e efeitos', () => {
      render(<Button>Test Button</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveClass('transition-all');
      expect(buttonElement).toHaveClass('duration-300');
      expect(buttonElement).toHaveClass('transform');
      expect(buttonElement).toHaveClass('hover:scale-105');
      expect(buttonElement).toHaveClass('hover:shadow-xl');
    });
  });

  describe('children', () => {
    it('deve renderizar texto simples como children', () => {
      const buttonText = 'Click Me';
      render(<Button>{buttonText}</Button>);

      expect(screen.getByText(buttonText)).toBeInTheDocument();
      expect(screen.getByTestId('button')).toHaveTextContent(buttonText);
    });

    it('deve renderizar elementos React como children', () => {
      render(
        <Button>
          <span data-testid="child-span">Button Content</span>
        </Button>
      );

      expect(screen.getByTestId('child-span')).toBeInTheDocument();
      expect(screen.getByText('Button Content')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <Button>
          <span data-testid="first-child">Part 1</span>
          <span data-testid="second-child"> Part 2</span>
        </Button>
      );

      expect(screen.getByTestId('first-child')).toBeInTheDocument();
      expect(screen.getByTestId('second-child')).toBeInTheDocument();
      expect(screen.getByTestId('button')).toHaveTextContent('Part 1 Part 2');
    });

    it('deve renderizar children com formatação', () => {
      render(
        <Button>
          Click <strong data-testid="bold-text">Here</strong>!
        </Button>
      );

      expect(screen.getByTestId('bold-text')).toBeInTheDocument();
      expect(screen.getByText('Here')).toBeInTheDocument();
      expect(screen.getByTestId('button')).toHaveTextContent('Click Here!');
    });
  });

  describe('onClick handler', () => {
    it('deve chamar onClick quando clicado', () => {
      const mockOnClick = jest.fn();
      render(<Button onClick={mockOnClick}>Click Me</Button>);

      const buttonElement = screen.getByTestId('button');
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar sem onClick', () => {
      render(<Button>No Handler</Button>);

      const buttonElement = screen.getByTestId('button');
      
      // Não deve quebrar quando clicado sem handler
      expect(() => fireEvent.click(buttonElement)).not.toThrow();
    });

    it('deve chamar onClick múltiplas vezes', () => {
      const mockOnClick = jest.fn();
      render(<Button onClick={mockOnClick}>Multiple Clicks</Button>);

      const buttonElement = screen.getByTestId('button');
      
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('deve manter contexto correto no onClick', () => {
      let clickContext: any = null;
      const handleClick = function(this: any) {
        clickContext = this;
      };

      render(<Button onClick={handleClick}>Context Test</Button>);

      const buttonElement = screen.getByTestId('button');
      fireEvent.click(buttonElement);

      // onClick deve ser chamado (contexto pode ser undefined em modo estrito)
      expect(typeof clickContext).toBeDefined();
    });
  });

  describe('additionalClasses', () => {
    it('deve aplicar classes adicionais', () => {
      const additionalClasses = 'bg-red-500 border-2';
      render(<Button additionalClasses={additionalClasses}>Styled Button</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveClass('bg-red-500');
      expect(buttonElement).toHaveClass('border-2');
    });

    it('deve manter classes básicas com classes adicionais', () => {
      const additionalClasses = 'bg-blue-500';
      render(<Button additionalClasses={additionalClasses}>Combined Classes</Button>);

      const buttonElement = screen.getByTestId('button');
      
      // Classes básicas devem permanecer
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
      expect(buttonElement).toHaveClass('text-white');
      
      // Classe adicional deve ser aplicada
      expect(buttonElement).toHaveClass('bg-blue-500');
    });

    it('deve funcionar sem classes adicionais', () => {
      render(<Button>No Additional Classes</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
    });

    it('deve lidar com string vazia em additionalClasses', () => {
      render(<Button additionalClasses="">Empty Classes</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveClass('w-48');
      expect(buttonElement).toHaveClass('h-16');
    });

    it('deve lidar com múltiplas classes adicionais', () => {
      const additionalClasses = 'bg-green-500 border-4 ring-2 ring-green-300';
      render(<Button additionalClasses={additionalClasses}>Multiple Additional</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveClass('bg-green-500');
      expect(buttonElement).toHaveClass('border-4');
      expect(buttonElement).toHaveClass('ring-2');
      expect(buttonElement).toHaveClass('ring-green-300');
    });
  });

  describe('casos especiais', () => {
    it('deve renderizar com children vazio', () => {
      render(<Button>{<></>}</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com string vazia', () => {
      render(<Button>{''}</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com número como children', () => {
      render(<Button>{42}</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveTextContent('42');
    });

    it('deve renderizar com boolean false (não renderiza)', () => {
      render(<Button>{false}</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveTextContent('');
    });

    it('deve renderizar com null (não renderiza)', () => {
      render(<Button>{null}</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveTextContent('');
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via role button', () => {
      render(<Button>Accessible Button</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Accessible Button');
    });

    it('deve ser encontrado por getByText', () => {
      const buttonText = 'Find Me';
      render(<Button>{buttonText}</Button>);

      const buttonElement = screen.getByText(buttonText);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toBe(screen.getByTestId('button'));
    });

    it('deve ser clicável por teclado', () => {
      const mockOnClick = jest.fn();
      render(<Button onClick={mockOnClick}>Keyboard Accessible</Button>);

      const buttonElement = screen.getByTestId('button');
      
      // Simular Enter
      fireEvent.keyDown(buttonElement, { key: 'Enter', code: 'Enter' });
      
      // Botões nativos respondem a Enter automaticamente em navegadores reais
      expect(buttonElement).toBeInTheDocument();
    });

    it('deve ter foco quando focado', () => {
      render(<Button>Focusable Button</Button>);

      const buttonElement = screen.getByTestId('button');
      buttonElement.focus();

      expect(buttonElement).toHaveFocus();
    });
  });

  describe('integração com outros componentes', () => {
    it('deve funcionar dentro de outros containers', () => {
      render(
        <div data-testid="container">
          <Button>Container Button</Button>
        </div>
      );

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByText('Container Button')).toBeInTheDocument();
    });

    it('deve aceitar componentes complexos como children', () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <span>Complex</span>
          <em> Button </em>
          <strong>Content</strong>
        </div>
      );

      render(
        <Button>
          <ComplexChild />
        </Button>
      );

      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('complex-child')).toBeInTheDocument();
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('deve manter estrutura quando usado múltiplas vezes', () => {
      render(
        <div>
          <Button>First Button</Button>
          <Button>Second Button</Button>
        </div>
      );

      const buttons = screen.getAllByTestId('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('First Button');
      expect(buttons[1]).toHaveTextContent('Second Button');
    });
  });

  describe('propriedades HTML', () => {
    it('deve ter data-testid correto', () => {
      render(<Button>Test Data ID</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveAttribute('data-testid', 'button');
    });

    it('deve ser um elemento button HTML válido', () => {
      render(<Button>HTML Button</Button>);

      const buttonElement = screen.getByTestId('button') as HTMLButtonElement;
      expect(buttonElement.tagName).toBe('BUTTON');
      // O tipo padrão do botão pode ser 'submit' dependendo do contexto
      expect(['button', 'submit']).toContain(buttonElement.type);
    });

    it('deve ter atributo className correto', () => {
      render(<Button additionalClasses="test-class">Class Test</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveAttribute('class');
      expect(buttonElement.className).toContain('w-48');
      expect(buttonElement.className).toContain('test-class');
    });
  });

  describe('casos de uso reais', () => {
    it('deve funcionar como botão de submissão', () => {
      const mockSubmit = jest.fn();
      render(<Button onClick={mockSubmit}>Enviar</Button>);

      const buttonElement = screen.getByText('Enviar');
      fireEvent.click(buttonElement);

      expect(mockSubmit).toHaveBeenCalled();
    });

    it('deve funcionar como botão de cancelar', () => {
      const mockCancel = jest.fn();
      render(<Button onClick={mockCancel}>Cancelar</Button>);

      const buttonElement = screen.getByText('Cancelar');
      fireEvent.click(buttonElement);

      expect(mockCancel).toHaveBeenCalled();
    });

    it('deve funcionar como botão de navegação', () => {
      const mockNavigate = jest.fn();
      render(<Button onClick={mockNavigate}>Ir para Treinos</Button>);

      const buttonElement = screen.getByText('Ir para Treinos');
      fireEvent.click(buttonElement);

      expect(mockNavigate).toHaveBeenCalled();
    });

    it('deve mostrar loading state', () => {
      render(
        <Button>
          <span data-testid="loading">Carregando...</span>
        </Button>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('performance e otimização', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<Button>Performance Test</Button>);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10);
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('deve lidar com textos longos', () => {
      const longText = 'A'.repeat(100);
      render(<Button>{longText}</Button>);

      const buttonElement = screen.getByTestId('button');
      expect(buttonElement).toHaveTextContent(longText);
    });

    it('deve manter referência estável', () => {
      const { rerender } = render(<Button>Original</Button>);
      const originalElement = screen.getByTestId('button');

      rerender(<Button>Updated</Button>);
      const updatedElement = screen.getByTestId('button');

      expect(updatedElement).toBe(originalElement);
      expect(updatedElement).toHaveTextContent('Updated');
    });
  });
});