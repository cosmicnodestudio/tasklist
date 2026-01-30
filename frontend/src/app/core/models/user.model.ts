export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
