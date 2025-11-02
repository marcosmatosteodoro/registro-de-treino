import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFoundText } from './index';

describe('NotFoundText', () => {
  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<NotFoundText>Test Message</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toBeInTheDocument();
    });

    it('deve renderizar como elemento span', () => {
      render(<NotFoundText>Test Message</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement.tagName).toBe('SPAN');
    });

    it('deve ter as classes CSS corretas', () => {
      render(<NotFoundText>Test Message</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveClass('text-white');
      expect(notFoundElement).toHaveClass('text-xl');
    });

    it('deve ter todas as classes CSS em conjunto', () => {
      render(<NotFoundText>Test Message</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveClass('text-white text-xl');
    });
  });

  describe('children', () => {
    it('deve renderizar texto simples como children', () => {
      const testText = 'Nenhum resultado encontrado';
      render(<NotFoundText>{testText}</NotFoundText>);

      expect(screen.getByText(testText)).toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toHaveTextContent(testText);
    });

    it('deve renderizar elementos React como children', () => {
      render(
        <NotFoundText>
          <em data-testid="child-em">Não encontrado</em>
        </NotFoundText>
      );

      expect(screen.getByTestId('child-em')).toBeInTheDocument();
      expect(screen.getByText('Não encontrado')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <NotFoundText>
          <span data-testid="first-child">Nenhum</span>
          <span data-testid="second-child"> resultado</span>
        </NotFoundText>
      );

      expect(screen.getByTestId('first-child')).toBeInTheDocument();
      expect(screen.getByTestId('second-child')).toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toHaveTextContent('Nenhum resultado');
    });

    it('deve renderizar children com formatação', () => {
      render(
        <NotFoundText>
          Nenhum <strong data-testid="bold-text">resultado</strong> encontrado
        </NotFoundText>
      );

      expect(screen.getByTestId('bold-text')).toBeInTheDocument();
      expect(screen.getByText('resultado')).toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toHaveTextContent('Nenhum resultado encontrado');
    });

    it('deve renderizar children com quebras de linha', () => {
      render(
        <NotFoundText>
          Linha 1{'\n'}Linha 2
        </NotFoundText>
      );

      // O DOM normaliza espaços em branco, então \n vira espaço
      expect(screen.getByTestId('not-found-text')).toHaveTextContent('Linha 1 Linha 2');
    });
  });

  describe('casos especiais', () => {
    it('deve renderizar com children como fragmento vazio', () => {
      render(<NotFoundText>{<></>}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toBeInTheDocument();
      expect(notFoundElement).toHaveTextContent('');
    });

    it('deve renderizar com string vazia', () => {
      render(<NotFoundText>{''}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toBeInTheDocument();
      expect(notFoundElement).toHaveTextContent('');
    });

    it('deve renderizar com espaços em branco', () => {
      const whitespaceText = '   ';
      render(<NotFoundText>{whitespaceText}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement.textContent).toContain(' ');
      expect(notFoundElement.innerHTML).toBe(whitespaceText);
    });

    it('deve renderizar com número como children', () => {
      render(<NotFoundText>{0}</NotFoundText>);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toHaveTextContent('0');
    });

    it('deve renderizar com boolean false (não renderiza)', () => {
      render(<NotFoundText>{false}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveTextContent('');
    });

    it('deve renderizar com null (não renderiza)', () => {
      render(<NotFoundText>{null}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveTextContent('');
    });

    it('deve renderizar com undefined (não renderiza)', () => {
      render(<NotFoundText>{undefined}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveTextContent('');
    });
  });

  describe('acessibilidade', () => {
    it('deve ser encontrado por getByText', () => {
      const messageText = 'Mensagem não encontrada';
      render(<NotFoundText>{messageText}</NotFoundText>);

      const notFoundElement = screen.getByText(messageText);
      expect(notFoundElement).toBeInTheDocument();
      expect(notFoundElement).toBe(screen.getByTestId('not-found-text'));
    });

    it('deve manter texto legível para screen readers', () => {
      render(<NotFoundText>Conteúdo não encontrado</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveTextContent('Conteúdo não encontrado');
      expect(notFoundElement.textContent).toBe('Conteúdo não encontrado');
    });

    it('deve funcionar com aria-labels quando necessário', () => {
      render(
        <NotFoundText>
          <span aria-label="Nenhum resultado">❌</span>
        </NotFoundText>
      );

      const emojiElement = screen.getByLabelText('Nenhum resultado');
      expect(emojiElement).toBeInTheDocument();
    });
  });

  describe('integração com outros componentes', () => {
    it('deve funcionar dentro de outros containers', () => {
      render(
        <div data-testid="container">
          <NotFoundText>Resultado não encontrado</NotFoundText>
        </div>
      );

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
      expect(screen.getByText('Resultado não encontrado')).toBeInTheDocument();
    });

    it('deve aceitar componentes complexos como children', () => {
      const ComplexMessage = () => (
        <div data-testid="complex-message">
          <span>Nenhum</span>
          <em> resultado </em>
          <strong>encontrado</strong>
        </div>
      );

      render(
        <NotFoundText>
          <ComplexMessage />
        </NotFoundText>
      );

      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
      expect(screen.getByTestId('complex-message')).toBeInTheDocument();
      expect(screen.getByText('Nenhum')).toBeInTheDocument();
      expect(screen.getByText('resultado')).toBeInTheDocument();
      expect(screen.getByText('encontrado')).toBeInTheDocument();
    });

    it('deve manter estrutura quando usado múltiplas vezes', () => {
      render(
        <div>
          <NotFoundText>Primeira mensagem</NotFoundText>
          <NotFoundText>Segunda mensagem</NotFoundText>
        </div>
      );

      const notFoundElements = screen.getAllByTestId('not-found-text');
      expect(notFoundElements).toHaveLength(2);
      expect(notFoundElements[0]).toHaveTextContent('Primeira mensagem');
      expect(notFoundElements[1]).toHaveTextContent('Segunda mensagem');
    });
  });

  describe('propriedades HTML', () => {
    it('deve ter data-testid correto', () => {
      render(<NotFoundText>Test Data ID</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveAttribute('data-testid', 'not-found-text');
    });

    it('deve manter outras propriedades HTML implícitas', () => {
      render(<NotFoundText>HTML Properties Test</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveAttribute('class');
      expect(notFoundElement.getAttribute('class')).toContain('text-xl');
    });

    it('deve ser um elemento inline por padrão', () => {
      render(<NotFoundText>Inline Element</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement.tagName).toBe('SPAN');
      // Spans são elementos inline por padrão HTML
      expect(notFoundElement).toBeInTheDocument();
    });
  });

  describe('casos de uso reais', () => {
    it('deve renderizar mensagem de usuários não encontrados', () => {
      render(<NotFoundText>Nenhum usuário encontrado</NotFoundText>);

      expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
    });

    it('deve renderizar mensagem de treinos não encontrados', () => {
      render(<NotFoundText>Nenhum treino encontrado</NotFoundText>);

      expect(screen.getByText('Nenhum treino encontrado')).toBeInTheDocument();
    });

    it('deve renderizar mensagem de exercícios não encontrados', () => {
      render(<NotFoundText>Nenhum exercício encontrado</NotFoundText>);

      expect(screen.getByText('Nenhum exercício encontrado')).toBeInTheDocument();
    });

    it('deve renderizar mensagem genérica', () => {
      render(<NotFoundText>Nada para mostrar aqui</NotFoundText>);

      expect(screen.getByText('Nada para mostrar aqui')).toBeInTheDocument();
    });

    it('deve renderizar mensagem com emoji', () => {
      render(<NotFoundText>😔 Nenhum resultado encontrado</NotFoundText>);

      expect(screen.getByText('😔 Nenhum resultado encontrado')).toBeInTheDocument();
    });

    it('deve renderizar mensagem dinâmica', () => {
      const searchTerm = 'João';
      render(<NotFoundText>Nenhum resultado para "{searchTerm}"</NotFoundText>);

      expect(screen.getByText(`Nenhum resultado para "${searchTerm}"`)).toBeInTheDocument();
    });
  });

  describe('responsividade e estilos', () => {
    it('deve ter classe de cor correta', () => {
      render(<NotFoundText>Color Test</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveClass('text-white');
    });

    it('deve ter classe de tamanho de fonte correta', () => {
      render(<NotFoundText>Font Size Test</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveClass('text-xl');
    });

    it('deve manter estilos consistentes', () => {
      render(<NotFoundText>Consistent Styles</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveClass('text-white text-xl');
    });
  });

  describe('performance e otimização', () => {
    it('deve renderizar rapidamente com texto simples', () => {
      const startTime = performance.now();
      render(<NotFoundText>Performance Test</NotFoundText>);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Menos de 10ms
      expect(screen.getByTestId('not-found-text')).toBeInTheDocument();
    });

    it('deve lidar com textos longos', () => {
      const longText = 'A'.repeat(1000);
      render(<NotFoundText>{longText}</NotFoundText>);

      const notFoundElement = screen.getByTestId('not-found-text');
      expect(notFoundElement).toHaveTextContent(longText);
    });

    it('deve manter referência estável', () => {
      const { rerender } = render(<NotFoundText>Original Text</NotFoundText>);
      const originalElement = screen.getByTestId('not-found-text');

      rerender(<NotFoundText>Updated Text</NotFoundText>);
      const updatedElement = screen.getByTestId('not-found-text');

      // Deve ser o mesmo elemento DOM, apenas com conteúdo atualizado
      expect(updatedElement).toBe(originalElement);
      expect(updatedElement).toHaveTextContent('Updated Text');
    });
  });
});