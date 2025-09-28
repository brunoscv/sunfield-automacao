import { api } from './api';
import { Filial, CreateFilialRequest, UpdateFilialRequest, FilialEnergiaInfo } from '../models';

export class FilialService {
  private static readonly BASE_PATH = '/filiais';

  static async getAll(): Promise<Filial[]> {
    const response = await api.get<Filial[]>(this.BASE_PATH);
    return response.data;
  }

  static async getAllWithMatriz(): Promise<Filial[]> {
    const response = await api.get<Filial[]>(`${this.BASE_PATH}/with-matriz`);
    return response.data;
  }

  static async getById(id: number): Promise<Filial> {
    const response = await api.get<Filial>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  static async getByIdWithMatriz(id: number): Promise<Filial> {
    const response = await api.get<Filial>(`${this.BASE_PATH}/${id}/with-matriz`);
    return response.data;
  }

  static async getByMatriz(matrizId: number): Promise<Filial[]> {
    const response = await api.get<Filial[]>(`${this.BASE_PATH}/by-matriz/${matrizId}`);
    return response.data;
  }

  static async getEnergiaCalculada(id: number): Promise<FilialEnergiaInfo> {
    const response = await api.get<FilialEnergiaInfo>(`${this.BASE_PATH}/${id}/energia-calculada`);
    return response.data;
  }

  static async create(filial: CreateFilialRequest): Promise<Filial> {
    const response = await api.post<Filial>(this.BASE_PATH, filial);
    return response.data;
  }

  static async update(id: number, filial: UpdateFilialRequest): Promise<Filial> {
    const response = await api.put<Filial>(`${this.BASE_PATH}/${id}`, filial);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  static async search(query: string): Promise<Filial[]> {
    const response = await api.get<Filial[]>(`${this.BASE_PATH}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default FilialService;