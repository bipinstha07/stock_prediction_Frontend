"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, LogOut, User, Briefcase, Settings, ChevronDown, Menu, X } from "lucide-react"
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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    // Call the logout function from auth context first
    logout()
    // Then call the onLogout callback if provided
    if (onLogout) {
      onLogout()
    }
    // Redirect to home page after logout
    router.push('/')
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
    setShowMobileMenu(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showMobileMenu])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileMenu])

  return (
    <nav className="bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-pink-900/90 shadow-lg relative z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            <span className="text-lg sm:text-xl font-bold text-white">StockPredict AI</span>
          </div>
          


          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Predict Now Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/user')}
              className="text-white/90 hover:text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm"
            >
              Predict Now
            </Button>
            
            {user ? (
              <>
                <span className="text-white/90 font-medium">Welcome, {user.name}</span>
                <div className="relative" ref={accountDropdownRef}>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="text-white/90 hover:text-white hover:bg-white/20 flex items-center space-x-2 cursor-pointer backdrop-blur-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {showAccountDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-purple-900/95 border border-white/30 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleNavigation('profile')}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20 flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <User className="h-4 w-4 text-white/80" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('portfolio')}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20 flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <Briefcase className="h-4 w-4 text-white/80" />
                          <span>AI Stock Analysis</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('settings')}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20 flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <Settings className="h-4 w-4 text-white/80" />
                          <span>Settings</span>
                        </button>
                        <div className="border-t border-white/30 my-1"></div>
                        <button
                          onClick={() => {
                            setShowAccountDropdown(false)
                            setShowLogoutDialog(true)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 flex items-center space-x-2 cursor-pointer transition-colors"
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
                  <AlertDialogContent className="bg-purple-900/95 border border-white/30 shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white font-semibold">Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/90">
                        Are you sure you want to logout? You'll need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        onClick={() => setShowLogoutDialog(false)}
                        className="text-white/90 hover:text-white hover:bg-white/20 hover:border-white/50 cursor-pointer"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 hover:text-white border border-red-400 cursor-pointer">
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onDemoClick} className="text-white/90 hover:text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm">
                  Try Demo
                </Button>
                <Button variant="ghost" onClick={onLoginClick} className="text-white/90 hover:text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm">
                  Login
                </Button>
                <Button onClick={onSignupClick} className="bg-white/20 hover:bg-white/30 text-white hover:text-white border border-white/30 hover:border-white/50 cursor-pointer backdrop-blur-sm">Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white/90 hover:text-white hover:bg-white/20 p-2 transition-all duration-200"
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>


        
        {/* Mobile Menu - Compact overlay */}
        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute top-16 right-2 w-64 bg-purple-900/95 border border-white/30 rounded-lg shadow-xl z-40 transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          >
            {/* Mobile Menu Header - Close Button Only */}
            <div className="flex items-center justify-end px-3 py-2 border-b border-white/20">
              <Button
                variant="ghost"
                onClick={() => setShowMobileMenu(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="px-3 py-3 space-y-2">
              {/* Predict Now Button */}
              <Button
                variant="ghost"
                onClick={() => {
                  router.push('/user')
                  setShowMobileMenu(false)
                }}
                className="w-full text-left text-white/90 hover:text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm justify-start h-10 text-sm"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Predict Now
              </Button>
              
              {user ? (
                <>
                  {/* User Welcome */}
                  <div className="px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                    <p className="text-white/90 font-medium text-center text-sm">Welcome, {user.name}</p>
                  </div>
                  
                  {/* User Navigation */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation('profile')}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/20 active:bg-white/30 flex items-center space-x-2 cursor-pointer transition-colors rounded-lg touch-manipulation"
                    >
                      <User className="h-4 w-4 text-white/80" />
                      <span className="text-sm">Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('portfolio')}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/20 active:bg-white/30 flex items-center space-x-2 cursor-pointer transition-colors rounded-lg touch-manipulation"
                    >
                      <Briefcase className="h-4 w-4 text-white/80" />
                      <span className="text-sm">AI Stock Analysis</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('settings')}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/20 active:bg-white/30 flex items-center space-x-2 cursor-pointer transition-colors rounded-lg touch-manipulation"
                    >
                      <Settings className="h-4 w-4 text-white/80" />
                      <span className="text-sm">Settings</span>
                    </button>
                    
                    {/* Logout Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setShowMobileMenu(false)
                          setShowLogoutDialog(true)
                        }}
                        className="w-full text-left px-3 py-2 text-red-300 hover:bg-red-500/20 active:bg-red-500/30 flex items-center space-x-2 cursor-pointer transition-colors rounded-lg touch-manipulation"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest Navigation */}
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        onDemoClick?.()
                        setShowMobileMenu(false)
                      }} 
                      className="w-full text-white/90 hover:text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm justify-start h-10 text-sm"
                    >
                      Try Demo
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        onLoginClick?.()
                        setShowMobileMenu(false)
                      }} 
                      className="w-full text-left text-white/90 hover:text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm justify-start h-10 text-sm"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        onSignupClick?.()
                        setShowMobileMenu(false)
                      }} 
                      className="w-full bg-white/20 hover:bg-white/30 text-white hover:text-white border border-white/30 hover:border-white/50 cursor-pointer backdrop-blur-sm h-10 text-sm"
                    >
                      Sign Up
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
