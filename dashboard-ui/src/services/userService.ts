import { api } from './api';
import { User, CreateUserRequest, UpdateUserRequest } from '../models';

export class UserService {
  private static readonly BASE_PATH = '/users';

  static async getAll(): Promise<User[]> {
    const response = await api.get<User[]>(this.BASE_PATH);
    return response.data;
  }

  static async getById(id: number): Promise<User> {
    const response = await api.get<User>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  static async create(user: CreateUserRequest): Promise<User> {
    const response = await api.post<User>(this.BASE_PATH, user);
    return response.data;
  }

  static async update(id: number, user: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`${this.BASE_PATH}/${id}`, user);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  static async search(query: string): Promise<User[]> {
    const response = await api.get<User[]>(`${this.BASE_PATH}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default UserService;