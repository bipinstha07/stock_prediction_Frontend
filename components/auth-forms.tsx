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
        const response = await fetch(`http://localhost:8080/user/getUser/${formData.email}`)
        
        if (response.ok) {
          const userData = await response.json()
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
    <div className="min-h-[90vh] flex bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Website Branding */}
      <div className="w-2/5 flex items-center justify-center p-8 relative z-10">
        <div className="text-center max-w-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3 border border-white/30">
              <TrendingUp className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">StockPredict AI</h1>
          </div>
          <h2 className="text-2xl font-semibold text-white/90 mb-4">
            Predict the Future of Stocks
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Harness the power of AI to make informed investment decisions. 
            Get accurate stock predictions based on news sentiment and market analysis.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4 text-white/70">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              <span className="text-sm">Real-time Analysis</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm">AI Predictions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-3/5 flex items-center justify-center relative z-10">
        <Card className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center p-6">
            <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full p-2 mr-3 border border-white/30">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">StockPredict AI</h2>
          </div>
          <CardHeader className="text-center py-1 px-9">
            <CardTitle className="text-2xl text-white">{mode === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription className="text-white/80">
              {mode === "login" ? "Sign in to access your stock predictions" : "Join thousands of smart investors"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 backdrop-blur-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 backdrop-blur-sm"
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
                {mode === "signup" && <p className="text-sm text-white/70">Password must be at least 6 characters</p>}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-md backdrop-blur-sm">{error}</div>
              )}

              <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm cursor-pointer transition-all duration-300" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto font-normal text-white hover:text-white/80 underline cursor-pointer"
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
