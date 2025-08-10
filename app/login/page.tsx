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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-900">Loading...</p>
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
    <div className="min-h-screen bg-white">
      {/* Back to Home Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back to Home</span>
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
