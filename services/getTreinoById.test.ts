import { GetTreinoById } from './getTreinoById';
import { Treino } from '../models/treino';

// Mock dos dados de treinos
jest.mock('../data/treinos.json', () => [
  {
    "id": 1,
    "nome": "Treino A",
    "userId": 1
  },
  {
    "id": 2,
    "nome": "Treino B",
    "userId": 1
  },
  {
    "id": 3,
    "nome": "Treino C",
    "userId": 2
  }
]);

describe('GetTreinoById', () => {
  describe('getById', () => {
    test('deve retornar treino com ID 1', () => {
      const treino = GetTreinoById.getById(1);

      expect(treino).not.toBeNull();
      expect(treino).toBeInstanceOf(Treino);
      expect(treino!.id).toBe(1);
      expect(treino!.nome).toBe('Treino A');
      expect(treino!.userId).toBe(1);
    });

    test('deve retornar treino com ID 2', () => {
      const treino = GetTreinoById.getById(2);

      expect(treino).not.toBeNull();
      expect(treino).toBeInstanceOf(Treino);
      expect(treino!.id).toBe(2);
      expect(treino!.nome).toBe('Treino B');
      expect(treino!.userId).toBe(1);
    });

    test('deve retornar treino com ID 3', () => {
      const treino = GetTreinoById.getById(3);

      expect(treino).not.toBeNull();
      expect(treino).toBeInstanceOf(Treino);
      expect(treino!.id).toBe(3);
      expect(treino!.nome).toBe('Treino C');
      expect(treino!.userId).toBe(2);
    });

    test('deve retornar null para ID inexistente', () => {
      const treino = GetTreinoById.getById(999);
      expect(treino).toBeNull();
    });

    test('deve retornar null para ID zero', () => {
      const treino = GetTreinoById.getById(0);
      expect(treino).toBeNull();
    });

    test('deve retornar null para ID negativo', () => {
      const treino = GetTreinoById.getById(-1);
      expect(treino).toBeNull();
    });

    test('deve retornar treino com propriedades válidas', () => {
      const treino = GetTreinoById.getById(1);

      expect(treino).not.toBeNull();
      expect(treino).toHaveProperty('id');
      expect(treino).toHaveProperty('nome');
      expect(treino).toHaveProperty('userId');

      expect(typeof treino!.id).toBe('number');
      expect(typeof treino!.nome).toBe('string');
      expect(typeof treino!.userId).toBe('number');

      expect(treino!.id).toBeGreaterThan(0);
      expect(treino!.nome.length).toBeGreaterThan(0);
      expect(treino!.userId).toBeGreaterThan(0);
    });

    test('deve encontrar treinos por diferentes IDs', () => {
      const treino1 = GetTreinoById.getById(1);
      const treino2 = GetTreinoById.getById(2);
      const treino3 = GetTreinoById.getById(3);

      expect(treino1!.id).not.toBe(treino2!.id);
      expect(treino2!.id).not.toBe(treino3!.id);
      expect(treino1!.id).not.toBe(treino3!.id);

      expect(treino1!.nome).not.toBe(treino2!.nome);
      expect(treino2!.nome).not.toBe(treino3!.nome);
    });
  });

  describe('mapJsonToTreino', () => {
    test('deve ser um método privado estático', () => {
      expect((GetTreinoById as any).mapJsonToTreino).toBeDefined();
      
      const dadosTeste = {
        id: 999,
        nome: 'Treino Teste',
        userId: 1
      };

      const treino = (GetTreinoById as any).mapJsonToTreino(dadosTeste);
      
      expect(treino).toBeInstanceOf(Treino);
      expect(treino.id).toBe(999);
      expect(treino.nome).toBe('Treino Teste');
      expect(treino.userId).toBe(1);
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof GetTreinoById).toBe('function');
      expect(typeof GetTreinoById.getById).toBe('function');
      expect(Object.getOwnPropertyNames(GetTreinoById.prototype)).toEqual(['constructor']);
    });
  });
});