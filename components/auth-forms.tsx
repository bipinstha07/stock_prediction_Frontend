"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, TrendingUp, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface AuthFormsProps {
  mode: "login" | "signup"
  onSuccess: () => void
  onModeChange: (mode: "login" | "signup") => void
}

export function AuthForms({ mode, onSuccess, onModeChange }: AuthFormsProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (mode === "login") {
        // Login: Get user by email
        const response = await fetch(`http://10.0.0.142:8080/user/getUser/${formData.email}`)
        
        if (response.ok) {
          const userData = await response.json()
          
          // Debug logging for backend response
          console.log('🔍 AUTH FORMS - Backend Response:', userData)
          console.log('🔍 AUTH FORMS - isPremium from backend:', userData.isPremium)
          console.log('🔍 AUTH FORMS - isPremium type:', typeof userData.isPremium)
          console.log('🔍 AUTH FORMS - Full userData JSON:', JSON.stringify(userData, null, 2))
          
          // For now, we'll just check if user exists
          // In a real app, you'd verify password on backend
          if (userData && userData.email === formData.email) {
            // Call the login function from auth context with user data
            const success = await login(formData.email, formData.password, userData)
            if (success) {
              onSuccess()
            } else {
              setError("Invalid credentials")
            }
          } else {
            setError("User not found")
          }
        } else if (response.status === 404) {
          setError("User not found")
        } else {
          setError("Login failed. Please try again.")
        }
      } else {
        // Signup: Create new user
        const signupData = {
          name: formData.name,
          email: formData.email,
          address: "", // Empty for now as per your requirement
          number: ""   // Empty for now as per your requirement
        }

        const response = await fetch(`http://localhost:8080/user/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData)
        })

        if (response.ok) {
          const newUser = await response.json()
          // Call the signup function from auth context with user data
          const success = await signup(formData.name, formData.email, formData.password, newUser)
          if (success) {
            onSuccess()
          } else {
            setError("Account created but login failed")
          }
        } else if (response.status === 409) {
          setError("User with this email already exists")
        } else {
          setError("Failed to create account. Please try again.")
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex flex-col lg:flex-row bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Website Branding (Top on mobile, left on desktop) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 order-1 lg:order-1">
        <div className="text-center max-w-lg">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 mr-2 sm:mr-3 border border-white/30">
              <TrendingUp className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">StockPredict AI</h1>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white/90 mb-3 sm:mb-4">
            Predict the Future of Stocks
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
            Harness the power of AI to make informed investment decisions. 
            Get accurate stock predictions based on news sentiment and market analysis.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/70">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-xs sm:text-sm">Real-time Analysis</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-xs sm:text-sm">AI Predictions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form (Bottom on mobile, right on desktop) */}
      <div className="w-full lg:w-3/5 flex items-center justify-center relative z-10 order-2 lg:order-2 p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md sm:max-w-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white/20 backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 rounded-full p-2 mr-2 sm:mr-3 border border-white/30">
              <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">StockPredict AI</h2>
          </div>
          <CardHeader className="text-center py-1 px-4 sm:px-6 lg:px-9">
            <CardTitle className="text-xl sm:text-2xl text-white">{mode === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription className="text-white/80 text-sm sm:text-base">
              {mode === "login" ? "Sign in to access your stock predictions" : "Join thousands of smart investors"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 lg:px-9">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90 text-sm sm:text-base">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 backdrop-blur-sm text-sm sm:text-base"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 backdrop-blur-sm text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 backdrop-blur-sm text-sm sm:text-base"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/20 text-white/70 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {mode === "signup" && <p className="text-sm text-white/70 text-xs sm:text-sm">Password must be at least 6 characters</p>}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-md backdrop-blur-sm text-xs sm:text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm cursor-pointer transition-all duration-300 text-sm sm:text-base py-2 sm:py-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">{mode === "login" ? "Signing In..." : "Creating Account..."}</span>
                    <span className="sm:hidden">{mode === "login" ? "Signing In..." : "Creating..."}</span>
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/70 text-xs sm:text-sm">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto font-normal text-white hover:text-white/80 underline cursor-pointer text-xs sm:text-sm"
                  onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
