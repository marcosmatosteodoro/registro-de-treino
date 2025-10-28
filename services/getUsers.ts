import { User } from '../models/user';
import usersData from '../data/users.json';

export class GetUsers {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToUser(userData: any): User {
    return new User(userData.id, userData.nome);
  }

  public static getAll(): User[] {
    return usersData.map(this.mapJsonToUser);
  }
}