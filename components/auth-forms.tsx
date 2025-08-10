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
      let success = false
      if (mode === "login") {
        success = await login(formData.email, formData.password)
      } else {
        success = await signup(formData.name, formData.email, formData.password)
      }

      if (success) {
        onSuccess()
      } else {
        setError(mode === "login" ? "Invalid credentials" : "Failed to create account")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex bg-white">
      {/* Left Side - Website Branding */}
      <div className="w-2/5 bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-900 rounded-full p-3 mr-3">
              <TrendingUp className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">StockPredict AI</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Predict the Future of Stocks
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Harness the power of AI to make informed investment decisions. 
            Get accurate stock predictions based on news sentiment and market analysis.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4 text-gray-500">
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
      <div className="w-3/5 bg-white  flex items-center justify-center ">
        <Card className="w-full max-w-lg bg-white border  border-gray-200 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="bg-gray-900 w-15 h-15 rounded-full p-3 mr-3">
            <TrendingUp className="h-9 w-9 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">StockPredict AI</h2>
        </div>
          <CardHeader className="text-center py-1 px-9">
            <CardTitle className="text-2xl text-gray-900">{mode === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription className="text-gray-600">
              {mode === "login" ? "Sign in to access your stock predictions" : "Join thousands of smart investors"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {mode === "signup" && <p className="text-sm text-gray-500">Password must be at least 6 characters</p>}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
              )}

              <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 cursor-pointer" disabled={isLoading}>
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
              <p className="text-sm text-gray-600">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto font-normal text-gray-900 hover:text-gray-700 underline cursor-pointer"
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
