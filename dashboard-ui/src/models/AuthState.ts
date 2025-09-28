export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    username: string;
    role: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    username: string;
    role: string;
  };
  token?: string;
}