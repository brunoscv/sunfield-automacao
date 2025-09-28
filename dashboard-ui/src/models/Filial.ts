import { Matriz } from './Matriz';

export interface Filial {
  id?: number;
  nome: string;
  endereco: string;
  responsavel: string;
  telefone?: string;
  porcentagemEnergia: number;
  matriz?: Matriz;
  matrizId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFilialRequest {
  nome: string;
  endereco: string;
  responsavel: string;
  telefone?: string;
  porcentagemEnergia: number;
  matrizId: number;
}

export interface UpdateFilialRequest {
  nome?: string;
  endereco?: string;
  responsavel?: string;
  telefone?: string;
  porcentagemEnergia?: number;
  matrizId?: number;
}

export interface FilialEnergiaInfo {
  filial: Filial;
  energiaRecebidaKw: number;
  geracaoTotalMatrizKw: number;
}