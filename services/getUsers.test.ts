import { GetUsers } from './getUsers';
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

describe('GetUsers', () => {
  describe('getAll', () => {
    test('deve retornar todos os usuários como instâncias da classe User', () => {
      const users = GetUsers.getAll();

      expect(users).toHaveLength(2);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[1]).toBeInstanceOf(User);
    });

    test('deve mapear corretamente os dados do primeiro usuário', () => {
      const users = GetUsers.getAll();
      const primeiroUser = users[0];

      expect(primeiroUser.id).toBe(1);
      expect(primeiroUser.nome).toBe('Marcos');
    });

    test('deve mapear corretamente os dados do segundo usuário', () => {
      const users = GetUsers.getAll();
      const segundoUser = users[1];

      expect(segundoUser.id).toBe(2);
      expect(segundoUser.nome).toBe('Evelin');
    });

    test('deve retornar array não vazio', () => {
      const users = GetUsers.getAll();
      expect(users.length).toBeGreaterThan(0);
    });

    test('deve retornar usuários com propriedades obrigatórias', () => {
      const users = GetUsers.getAll();
      
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('nome');
      });
    });

    test('deve retornar usuários com tipos corretos', () => {
      const users = GetUsers.getAll();
      
      users.forEach(user => {
        expect(typeof user.id).toBe('number');
        expect(typeof user.nome).toBe('string');
      });
    });

    test('deve retornar usuários com IDs únicos', () => {
      const users = GetUsers.getAll();
      const ids = users.map(user => user.id);
      const idsUnicos = [...new Set(ids)];
      
      expect(ids.length).toBe(idsUnicos.length);
    });

    test('deve retornar usuários com nomes não vazios', () => {
      const users = GetUsers.getAll();
      
      users.forEach(user => {
        expect(user.nome).toBeTruthy();
        expect(user.nome.length).toBeGreaterThan(0);
        expect(user.nome.trim().length).toBeGreaterThan(0);
      });
    });

    test('deve retornar usuários com valores numéricos válidos', () => {
      const users = GetUsers.getAll();
      
      users.forEach(user => {
        expect(user.id).toBeGreaterThan(0);
        expect(Number.isInteger(user.id)).toBe(true);
      });
    });

    test('deve conter os usuários esperados', () => {
      const users = GetUsers.getAll();
      
      const nomes = users.map(user => user.nome);
      expect(nomes).toContain('Marcos');
      expect(nomes).toContain('Evelin');
      
      const ids = users.map(user => user.id);
      expect(ids).toContain(1);
      expect(ids).toContain(2);
    });

    test('deve manter ordem consistente', () => {
      const users1 = GetUsers.getAll();
      const users2 = GetUsers.getAll();
      
      expect(users1.length).toBe(users2.length);
      
      for (let i = 0; i < users1.length; i++) {
        expect(users1[i].id).toBe(users2[i].id);
        expect(users1[i].nome).toBe(users2[i].nome);
      }
    });

    test('deve retornar usuários com nomes válidos', () => {
      const users = GetUsers.getAll();
      
      users.forEach(user => {
        // Verifica se o nome contém apenas letras e espaços
        expect(user.nome).toMatch(/^[A-Za-z\s]+$/);
        // Verifica se não começa ou termina com espaço
        expect(user.nome).toBe(user.nome.trim());
      });
    });

    test('deve ter exatamente 2 usuários mockados', () => {
      const users = GetUsers.getAll();
      expect(users).toHaveLength(2);
      
      expect(users[0].nome).toBe('Marcos');
      expect(users[1].nome).toBe('Evelin');
    });
  });

  describe('mapJsonToUser', () => {
    test('deve ser um método privado estático', () => {
      expect((GetUsers as any).mapJsonToUser).toBeDefined();
      
      const dadosTeste = {
        id: 999,
        nome: 'Usuário Teste'
      };

      const user = (GetUsers as any).mapJsonToUser(dadosTeste);
      
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(999);
      expect(user.nome).toBe('Usuário Teste');
    });
  });

  describe('padrão de classe', () => {
    test('deve ser uma classe com métodos estáticos', () => {
      expect(typeof GetUsers).toBe('function');
      expect(typeof GetUsers.getAll).toBe('function');
      expect(Object.getOwnPropertyNames(GetUsers.prototype)).toEqual(['constructor']);
    });
  });
});