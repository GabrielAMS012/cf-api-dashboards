import { apiClient, type ApiResponse, type PaginatedResponse } from "@/lib/api/client"


export interface User {
  id: string
  username: string
  email?: string
  role?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export class AuthService {
  private static instance: AuthService
  private user: User | null = null
  private token: string | null = null
  private endpoint = "/token/"


  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock authentication - in real app, this would call your API
    try {
        const loginResponse = await apiClient.post(this.endpoint, credentials)

        const token = loginResponse.access

        this.user = null
        this.token = token

        // Store in localStorage
        if (typeof window !== "undefined") {
            // localStorage.setItem("auth_user", JSON.stringify(null))
            localStorage.setItem("auth_token", token)
        }
        
        const user: User = await this.getMe()

        return { user, token }
    } catch (error) {
        throw new Error("Credenciais inválidas")
    }
  }

  async logout(): Promise<void> {
    this.user = null
    this.token = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    }
  }
  
  async getMe(): Promise<User> {
    try {
        const meResponse = await apiClient.get("/user/me/")

        const user: User = {
            id: meResponse.id,
            username: meResponse.username,
            email: `${meResponse.username}@connectingfood.com`,
            role: (meResponse.is_superuser) ? "admin" : "client",
        }

        this.user = user

        // Store in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("auth_user", JSON.stringify(user))
        }

        return user
    } catch (error) {
        throw new Error("Credenciais inválidas")
    }
  }

  getCurrentUser(): User | null {
    if (this.user) return this.user

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("auth_user")
      if (storedUser) {
        this.user = JSON.parse(storedUser)
        return this.user
      }
    }

    return null
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
      return this.token
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null
  }
}
