import { GetUserById } from './getUserById';
import { User } from '../models/user';

// Mock dos dados de usuários
jest.mock('../data/users.json', () => [
  {
    "id": 1,
    "nome": "Marcos"
  },
  {
    "id": 2,
    "nome": "Evelin"
  }
]);

describe('GetUserById', () => {
  describe('getById', () => {
    test('deve retornar usuário com ID 1', () => {
      const user = GetUserById.getById(1);

      expect(user).not.toBeNull();
      expect(user).toBeInstanceOf(User);
      expect(user!.id).toBe(1);
      expect(user!.nome).toBe('Marcos');
    });

    test('deve retornar usuário com ID 2', () => {
      const user = GetUserById.getById(2);

      expect(user).not.toBeNull();
      expect(user).toBeInstanceOf(User);
      expect(user!.id).toBe(2);
      expect(user!.nome).toBe('Evelin');
    });

    test('deve retornar null para ID inexistente', () => {
      const user = GetUserById.getById(999);
      expect(user).toBeNull();
    });

    test('deve retornar null para ID zero', () => {
      const user = GetUserById.getById(0);
      expect(user).toBeNull();
    });

    test('deve retornar null para ID negativo', () => {
      const user = GetUserById.getById(-1);
      expect(user).toBeNull();
    });

    test('deve retornar usuário com propriedades válidas', () => {
      const user = GetUserById.getById(1);

      expect(user).not.toBeNull();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('nome');

      expect(typeof user!.id).toBe('number');
      expect(typeof user!.nome).toBe('string');

      expect(user!.id).toBeGreaterThan(0);
      expect(user!.nome.length).toBeGreaterThan(0);
    });

    test('deve encontrar usuários por diferentes IDs', () => {
      const user1 = GetUserById.getById(1);
      const user2 = GetUserById.getById(2);

      expect(user1!.id).not.toBe(user2!.id);
      expect(user1!.nome).not.toBe(user2!.nome);

      expect(user1!.id).toBe(1);
      expect(user1!.nome).toBe('Marcos');
      
      expect(user2!.id).toBe(2);
      expect(user2!.nome).toBe('Evelin');
    });

    test('deve retornar usuários com nomes não vazios', () => {
      const user1 = GetUserById.getById(1);
      const user2 = GetUserById.getById(2);

      expect(user1!.nome).toBeTruthy();
      expect(user2!.nome).toBeTruthy();
      expect(user1!.nome.trim().length).toBeGreaterThan(0);
      expect(user2!.nome.trim().length).toBeGreaterThan(0);
    });

    test('deve lidar com busca múltipla do mesmo ID', () => {
      const user1a = GetUserById.getById(1);
      const user1b = GetUserById.getById(1);

      expect(user1a).not.toBeNull();
      expect(user1b).not.toBeNull();
      expect(user1a!.id).toBe(user1b!.id);
      expect(user1a!.nome).toBe(user1b!.nome);
    });

    test('deve manter consistência dos dados', () => {
      const userMarcos = GetUserById.getById(1);
      const userEvelin = GetUserById.getById(2);

      expect(userMarcos!.nome).toBe('Marcos');
      expect(userEvelin!.nome).toBe('Evelin');
      
      // Verifica se os nomes são exatamente como esperado
      expect(userMarcos!.nome).toMatch(/^[A-Za-z]+$/);
      expect(userEvelin!.nome).toMatch(/^[A-Za-z]+$/);
    });
  });

  describe('mapJsonToUser', () => {
    test('deve ser um método privado estático', () => {
      expect((GetUserById as any).mapJsonToUser).toBeDefined();
      
      const dadosTeste = {
        id: 999,
        nome: 'Usuário Teste'
      };

      const user = (GetUserById as any).mapJsonToUser(dadosTeste);
      
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(999);
      expect(user.nome).toBe('Usuário Teste');
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof GetUserById).toBe('function');
      expect(typeof GetUserById.getById).toBe('function');
      expect(Object.getOwnPropertyNames(GetUserById.prototype)).toEqual(['constructor']);
    });
  });
});