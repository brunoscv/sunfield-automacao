import { User } from './User';

export interface FileInfo {
  id?: number;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  uploadDate: string;
  user?: User;
  userId?: number;
}

export interface UploadFileRequest {
  file: File;
  userId: number;
}