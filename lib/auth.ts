"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  address: string
  number: string
  isPremium: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, userData?: any) => Promise<boolean>
  signup: (name: string, email: string, password: string, userData?: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, userData?: any): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email && password.length >= 6) {
      // Use the userData from backend if provided, otherwise fallback to basic data
      const user = userData ? {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        address: userData.address || "",
        number: userData.number || "",
        isPremium: Boolean(userData.isPremium || userData.premium) // Handle both isPremium and premium fields
      } : { 
        id: "1", 
        email, 
        name: email.split("@")[0],
        address: "",
        number: "",
        isPremium: false
      }
      
      // Debug logging
      console.log('Backend userData:', userData)
      console.log('Processed user:', user)
      console.log('isPremium value:', user.isPremium, 'Type:', typeof user.isPremium)
      
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, userData?: any): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (name && email && password.length >= 6) {
      // Use the userData from backend if provided, otherwise fallback to basic data
      const user = userData ? {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        address: userData.address || "",
        number: userData.number || "",
        isPremium: Boolean(userData.isPremium || userData.premium) // Handle both isPremium and premium fields
      } : { 
        id: "1", 
        email, 
        name,
        address: "",
        number: "",
        isPremium: false
      }
      
      // Debug logging
      console.log('Backend userData:', userData)
      console.log('Processed user:', user)
      console.log('isPremium value:', user.isPremium, 'Type:', typeof user.isPremium)
      
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, signup, logout, isLoading } },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
