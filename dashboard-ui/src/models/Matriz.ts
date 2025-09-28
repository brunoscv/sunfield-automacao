import { Filial } from './Filial';

export interface Matriz {
  id?: number;
  nome: string;
  endereco: string;
  responsavel: string;
  telefone?: string;
  geracaoKw: number;
  porcentagemMatriz: number;
  filiais?: Filial[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMatrizRequest {
  nome: string;
  endereco: string;
  responsavel: string;
  telefone?: string;
  geracaoKw: number;
  porcentagemMatriz: number;
}

export interface UpdateMatrizRequest {
  nome?: string;
  endereco?: string;
  responsavel?: string;
  telefone?: string;
  geracaoKw?: number;
  porcentagemMatriz?: number;
}

export interface MatrizResumo {
  matriz: Matriz;
  totalFiliais: number;
  porcentagemTotalUtilizada: number;
  porcentagemDisponivel: number;
  energiaDisponivelKw: number;
}