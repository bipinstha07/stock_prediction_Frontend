"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface NavbarProps {
  onLoginClick?: () => void
  onSignupClick?: () => void
  onDemoClick?: () => void
  onLogout?: () => void
}

export function Navbar({ onLoginClick, onSignupClick, onDemoClick, onLogout }: NavbarProps) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    // Call the logout function from auth context first
    logout()
    // Then call the onLogout callback if provided
    if (onLogout) {
      onLogout()
    }
  }

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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border border-gray-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900">Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-700">
                        Are you sure you want to logout? You'll need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-white hover:text-gray-900 hover:border-gray-900 hover:bg-gray-100 cursor-pointer">Cancel</AlertDialogCancel>
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
