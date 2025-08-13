"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, LogOut, User, Briefcase, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface NavbarProps {
  onLoginClick?: () => void
  onSignupClick?: () => void
  onDemoClick?: () => void
  onLogout?: () => void
}

export function Navbar({ onLoginClick, onSignupClick, onDemoClick, onLogout }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    // Call the logout function from auth context first
    logout()
    // Then call the onLogout callback if provided
    if (onLogout) {
      onLogout()
    }
    setShowLogoutDialog(false)
  }

  const handleNavigation = (route: string) => {
    switch (route) {
      case 'profile':
        router.push('/profile')
        break
      case 'portfolio':
        router.push('/portfolio')
        break
      case 'settings':
        router.push('/settings')
        break
      default:
        break
    }
    setShowAccountDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">StockPredict AI</span>
          </div>
          


          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
                <div className="relative" ref={accountDropdownRef}>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {showAccountDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleNavigation('profile')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                        >
                          <User className="h-4 w-4 text-gray-600" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('portfolio')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                        >
                          <Briefcase className="h-4 w-4 text-gray-600" />
                          <span>Portfolio</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('settings')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                        >
                          <Settings className="h-4 w-4 text-gray-600" />
                          <span>Settings</span>
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            setShowAccountDropdown(false)
                            setShowLogoutDialog(true)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Logout Confirmation Dialog */}
                <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                  <AlertDialogContent className="bg-white border border-gray-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900">Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-700">
                        Are you sure you want to logout? You'll need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        onClick={() => setShowLogoutDialog(false)}
                        className="text-white hover:text-gray-900 hover:border-gray-900 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-gray-900 text-white hover:bg-red-500 hover:text-white hover:border-red-900 cursor-pointer">
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onDemoClick} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                  Try Demo
                </Button>
                <Button variant="ghost" onClick={onLoginClick} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                  Login
                </Button>
                <Button onClick={onSignupClick} className="bg-gray-900 hover:bg-white hover:text-black hover:border-gray-900 border-2 border-transparent text-white cursor-pointer">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
