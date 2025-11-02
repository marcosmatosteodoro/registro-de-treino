import { GetTreinosByUser } from './getTreinosByUser';
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
  },
  {
    "id": 4,
    "nome": "Treino D",
    "userId": 2
  },
  {
    "id": 5,
    "nome": "Treino E",
    "userId": 3
  }
]);

describe('GetTreinosByUser', () => {
  describe('getByUserId', () => {
    test('deve retornar treinos do usuário 1', () => {
      const treinos = GetTreinosByUser.getByUserId(1);

      expect(treinos).toHaveLength(2);
      expect(treinos[0]).toBeInstanceOf(Treino);
      expect(treinos[1]).toBeInstanceOf(Treino);
      
      expect(treinos[0].id).toBe(1);
      expect(treinos[0].nome).toBe('Treino A');
      expect(treinos[0].userId).toBe(1);
      
      expect(treinos[1].id).toBe(2);
      expect(treinos[1].nome).toBe('Treino B');
      expect(treinos[1].userId).toBe(1);
    });

    test('deve retornar treinos do usuário 2', () => {
      const treinos = GetTreinosByUser.getByUserId(2);

      expect(treinos).toHaveLength(2);
      expect(treinos[0]).toBeInstanceOf(Treino);
      expect(treinos[1]).toBeInstanceOf(Treino);
      
      expect(treinos[0].id).toBe(3);
      expect(treinos[0].nome).toBe('Treino C');
      expect(treinos[0].userId).toBe(2);
      
      expect(treinos[1].id).toBe(4);
      expect(treinos[1].nome).toBe('Treino D');
      expect(treinos[1].userId).toBe(2);
    });

    test('deve retornar treinos do usuário 3', () => {
      const treinos = GetTreinosByUser.getByUserId(3);

      expect(treinos).toHaveLength(1);
      expect(treinos[0]).toBeInstanceOf(Treino);
      
      expect(treinos[0].id).toBe(5);
      expect(treinos[0].nome).toBe('Treino E');
      expect(treinos[0].userId).toBe(3);
    });

    test('deve retornar array vazio para usuário inexistente', () => {
      const treinos = GetTreinosByUser.getByUserId(999);

      expect(treinos).toHaveLength(0);
      expect(Array.isArray(treinos)).toBe(true);
    });

    test('deve retornar apenas treinos do usuário especificado', () => {
      const treinosUser1 = GetTreinosByUser.getByUserId(1);
      const treinosUser2 = GetTreinosByUser.getByUserId(2);
      const treinosUser3 = GetTreinosByUser.getByUserId(3);

      treinosUser1.forEach(treino => {
        expect(treino.userId).toBe(1);
      });

      treinosUser2.forEach(treino => {
        expect(treino.userId).toBe(2);
      });

      treinosUser3.forEach(treino => {
        expect(treino.userId).toBe(3);
      });
    });

    test('deve retornar treinos com propriedades válidas', () => {
      const treinos = GetTreinosByUser.getByUserId(1);

      treinos.forEach(treino => {
        expect(treino).toHaveProperty('id');
        expect(treino).toHaveProperty('nome');
        expect(treino).toHaveProperty('userId');

        expect(typeof treino.id).toBe('number');
        expect(typeof treino.nome).toBe('string');
        expect(typeof treino.userId).toBe('number');

        expect(treino.id).toBeGreaterThan(0);
        expect(treino.nome.length).toBeGreaterThan(0);
        expect(treino.userId).toBeGreaterThan(0);
      });
    });

    test('deve filtrar corretamente por ID zero', () => {
      const treinos = GetTreinosByUser.getByUserId(0);
      expect(treinos).toHaveLength(0);
    });

    test('deve filtrar corretamente por ID negativo', () => {
      const treinos = GetTreinosByUser.getByUserId(-1);
      expect(treinos).toHaveLength(0);
    });

    test('deve retornar diferentes quantidades de treinos por usuário', () => {
      const treinosUser1 = GetTreinosByUser.getByUserId(1);
      const treinosUser2 = GetTreinosByUser.getByUserId(2);
      const treinosUser3 = GetTreinosByUser.getByUserId(3);

      expect(treinosUser1.length).toBe(2);
      expect(treinosUser2.length).toBe(2);
      expect(treinosUser3.length).toBe(1);
    });
  });

  describe('mapJsonToTreino', () => {
    test('deve ser um método privado estático', () => {
      expect((GetTreinosByUser as any).mapJsonToTreino).toBeDefined();
      
      const dadosTeste = {
        id: 999,
        nome: 'Treino Teste',
        userId: 1
      };

      const treino = (GetTreinosByUser as any).mapJsonToTreino(dadosTeste);
      
      expect(treino).toBeInstanceOf(Treino);
      expect(treino.id).toBe(999);
      expect(treino.nome).toBe('Treino Teste');
      expect(treino.userId).toBe(1);
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof GetTreinosByUser).toBe('function');
      expect(typeof GetTreinosByUser.getByUserId).toBe('function');
      expect(Object.getOwnPropertyNames(GetTreinosByUser.prototype)).toEqual(['constructor']);
    });
  });
});