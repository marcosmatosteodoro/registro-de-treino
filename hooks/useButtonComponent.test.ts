import { renderHook } from '@testing-library/react';
import { useButtonComponent } from './useButtonComponent';
import { ButtonGrey, ButtonOrange, ButtonPurple } from '@/components';

// Mock dos componentes de botão
jest.mock('@/components', () => ({
  ButtonGrey: 'ButtonGrey',
  ButtonOrange: 'ButtonOrange',
  ButtonPurple: 'ButtonPurple',
}));

describe('useButtonComponent', () => {
  let hookResult: ReturnType<typeof useButtonComponent>;

  beforeEach(() => {
    const { result } = renderHook(() => useButtonComponent());
    hookResult = result.current;
  });

  describe('getButtonComponent', () => {
    it('deve retornar ButtonOrange para index 0', () => {
      const component = hookResult.getButtonComponent(0);
      expect(component).toBe(ButtonOrange);
    });

    it('deve retornar ButtonPurple para index 1', () => {
      const component = hookResult.getButtonComponent(1);
      expect(component).toBe(ButtonPurple);
    });

    it('deve retornar ButtonGrey para index 2 (default)', () => {
      const component = hookResult.getButtonComponent(2);
      expect(component).toBe(ButtonGrey);
    });

    it('deve retornar ButtonGrey para index 3 (default)', () => {
      const component = hookResult.getButtonComponent(3);
      expect(component).toBe(ButtonGrey);
    });

    it('deve retornar ButtonGrey para index negativo (default)', () => {
      const component = hookResult.getButtonComponent(-1);
      expect(component).toBe(ButtonGrey);
    });

    it('deve retornar ButtonGrey para index muito grande (default)', () => {
      const component = hookResult.getButtonComponent(999);
      expect(component).toBe(ButtonGrey);
    });

    it('deve retornar ButtonGrey para index 0.5 (default - número decimal)', () => {
      const component = hookResult.getButtonComponent(0.5);
      expect(component).toBe(ButtonGrey);
    });
  });

  describe('estrutura do hook', () => {
    it('deve retornar um objeto com getButtonComponent', () => {
      expect(hookResult).toHaveProperty('getButtonComponent');
      expect(typeof hookResult.getButtonComponent).toBe('function');
    });

    it('deve retornar o mesmo resultado em múltiplas chamadas', () => {
      const { result: result1 } = renderHook(() => useButtonComponent());
      const { result: result2 } = renderHook(() => useButtonComponent());
      
      expect(result1.current.getButtonComponent(0)).toBe(result2.current.getButtonComponent(0));
      expect(result1.current.getButtonComponent(1)).toBe(result2.current.getButtonComponent(1));
      expect(result1.current.getButtonComponent(2)).toBe(result2.current.getButtonComponent(2));
    });
  });

  describe('casos extremos', () => {
    it('deve funcionar com NaN', () => {
      const component = hookResult.getButtonComponent(NaN);
      expect(component).toBe(ButtonGrey);
    });

    it('deve funcionar com Infinity', () => {
      const component = hookResult.getButtonComponent(Infinity);
      expect(component).toBe(ButtonGrey);
    });

    it('deve funcionar com -Infinity', () => {
      const component = hookResult.getButtonComponent(-Infinity);
      expect(component).toBe(ButtonGrey);
    });
  });

  describe('todos os casos válidos', () => {
    const testCases = [
      { index: 0, expected: 'ButtonOrange', component: ButtonOrange },
      { index: 1, expected: 'ButtonPurple', component: ButtonPurple },
      { index: 2, expected: 'ButtonGrey', component: ButtonGrey },
      { index: 5, expected: 'ButtonGrey', component: ButtonGrey },
      { index: -1, expected: 'ButtonGrey', component: ButtonGrey },
    ];

    testCases.forEach(({ index, expected, component }) => {
      it(`deve retornar ${expected} para index ${index}`, () => {
        const result = hookResult.getButtonComponent(index);
        expect(result).toBe(component);
      });
    });
  });
});