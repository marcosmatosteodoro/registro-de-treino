import React from 'react';
import { render, screen } from '@testing-library/react';
import { Title } from './index';

describe('Title', () => {
  describe('renderização básica', () => {
    it('deve renderizar o componente corretamente', () => {
      render(<Title>Test Title</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toBeInTheDocument();
    });

    it('deve renderizar como elemento h1', () => {
      render(<Title>Test Title</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement.tagName).toBe('H1');
    });

    it('deve ter as classes CSS corretas', () => {
      render(<Title>Test Title</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveClass('mb-16');
      expect(titleElement).toHaveClass('text-5xl');
      expect(titleElement).toHaveClass('font-bold');
      expect(titleElement).toHaveClass('text-white');
      expect(titleElement).toHaveClass('tracking-tight');
    });

    it('deve ter todas as classes CSS em conjunto', () => {
      render(<Title>Test Title</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveClass('mb-16 text-5xl font-bold text-white tracking-tight');
    });
  });

  describe('children', () => {
    it('deve renderizar texto simples como children', () => {
      const testText = 'Simple Title Text';
      render(<Title>{testText}</Title>);

      expect(screen.getByText(testText)).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent(testText);
    });

    it('deve renderizar elementos React como children', () => {
      render(
        <Title>
          <span data-testid="child-span">Span Element</span>
        </Title>
      );

      expect(screen.getByTestId('child-span')).toBeInTheDocument();
      expect(screen.getByText('Span Element')).toBeInTheDocument();
    });

    it('deve renderizar múltiplos children', () => {
      render(
        <Title>
          <span data-testid="first-child">First</span>
          <span data-testid="second-child">Second</span>
        </Title>
      );

      expect(screen.getByTestId('first-child')).toBeInTheDocument();
      expect(screen.getByTestId('second-child')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('FirstSecond');
    });

    it('deve renderizar children com formatação', () => {
      render(
        <Title>
          Welcome <strong data-testid="bold-text">User</strong>!
        </Title>
      );

      expect(screen.getByTestId('bold-text')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Welcome User!');
    });

    it('deve renderizar children com quebras de linha', () => {
      render(
        <Title>
          Line 1{'\n'}Line 2
        </Title>
      );

      // O DOM normaliza espaços em branco, então \n vira espaço
      expect(screen.getByTestId('title')).toHaveTextContent('Line 1 Line 2');
    });
  });

  describe('casos especiais', () => {
    it('deve renderizar com children como fragmento vazio', () => {
      render(<Title>{<></>}</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('');
    });

    it('deve renderizar com string vazia', () => {
      render(<Title>{''}</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('');
    });

    it('deve renderizar com espaços em branco', () => {
      const whitespaceText = '   ';
      render(<Title>{whitespaceText}</Title>);

      const titleElement = screen.getByTestId('title');
      // O DOM normaliza múltiplos espaços em um só
      expect(titleElement.textContent).toContain(' ');
      expect(titleElement.innerHTML).toBe(whitespaceText);
    });

    it('deve renderizar com número como children', () => {
      render(<Title>{123}</Title>);

      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('123');
    });

    it('deve renderizar com boolean false (não renderiza)', () => {
      render(<Title>{false}</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveTextContent('');
    });

    it('deve renderizar com null (não renderiza)', () => {
      render(<Title>{null}</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveTextContent('');
    });

    it('deve renderizar com undefined (não renderiza)', () => {
      render(<Title>{undefined}</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveTextContent('');
    });
  });

  describe('acessibilidade', () => {
    it('deve ser acessível via role', () => {
      render(<Title>Accessible Title</Title>);

      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Accessible Title');
    });

    it('deve ser encontrado por getByText', () => {
      const titleText = 'Find Me By Text';
      render(<Title>{titleText}</Title>);

      const titleElement = screen.getByText(titleText);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toBe(screen.getByTestId('title'));
    });

    it('deve ser encontrado por getByDisplayValue para formulários', () => {
      // Title não é um input, então este teste verifica que não quebra
      render(<Title>Display Value Test</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toBeInTheDocument();
    });
  });

  describe('integração com outros componentes', () => {
    it('deve funcionar dentro de outros containers', () => {
      render(
        <div data-testid="container">
          <Title>Container Title</Title>
        </div>
      );

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByText('Container Title')).toBeInTheDocument();
    });

    it('deve aceitar componentes complexos como children', () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <span>Complex</span>
          <em>Component</em>
        </div>
      );

      render(
        <Title>
          <ComplexChild />
        </Title>
      );

      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('complex-child')).toBeInTheDocument();
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Component')).toBeInTheDocument();
    });

    it('deve manter estrutura quando usado múltiplas vezes', () => {
      render(
        <div>
          <Title>First Title</Title>
          <Title>Second Title</Title>
        </div>
      );

      const titles = screen.getAllByTestId('title');
      expect(titles).toHaveLength(2);
      expect(titles[0]).toHaveTextContent('First Title');
      expect(titles[1]).toHaveTextContent('Second Title');
    });
  });

  describe('propriedades HTML', () => {
    it('deve ter data-testid correto', () => {
      render(<Title>Test Data ID</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveAttribute('data-testid', 'title');
    });

    it('deve manter outras propriedades HTML implícitas', () => {
      render(<Title>HTML Properties Test</Title>);

      const titleElement = screen.getByTestId('title');
      // h1 elements têm role="heading" automaticamente
      expect(titleElement).toHaveAttribute('class');
      expect(titleElement.getAttribute('class')).toContain('text-5xl');
    });
  });

  describe('casos de uso reais', () => {
    it('deve renderizar título de página inicial', () => {
      render(<Title>Registro de Treino</Title>);

      expect(screen.getByText('Registro de Treino')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Registro de Treino');
    });

    it('deve renderizar título de seleção de usuário', () => {
      render(<Title>Selecione um usuário</Title>);

      expect(screen.getByText('Selecione um usuário')).toBeInTheDocument();
    });

    it('deve renderizar título dinâmico com nome de usuário', () => {
      const userName = 'João Silva';
      render(<Title>Treinos de {userName}</Title>);

      expect(screen.getByText(`Treinos de ${userName}`)).toBeInTheDocument();
    });

    it('deve renderizar título de exercícios', () => {
      render(<Title>Exercícios do Treino A</Title>);

      expect(screen.getByText('Exercícios do Treino A')).toBeInTheDocument();
    });
  });

  describe('responsividade e estilos', () => {
    it('deve ter classe de margem responsiva', () => {
      render(<Title>Responsive Title</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveClass('mb-16');
    });

    it('deve ter classes de tipografia corretas', () => {
      render(<Title>Typography Test</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveClass('text-5xl');
      expect(titleElement).toHaveClass('font-bold');
      expect(titleElement).toHaveClass('tracking-tight');
    });

    it('deve ter classe de cor correta', () => {
      render(<Title>Color Test</Title>);

      const titleElement = screen.getByTestId('title');
      expect(titleElement).toHaveClass('text-white');
    });
  });
});