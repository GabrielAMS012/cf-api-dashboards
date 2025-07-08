"use client"
import { useState, useEffect, createContext, useContext } from "react"
import type React from "react"
import { AuthService, type User } from "../api/auth"


interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const authService = AuthService.getInstance()

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])
  
  useEffect(() => {    
    setIsAuthenticated(!!user)
  }, [user])

  const login = async (username: string, password: string): Promise<boolean> => {

    // Mock authentication - replace with real API call
    try {
        const { user } = await authService.login({ username, password })
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        return true
    } catch (error) {
        return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    }}>{children}</AuthContext.Provider>
}
