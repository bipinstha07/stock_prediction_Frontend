"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { LandingPage } from "@/components/landing-page"
import { StockPredictor } from "@/components/stock-predictor"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type ViewMode = "landing" | "demo"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>("landing")
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Remove auto-redirect - let users navigate freely
  // useEffect(() => {
  //   if (!isLoading && user) {
  //     router.push('/user')
  //   }
  // }, [user, isLoading, router])

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

  const renderContent = () => {
    switch (currentView) {
      case "demo":
        return <StockPredictor isDemo={true} />
      default:
        return (
          <LandingPage
            onLoginClick={() => router.push('/login')}
            onSignupClick={() => router.push('/login')}
            onDemoClick={() => setCurrentView("demo")}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Show navbar for landing page and when user is logged in */}
      {(currentView === "landing" || user) && (
        <Navbar
          onLoginClick={() => router.push('/login')}
          onSignupClick={() => router.push('/login')}
          onDemoClick={() => setCurrentView("demo")}
          onLogout={() => router.push('/')}
        />
      )}

      {currentView === "demo" && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView("landing")}
                className="text-gray-700 hover:text-gray-900 font-medium cursor-pointer"
              >
                ← Back to Home
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Like what you see?</span>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-1 rounded-md text-sm cursor-pointer"
                >
                  Sign Up Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  )
}
