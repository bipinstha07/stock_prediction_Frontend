"use client"

import { useAuth } from "@/lib/auth"
import { AuthForms } from "@/components/auth-forms"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/user')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to user page
  }

  const handleAuthSuccess = () => {
    router.push('/user')
  }

  const handleModeChange = (mode: "login" | "signup") => {
    setAuthMode(mode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Button */}
      <div className="p-2 sm:p-4 border-b border-white/20 relative z-10">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/20 px-3 py-2 rounded-md transition-all duration-300 cursor-pointer backdrop-blur-sm text-sm sm:text-base"
        >
          <span>←</span>
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Home</span>
        </button>
      </div>
      
      <AuthForms 
        mode={authMode} 
        onSuccess={handleAuthSuccess} 
        onModeChange={handleModeChange} 
      />
    </div>
  )
}
