import { User } from '../models/user';
import usersData from '../data/users.json';

export class GetUserById {
  private constructor() {
    // Construtor privado para impedir instanciação
  }

  private static mapJsonToUser(userData: any): User {
    return new User(userData.id, userData.nome);
  }

  public static getById(id: number): User | null {
    const userData = usersData.find(user => user.id === id);
    
    if (!userData) {
      return null;
    }
    
    return this.mapJsonToUser(userData);
  }
}