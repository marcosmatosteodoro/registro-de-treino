import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { OfflineIndicator } from './index';

// Mock do navigator.onLine
Object.defineProperty(window.navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock dos event listeners
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
});

// Mock do setTimeout e clearTimeout
jest.useFakeTimers();

describe('OfflineIndicator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    
    // Reset navigator.onLine to true
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('renderização inicial', () => {
    it('deve não renderizar nada quando online e sem mensagem', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      render(<OfflineIndicator />);

      expect(screen.queryByTestId('offline-indicator-container')).not.toBeInTheDocument();
    });

    it('deve configurar event listeners no mount', () => {
      render(<OfflineIndicator />);

      expect(mockAddEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    });

    it('deve remover event listeners no unmount', () => {
      const { unmount } = render(<OfflineIndicator />);

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    });

    it('deve verificar status inicial do navigator.onLine', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      expect(screen.getByTestId('offline-message')).toBeInTheDocument();
    });

    it('deve inicializar com estado online quando navigator.onLine é true', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      render(<OfflineIndicator />);

      expect(screen.queryByTestId('offline-indicator-container')).not.toBeInTheDocument();
    });
  });

  describe('comportamento offline', () => {
    it('deve mostrar mensagem offline quando vai offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      render(<OfflineIndicator />);

      // Simula evento offline
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )[1];

      act(() => {
        offlineHandler();
      });

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
        expect(screen.getByTestId('offline-icon')).toBeInTheDocument();
        expect(screen.getByTestId('offline-text')).toBeInTheDocument();
      });
    });

    it('deve mostrar texto correto quando offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const offlineText = screen.getByTestId('offline-text');
        expect(offlineText).toHaveTextContent('Você está offline - Algumas funcionalidades podem estar limitadas');
      });
    });

    it('deve ter classes CSS corretas quando offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const container = screen.getByTestId('offline-indicator-container');
        const message = screen.getByTestId('offline-message');

        expect(container).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'transition-all', 'duration-300');
        expect(message).toHaveClass('px-4', 'py-2', 'text-center', 'text-sm', 'font-medium', 'bg-red-600', 'text-white');
      });
    });

    it('deve mostrar ícone de aviso quando offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const offlineIcon = screen.getByTestId('offline-icon');
        expect(offlineIcon).toBeInTheDocument();
        expect(offlineIcon).toHaveClass('w-4', 'h-4');
      });
    });
  });

  describe('comportamento online', () => {
    it('deve esconder mensagem quando volta online', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });

      // Simula evento online
      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];

      act(() => {
        onlineHandler();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('offline-indicator-container')).not.toBeInTheDocument();
      });
    });

    it('deve atualizar estado interno quando volta online', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];

      // Deve estar offline inicialmente
      await waitFor(() => {
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
      });

      act(() => {
        onlineHandler();
      });

      // Deve esconder quando volta online
      await waitFor(() => {
        expect(screen.queryByTestId('offline-message')).not.toBeInTheDocument();
      });
    });

    it('deve reagir corretamente a eventos online', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];

      // Verifica estado offline inicial
      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });

      // Simula volta online
      act(() => {
        onlineHandler();
      });

      // Deve esconder o indicador
      await waitFor(() => {
        expect(screen.queryByTestId('offline-indicator-container')).not.toBeInTheDocument();
      });
    });

    it('deve processar eventos online corretamente', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      render(<OfflineIndicator />);

      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];

      // Inicialmente online, não deve mostrar nada
      expect(screen.queryByTestId('offline-indicator-container')).not.toBeInTheDocument();

      // Chama handler online (mesmo já estando online)
      act(() => {
        onlineHandler();
      });

      // Ainda não deve mostrar nada
      expect(screen.queryByTestId('offline-indicator-container')).not.toBeInTheDocument();
    });
  });

  describe('auto-hide funcionalidade', () => {
    it('deve esconder mensagem offline após 5 segundos', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });

      // Avança o timer em 5 segundos
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // O elemento ainda estará lá, mas com classe -translate-y-full (escondido)
      await waitFor(() => {
        const container = screen.queryByTestId('offline-indicator-container');
        if (container) {
          expect(container).toHaveClass('-translate-y-full');
        }
      });
    });

    it('deve gerenciar timer corretamente quando muda estado', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { rerender } = render(<OfflineIndicator />);

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });

      // Avança parcialmente o timer
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Re-render para simular mudança
      rerender(<OfflineIndicator />);

      // Avança o restante do timer original
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Deve ainda estar visível pois o timer foi resetado
      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });
    });

    it('deve limpar timer quando componente é desmontado', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { unmount } = render(<OfflineIndicator />);

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });

      // Desmonta o componente
      unmount();

      // Avança os timers - não deve gerar erro
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Teste passa se não há erro
      expect(true).toBe(true);
    });

    it('deve limpar timer no unmount', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { unmount } = render(<OfflineIndicator />);

      unmount();

      // Timer deve ser limpo sem erro
      expect(() => {
        jest.advanceTimersByTime(5000);
      }).not.toThrow();
    });
  });

  describe('transições de estado', () => {
    it('deve alternar entre offline e online múltiplas vezes', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      render(<OfflineIndicator />);

      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )[1];
      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];

      // Vai offline
      act(() => {
        offlineHandler();
      });

      await waitFor(() => {
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
      });

      // Volta online
      act(() => {
        onlineHandler();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('offline-message')).not.toBeInTheDocument();
      });

      // Vai offline novamente
      act(() => {
        offlineHandler();
      });

      await waitFor(() => {
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
      });
    });

    it('deve manter estado correto durante transições rápidas', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      render(<OfflineIndicator />);

      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )[1];
      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];

      // Transições rápidas
      act(() => {
        offlineHandler();
        onlineHandler();
        offlineHandler();
      });

      await waitFor(() => {
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
      });
    });
  });

  describe('classes CSS e estilos', () => {
    it('deve ter classes de posicionamento corretas', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const container = screen.getByTestId('offline-indicator-container');
        expect(container).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
        expect(container).toHaveClass('transition-all', 'duration-300');
      });
    });

    it('deve ter estrutura de layout correta', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const container = screen.getByTestId('offline-indicator-container');
        const messageContent = screen.getByTestId('message-content');

        expect(container).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
        expect(messageContent).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2');
      });
    });

    it('deve ter estilos de transição corretos', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const container = screen.getByTestId('offline-indicator-container');
        expect(container).toHaveClass('transition-all', 'duration-300');
      });
    });
  });

  describe('acessibilidade', () => {
    it('deve ter elementos semânticamente corretos', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const offlineText = screen.getByTestId('offline-text');
        expect(offlineText).toBeInTheDocument();
        expect(offlineText.tagName).toBe('SPAN');
      });
    });

    it('deve ter ícones com atributos corretos', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const offlineIcon = screen.getByTestId('offline-icon');
        expect(offlineIcon).toHaveAttribute('fill', 'none');
        expect(offlineIcon).toHaveAttribute('stroke', 'currentColor');
        expect(offlineIcon).toHaveAttribute('viewBox', '0 0 24 24');
      });
    });

    it('deve ser visível para screen readers', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const offlineText = screen.getByTestId('offline-text');
        expect(offlineText).not.toHaveAttribute('aria-hidden');
      });
    });
  });

  describe('casos extremos', () => {
    it('deve lidar com navigator.onLine undefined', () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: undefined,
      });

      expect(() => {
        render(<OfflineIndicator />);
      }).not.toThrow();
    });

    it('deve funcionar mesmo sem support a eventos online/offline', () => {
      const originalAddEventListener = window.addEventListener;
      const originalRemoveEventListener = window.removeEventListener;

      window.addEventListener = jest.fn();
      window.removeEventListener = jest.fn();

      expect(() => {
        const { unmount } = render(<OfflineIndicator />);
        unmount();
      }).not.toThrow();

      window.addEventListener = originalAddEventListener;
      window.removeEventListener = originalRemoveEventListener;
    });

    it('deve lidar com múltiplos eventos offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )[1];

      // Dispara múltiplos eventos offline
      act(() => {
        offlineHandler();
        offlineHandler();
        offlineHandler();
      });

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
      });

      // Deve funcionar normalmente mesmo com múltiplos eventos
      expect(screen.getByTestId('offline-text')).toHaveTextContent('Você está offline - Algumas funcionalidades podem estar limitadas');
    });
  });

  describe('performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<OfflineIndicator />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('deve lidar com re-renders frequentes', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });

      const { rerender } = render(<OfflineIndicator />);

      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )[1];

      // Vai offline
      act(() => {
        offlineHandler();
      });

      // Múltiplos re-renders
      for (let i = 0; i < 5; i++) {
        rerender(<OfflineIndicator />);
      }

      // Deve estar funcionando corretamente
      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });
    });

    it('deve limpar recursos adequadamente', () => {
      const { unmount } = render(<OfflineIndicator />);

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('integração', () => {
    it('deve funcionar em conjunto com outros componentes', async () => {
      const TestWrapper = () => (
        <div>
          <div data-testid="other-component">Outro componente</div>
          <OfflineIndicator />
        </div>
      );

      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByTestId('other-component')).toBeInTheDocument();
        expect(screen.getByTestId('offline-indicator-container')).toBeInTheDocument();
      });
    });

    it('deve manter z-index correto para sobreposição', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      render(<OfflineIndicator />);

      await waitFor(() => {
        const container = screen.getByTestId('offline-indicator-container');
        expect(container).toHaveClass('z-50');
      });
    });
  });
});