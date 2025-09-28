import { api } from './api';
import { Matriz, CreateMatrizRequest, UpdateMatrizRequest, MatrizResumo } from '../models';

export class MatrizService {
  private static readonly BASE_PATH = '/matrizes';

  static async getAll(): Promise<Matriz[]> {
    const response = await api.get<Matriz[]>(this.BASE_PATH);
    return response.data;
  }

  static async getAllWithFiliais(): Promise<Matriz[]> {
    const response = await api.get<Matriz[]>(`${this.BASE_PATH}/with-filiais`);
    return response.data;
  }

  static async getById(id: number): Promise<Matriz> {
    const response = await api.get<Matriz>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  static async getByIdWithFiliais(id: number): Promise<Matriz> {
    const response = await api.get<Matriz>(`${this.BASE_PATH}/${id}/with-filiais`);
    return response.data;
  }

  static async getResumo(id: number): Promise<MatrizResumo> {
    const response = await api.get<MatrizResumo>(`${this.BASE_PATH}/${id}/resumo`);
    return response.data;
  }

  static async create(matriz: CreateMatrizRequest): Promise<Matriz> {
    const response = await api.post<Matriz>(this.BASE_PATH, matriz);
    return response.data;
  }

  static async update(id: number, matriz: UpdateMatrizRequest): Promise<Matriz> {
    const response = await api.put<Matriz>(`${this.BASE_PATH}/${id}`, matriz);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  static async search(query: string): Promise<Matriz[]> {
    const response = await api.get<Matriz[]>(`${this.BASE_PATH}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default MatrizService;