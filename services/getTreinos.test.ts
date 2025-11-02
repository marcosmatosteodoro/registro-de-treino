import { GetTreinos } from './getTreinos';
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

describe('GetTreinos', () => {
  describe('getAll', () => {
    test('deve retornar todos os treinos como instâncias da classe Treino', () => {
      const treinos = GetTreinos.getAll();

      expect(treinos).toHaveLength(3);
      expect(treinos[0]).toBeInstanceOf(Treino);
      expect(treinos[1]).toBeInstanceOf(Treino);
      expect(treinos[2]).toBeInstanceOf(Treino);
    });

    test('deve mapear corretamente os dados do primeiro treino', () => {
      const treinos = GetTreinos.getAll();
      const primeiroTreino = treinos[0];

      expect(primeiroTreino.id).toBe(1);
      expect(primeiroTreino.nome).toBe('Treino A');
      expect(primeiroTreino.userId).toBe(1);
    });

    test('deve mapear corretamente os dados do segundo treino', () => {
      const treinos = GetTreinos.getAll();
      const segundoTreino = treinos[1];

      expect(segundoTreino.id).toBe(2);
      expect(segundoTreino.nome).toBe('Treino B');
      expect(segundoTreino.userId).toBe(1);
    });

    test('deve mapear corretamente os dados do terceiro treino', () => {
      const treinos = GetTreinos.getAll();
      const terceiroTreino = treinos[2];

      expect(terceiroTreino.id).toBe(3);
      expect(terceiroTreino.nome).toBe('Treino C');
      expect(terceiroTreino.userId).toBe(2);
    });

    test('deve retornar array não vazio', () => {
      const treinos = GetTreinos.getAll();
      expect(treinos.length).toBeGreaterThan(0);
    });

    test('deve retornar treinos com propriedades obrigatórias', () => {
      const treinos = GetTreinos.getAll();
      
      treinos.forEach(treino => {
        expect(treino).toHaveProperty('id');
        expect(treino).toHaveProperty('nome');
        expect(treino).toHaveProperty('userId');
      });
    });

    test('deve retornar treinos com tipos corretos', () => {
      const treinos = GetTreinos.getAll();
      
      treinos.forEach(treino => {
        expect(typeof treino.id).toBe('number');
        expect(typeof treino.nome).toBe('string');
        expect(typeof treino.userId).toBe('number');
      });
    });

    test('deve retornar treinos com IDs únicos', () => {
      const treinos = GetTreinos.getAll();
      const ids = treinos.map(treino => treino.id);
      const idsUnicos = [...new Set(ids)];
      
      expect(ids.length).toBe(idsUnicos.length);
    });

    test('deve retornar treinos com nomes não vazios', () => {
      const treinos = GetTreinos.getAll();
      
      treinos.forEach(treino => {
        expect(treino.nome).toBeTruthy();
        expect(treino.nome.length).toBeGreaterThan(0);
      });
    });

    test('deve retornar treinos com valores numéricos válidos', () => {
      const treinos = GetTreinos.getAll();
      
      treinos.forEach(treino => {
        expect(treino.id).toBeGreaterThan(0);
        expect(treino.userId).toBeGreaterThan(0);
      });
    });

    test('deve conter treinos de diferentes usuários', () => {
      const treinos = GetTreinos.getAll();
      const userIds = [...new Set(treinos.map(treino => treino.userId))];
      
      expect(userIds.length).toBeGreaterThan(1);
      expect(userIds).toContain(1);
      expect(userIds).toContain(2);
    });
  });

  describe('mapJsonToTreino', () => {
    test('deve ser um método privado estático', () => {
      expect((GetTreinos as any).mapJsonToTreino).toBeDefined();
      
      const dadosTeste = {
        id: 999,
        nome: 'Treino Teste',
        userId: 1
      };

      const treino = (GetTreinos as any).mapJsonToTreino(dadosTeste);
      
      expect(treino).toBeInstanceOf(Treino);
      expect(treino.id).toBe(999);
      expect(treino.nome).toBe('Treino Teste');
      expect(treino.userId).toBe(1);
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof GetTreinos).toBe('function');
      expect(typeof GetTreinos.getAll).toBe('function');
      expect(Object.getOwnPropertyNames(GetTreinos.prototype)).toEqual(['constructor']);
    });
  });
});