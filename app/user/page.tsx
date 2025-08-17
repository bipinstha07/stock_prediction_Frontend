"use client"

import { useAuth } from "@/lib/auth"
import { StockPredictor } from "@/components/stock-predictor"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UserPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
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

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onLoginClick={() => router.push('/login')}
        onSignupClick={() => router.push('/login')}
        onDemoClick={() => router.push('/')}
        onLogout={() => {
          // Force redirect to home page
          router.push('/')
        }}
      />
      
      {/* Back to Home Button */}
     
      
      <StockPredictor />
    </div>
  )
}
