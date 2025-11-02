import { GetExercicios } from './getExercicios';
import { Exercicio } from '../models/exercicio';

// Mock dos dados de exercícios
jest.mock('../data/exercicios.json', () => [
  {
    "id": 1,
    "nome": "ESTEIRA",
    "peso": "0",
    "series": 1,
    "repeticoes": 12,
    "treinoId": 1
  },
  {
    "id": 2,
    "nome": "ELEVACAO FRONTAL",
    "peso": "3kg",
    "series": 3,
    "repeticoes": 12,
    "treinoId": 1
  },
  {
    "id": 3,
    "nome": "CADEIRA ADUTORA",
    "peso": "40kg",
    "series": 4,
    "repeticoes": 12,
    "treinoId": 1
  }
]);

describe('GetExercicios', () => {
  describe('getAll', () => {
    test('deve retornar todos os exercícios como instâncias da classe Exercicio', () => {
      const exercicios = GetExercicios.getAll();

      expect(exercicios).toHaveLength(3);
      expect(exercicios[0]).toBeInstanceOf(Exercicio);
      expect(exercicios[1]).toBeInstanceOf(Exercicio);
      expect(exercicios[2]).toBeInstanceOf(Exercicio);
    });

    test('deve mapear corretamente os dados do primeiro exercício', () => {
      const exercicios = GetExercicios.getAll();
      const primeiroExercicio = exercicios[0];

      expect(primeiroExercicio.id).toBe(1);
      expect(primeiroExercicio.nome).toBe('ESTEIRA');
      expect(primeiroExercicio.peso).toBe('0');
      expect(primeiroExercicio.series).toBe(1);
      expect(primeiroExercicio.repeticoes).toBe(12);
      expect(primeiroExercicio.treinoId).toBe(1);
    });

    test('deve mapear corretamente os dados do segundo exercício', () => {
      const exercicios = GetExercicios.getAll();
      const segundoExercicio = exercicios[1];

      expect(segundoExercicio.id).toBe(2);
      expect(segundoExercicio.nome).toBe('ELEVACAO FRONTAL');
      expect(segundoExercicio.peso).toBe('3kg');
      expect(segundoExercicio.series).toBe(3);
      expect(segundoExercicio.repeticoes).toBe(12);
      expect(segundoExercicio.treinoId).toBe(1);
    });

    test('deve mapear corretamente os dados do terceiro exercício', () => {
      const exercicios = GetExercicios.getAll();
      const terceiroExercicio = exercicios[2];

      expect(terceiroExercicio.id).toBe(3);
      expect(terceiroExercicio.nome).toBe('CADEIRA ADUTORA');
      expect(terceiroExercicio.peso).toBe('40kg');
      expect(terceiroExercicio.series).toBe(4);
      expect(terceiroExercicio.repeticoes).toBe(12);
      expect(terceiroExercicio.treinoId).toBe(1);
    });

    test('deve retornar array não vazio', () => {
      const exercicios = GetExercicios.getAll();
      expect(exercicios.length).toBeGreaterThan(0);
    });

    test('deve retornar exercícios com propriedades obrigatórias', () => {
      const exercicios = GetExercicios.getAll();
      
      exercicios.forEach(exercicio => {
        expect(exercicio).toHaveProperty('id');
        expect(exercicio).toHaveProperty('nome');
        expect(exercicio).toHaveProperty('peso');
        expect(exercicio).toHaveProperty('series');
        expect(exercicio).toHaveProperty('repeticoes');
        expect(exercicio).toHaveProperty('treinoId');
      });
    });

    test('deve retornar exercícios com tipos corretos', () => {
      const exercicios = GetExercicios.getAll();
      
      exercicios.forEach(exercicio => {
        expect(typeof exercicio.id).toBe('number');
        expect(typeof exercicio.nome).toBe('string');
        expect(typeof exercicio.peso).toBe('string');
        expect(typeof exercicio.series).toBe('number');
        expect(typeof exercicio.repeticoes).toBe('number');
        expect(typeof exercicio.treinoId).toBe('number');
      });
    });

    test('deve retornar exercícios com IDs únicos', () => {
      const exercicios = GetExercicios.getAll();
      const ids = exercicios.map(ex => ex.id);
      const idsUnicos = [...new Set(ids)];
      
      expect(ids.length).toBe(idsUnicos.length);
    });

    test('deve retornar exercícios com nomes não vazios', () => {
      const exercicios = GetExercicios.getAll();
      
      exercicios.forEach(exercicio => {
        expect(exercicio.nome).toBeTruthy();
        expect(exercicio.nome.length).toBeGreaterThan(0);
      });
    });

    test('deve retornar exercícios com valores numéricos válidos', () => {
      const exercicios = GetExercicios.getAll();
      
      exercicios.forEach(exercicio => {
        expect(exercicio.id).toBeGreaterThan(0);
        expect(exercicio.series).toBeGreaterThan(0);
        expect(exercicio.repeticoes).toBeGreaterThan(0);
        expect(exercicio.treinoId).toBeGreaterThan(0);
      });
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      // Verifica se GetExercicios é uma função (classe)
      expect(typeof GetExercicios).toBe('function');
      
      // Verifica se getAll é um método estático
      expect(typeof GetExercicios.getAll).toBe('function');
      
      // Verifica se não possui propriedades de instância visíveis
      expect(Object.getOwnPropertyNames(GetExercicios.prototype)).toEqual(['constructor']);
    });
  });

  describe('mapJsonToExercicio', () => {
    test('deve ser um método privado estático', () => {
      // Verifica se o método não está acessível publicamente
      expect((GetExercicios as any).mapJsonToExercicio).toBeDefined();
      
      // Testa o método diretamente (acessando como privado)
      const dadosTeste = {
        id: 999,
        nome: 'TESTE EXERCICIO',
        peso: '10kg',
        series: 3,
        repeticoes: 15,
        treinoId: 1
      };

      const exercicio = (GetExercicios as any).mapJsonToExercicio(dadosTeste);
      
      expect(exercicio).toBeInstanceOf(Exercicio);
      expect(exercicio.id).toBe(999);
      expect(exercicio.nome).toBe('TESTE EXERCICIO');
      expect(exercicio.peso).toBe('10kg');
      expect(exercicio.series).toBe(3);
      expect(exercicio.repeticoes).toBe(15);
      expect(exercicio.treinoId).toBe(1);
    });
  });

  describe('consistência dos dados', () => {
    test('deve manter consistência nos dados mockados', () => {
      const exercicios = GetExercicios.getAll();
      
      // Verifica se todos os exercícios mockados pertencem ao treino 1
      exercicios.forEach(exercicio => {
        expect(exercicio.treinoId).toBe(1);
      });
      
      // Verifica se os nomes estão em maiúsculo (padrão dos dados)
      exercicios.forEach(exercicio => {
        expect(exercicio.nome).toBe(exercicio.nome.toUpperCase());
      });
      
      // Verifica se as propriedades numéricas são positivas
      exercicios.forEach(exercicio => {
        expect(exercicio.id).toBeGreaterThan(0);
        expect(exercicio.series).toBeGreaterThan(0);
        expect(exercicio.repeticoes).toBeGreaterThan(0);
        expect(exercicio.treinoId).toBeGreaterThan(0);
      });
    });
  });
});