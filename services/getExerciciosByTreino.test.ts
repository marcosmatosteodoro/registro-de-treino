import { GetExerciciosByTreino } from './getExerciciosByTreino';
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
    "treinoId": 2
  },
  {
    "id": 4,
    "nome": "LEG PRESS",
    "peso": "35kg",
    "series": 3,
    "repeticoes": 12,
    "treinoId": 2
  }
]);

describe('GetExerciciosByTreino', () => {
  describe('getByTreinoId', () => {
    test('deve retornar exercícios do treino 1', () => {
      const exercicios = GetExerciciosByTreino.getByTreinoId(1);

      expect(exercicios).toHaveLength(2);
      expect(exercicios[0]).toBeInstanceOf(Exercicio);
      expect(exercicios[1]).toBeInstanceOf(Exercicio);
      
      expect(exercicios[0].id).toBe(1);
      expect(exercicios[0].nome).toBe('ESTEIRA');
      expect(exercicios[0].treinoId).toBe(1);
      
      expect(exercicios[1].id).toBe(2);
      expect(exercicios[1].nome).toBe('ELEVACAO FRONTAL');
      expect(exercicios[1].treinoId).toBe(1);
    });

    test('deve retornar exercícios do treino 2', () => {
      const exercicios = GetExerciciosByTreino.getByTreinoId(2);

      expect(exercicios).toHaveLength(2);
      expect(exercicios[0]).toBeInstanceOf(Exercicio);
      expect(exercicios[1]).toBeInstanceOf(Exercicio);
      
      expect(exercicios[0].id).toBe(3);
      expect(exercicios[0].nome).toBe('CADEIRA ADUTORA');
      expect(exercicios[0].treinoId).toBe(2);
      
      expect(exercicios[1].id).toBe(4);
      expect(exercicios[1].nome).toBe('LEG PRESS');
      expect(exercicios[1].treinoId).toBe(2);
    });

    test('deve retornar array vazio para treino inexistente', () => {
      const exercicios = GetExerciciosByTreino.getByTreinoId(999);

      expect(exercicios).toHaveLength(0);
      expect(Array.isArray(exercicios)).toBe(true);
    });

    test('deve retornar apenas exercícios do treino especificado', () => {
      const exerciciosTreino1 = GetExerciciosByTreino.getByTreinoId(1);
      const exerciciosTreino2 = GetExerciciosByTreino.getByTreinoId(2);

      exerciciosTreino1.forEach(exercicio => {
        expect(exercicio.treinoId).toBe(1);
      });

      exerciciosTreino2.forEach(exercicio => {
        expect(exercicio.treinoId).toBe(2);
      });
    });

    test('deve retornar exercícios com propriedades válidas', () => {
      const exercicios = GetExerciciosByTreino.getByTreinoId(1);

      exercicios.forEach(exercicio => {
        expect(exercicio).toHaveProperty('id');
        expect(exercicio).toHaveProperty('nome');
        expect(exercicio).toHaveProperty('peso');
        expect(exercicio).toHaveProperty('series');
        expect(exercicio).toHaveProperty('repeticoes');
        expect(exercicio).toHaveProperty('treinoId');

        expect(typeof exercicio.id).toBe('number');
        expect(typeof exercicio.nome).toBe('string');
        expect(typeof exercicio.peso).toBe('string');
        expect(typeof exercicio.series).toBe('number');
        expect(typeof exercicio.repeticoes).toBe('number');
        expect(typeof exercicio.treinoId).toBe('number');
      });
    });

    test('deve filtrar corretamente por ID zero', () => {
      const exercicios = GetExerciciosByTreino.getByTreinoId(0);
      expect(exercicios).toHaveLength(0);
    });

    test('deve filtrar corretamente por ID negativo', () => {
      const exercicios = GetExerciciosByTreino.getByTreinoId(-1);
      expect(exercicios).toHaveLength(0);
    });
  });

  describe('mapJsonToExercicio', () => {
    test('deve ser um método privado estático', () => {
      expect((GetExerciciosByTreino as any).mapJsonToExercicio).toBeDefined();
      
      const dadosTeste = {
        id: 999,
        nome: 'TESTE EXERCICIO',
        peso: '10kg',
        series: 3,
        repeticoes: 15,
        treinoId: 1
      };

      const exercicio = (GetExerciciosByTreino as any).mapJsonToExercicio(dadosTeste);
      
      expect(exercicio).toBeInstanceOf(Exercicio);
      expect(exercicio.id).toBe(999);
      expect(exercicio.nome).toBe('TESTE EXERCICIO');
      expect(exercicio.peso).toBe('10kg');
      expect(exercicio.series).toBe(3);
      expect(exercicio.repeticoes).toBe(15);
      expect(exercicio.treinoId).toBe(1);
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof GetExerciciosByTreino).toBe('function');
      expect(typeof GetExerciciosByTreino.getByTreinoId).toBe('function');
      expect(Object.getOwnPropertyNames(GetExerciciosByTreino.prototype)).toEqual(['constructor']);
    });
  });
});