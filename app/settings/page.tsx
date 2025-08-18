'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  User, 
  Shield, 
  TrendingUp, 
  Users, 
  Palette, 
  LogOut, 
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Navbar } from '@/components/navbar';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    router.push('/');
  };

  const handleDeactivateAccount = () => {
    // Handle account deactivation logic
    console.log('Deactivating account...');
  };

  const renderPersonalInformation = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Contact information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Name</span>
            <span className="text-white font-medium">{user?.name || 'Not provided'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Email Address</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{user?.email || 'Not provided'}</span>
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Verified</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Phone Number</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{user?.number || 'Not provided'}</span>
              {user?.number && (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Verified</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Address</span>
            <span className="text-white font-medium">{user?.address || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Other details</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Account numbers</span>
            <Button variant="link" className="text-green-400 hover:text-green-300 p-0 h-auto">
              See account numbers
            </Button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Investor profile</span>
            <Button variant="ghost" className="text-white hover:text-white/80 p-0 h-auto">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/70">Trusted Contact</span>
            <span className="text-white font-medium">None listed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityAndPrivacy = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Security and Privacy</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Two-Factor Authentication</span>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            Enable
          </Button>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Password</span>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            Change
          </Button>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Login History</span>
          <Button variant="ghost" className="text-white hover:text-white/80 p-0 h-auto">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderInvesting = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Investing Preferences</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Risk Tolerance</span>
          <span className="text-white font-medium">Moderate</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Investment Goals</span>
          <Button variant="ghost" className="text-white hover:text-white/80 p-0 h-auto">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Auto-Invest</span>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            Configure
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBeneficiaries = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Beneficiaries</h3>
      <div className="space-y-4">
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60">No beneficiaries added yet</p>
          <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
            Add Beneficiary
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAppAppearance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">App Appearance</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Theme</span>
          <span className="text-white font-medium">Dark</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Font Size</span>
          <span className="text-white font-medium">Medium</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-white/70">Notifications</span>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            Configure
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInformation();
      case 'security':
        return renderSecurityAndPrivacy();
      case 'investing':
        return renderInvesting();
      case 'beneficiaries':
        return renderBeneficiaries();
      case 'appearance':
        return renderAppAppearance();
      default:
        return renderPersonalInformation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />
        


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex space-x-8">
            {/* Left Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      Account details and options
                    </h3>
                    <div className="space-y-2">
                      {[
                        { id: 'personal', label: 'Personal information', icon: User },
                        { id: 'security', label: 'Security and privacy', icon: Shield },
                        { id: 'investing', label: 'Investing', icon: TrendingUp },
                        { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                            activeSection === item.id
                              ? 'bg-white/20 text-white'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      App preferences
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveSection('appearance')}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                          activeSection === 'appearance'
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Palette className="h-4 w-4" />
                        <span className="text-sm">App appearance</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-6 space-y-2">
                    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                      <AlertDialogTrigger asChild>
                        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Log out</span>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-white/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900">Confirm Logout</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-700">
                            Are you sure you want to log out of your account?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <button
                      onClick={handleDeactivateAccount}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left text-orange-400 hover:text-orange-300 hover:bg-white/10 transition-colors"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Deactivate your account</span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <SettingsIcon className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    {activeSection === 'personal' && 'Personal information'}
                    {activeSection === 'security' && 'Security and Privacy'}
                    {activeSection === 'investing' && 'Investing Preferences'}
                    {activeSection === 'beneficiaries' && 'Beneficiaries'}
                    {activeSection === 'appearance' && 'App Appearance'}
                  </h2>
                </div>
                
                {renderMainContent()}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
