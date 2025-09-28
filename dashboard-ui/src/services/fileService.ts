import { api } from './api';
import { FileInfo, UploadFileRequest } from '../models';

export class FileService {
  private static readonly BASE_PATH = '/files';

  static async getAll(): Promise<FileInfo[]> {
    const response = await api.get<FileInfo[]>(this.BASE_PATH);
    return response.data;
  }

  static async getById(id: number): Promise<FileInfo> {
    const response = await api.get<FileInfo>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  static async getByUser(userId: number): Promise<FileInfo[]> {
    const response = await api.get<FileInfo[]>(`${this.BASE_PATH}/user/${userId}`);
    return response.data;
  }

  static async upload(uploadRequest: UploadFileRequest): Promise<FileInfo> {
    const formData = new FormData();
    formData.append('file', uploadRequest.file);
    formData.append('userId', uploadRequest.userId.toString());

    const response = await api.post<FileInfo>(`${this.BASE_PATH}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  static async download(id: number): Promise<Blob> {
    const response = await api.get(`${this.BASE_PATH}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  static async view(id: number): Promise<Blob> {
    const response = await api.get(`${this.BASE_PATH}/${id}/view`, {
      responseType: 'blob',
    });
    return response.data;
  }

  static async search(query: string): Promise<FileInfo[]> {
    const response = await api.get<FileInfo[]>(`${this.BASE_PATH}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default FileService;