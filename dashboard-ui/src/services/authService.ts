import { LoginRequest, LoginResponse, AuthState } from '../models';

export class AuthService {
  private static readonly AUTH_KEY = 'energia_auth';

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Simulação de login - substitua por chamada real à API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          const response: LoginResponse = {
            success: true,
            user: {
              username: 'admin',
              role: 'administrator'
            },
            token: 'fake-jwt-token'
          };
          
          // Salvar no localStorage
          localStorage.setItem(this.AUTH_KEY, JSON.stringify(response));
          resolve(response);
        } else {
          resolve({
            success: false
          });
        }
      }, 1000);
    });
  }

  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  static getCurrentAuth(): AuthState {
    try {
      const stored = localStorage.getItem(this.AUTH_KEY);
      if (stored) {
        const auth = JSON.parse(stored) as LoginResponse;
        return {
          isAuthenticated: auth.success,
          user: auth.user
        };
      }
    } catch (error) {
      console.error('Erro ao recuperar autenticação:', error);
    }
    
    return {
      isAuthenticated: false
    };
  }

  static isAuthenticated(): boolean {
    return this.getCurrentAuth().isAuthenticated;
  }
}

export default AuthService;