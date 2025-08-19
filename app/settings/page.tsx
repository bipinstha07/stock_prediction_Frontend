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
  Settings as SettingsIcon,
  Crown,
  Zap,
  Star,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalTab, setPremiumModalTab] = useState('buy');

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    router.push('/');
  };

  const handleDeactivateAccount = () => {
    // Handle account deactivation logic
    console.log('Deactivating account...');
  };

  const handleActivatePremium = () => {
    setShowPremiumModal(true);
    setPremiumModalTab('buy');
  };

  const handleDeactivatePremium = () => {
    // Handle premium deactivation logic
    console.log('Deactivating premium...');
    // Here you would typically call your backend API to downgrade the user
    // For now, we'll just log the action
  };

  const handleBuyPremium = (plan: string) => {
    // Handle premium purchase logic
    console.log(`Buying premium plan: ${plan}`);
    // Here you would typically call your backend API to upgrade the user
    // For now, we'll just log the action
    setShowPremiumModal(false);
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

  const renderPremium = () => (
    <div className="space-y-8">
      {/* Current Premium Status */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">Premium Status</h3>
              <p className="text-white/70">Manage your premium subscription</p>
            </div>
          </div>
          <Badge 
            variant={user?.isPremium ? "default" : "secondary"}
            className={`${
              user?.isPremium 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            {user?.isPremium ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        {user?.isPremium ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-medium">Unlimited Stocks</span>
                </div>
                <p className="text-white/70 text-sm">Add unlimited stocks to your portfolio</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">Advanced Analytics</span>
                </div>
                <p className="text-white/70 text-sm">Access to technical and fundamental analysis</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">Premium Features</span>
                </div>
                <p className="text-white/70 text-sm">Events, news, reports, and more</p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="border-red-400 text-red-400 hover:bg-red-400/20"
                onClick={() => handleDeactivatePremium()}
              >
                <Crown className="h-4 w-4 mr-2" />
                Deactivate Premium
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400/20"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Free Plan</h4>
                  <p className="text-white/70 text-sm mb-4">Basic features with limited access</p>
                  <ul className="text-white/60 text-sm space-y-2 text-left">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Up to 3 stocks</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Basic overview</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Stock comparison</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border border-yellow-400/30 rounded-lg p-6">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Premium Plan</h4>
                  <p className="text-white/70 text-sm mb-4">Unlock all features and unlimited access</p>
                  <ul className="text-white/60 text-sm space-y-2 text-left">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Unlimited stocks</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Real-time news & events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Financial reports</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-white"
                    onClick={() => handleActivatePremium()}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Activate Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Features Comparison */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Feature Comparison</h3>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-white/10">
            <div className="p-4">
              <h4 className="text-white font-medium text-sm">Features</h4>
            </div>
            <div className="p-4 text-center">
              <h4 className="text-white font-medium text-sm">Free</h4>
            </div>
            <div className="p-4 text-center">
              <h4 className="text-white font-medium text-sm">Premium</h4>
            </div>
            <div className="p-4 text-center">
              <h4 className="text-white font-medium text-sm">Status</h4>
            </div>
          </div>
          
          {[
            { feature: 'Portfolio Stocks', free: '3', premium: 'Unlimited', current: user?.isPremium ? 'Unlimited' : '3' },
            { feature: 'Technical Analysis', free: '❌', premium: '✅', current: user?.isPremium ? '✅' : '❌' },
            { feature: 'Fundamental Analysis', free: '❌', premium: '✅', current: user?.isPremium ? '✅' : '❌' },
            { feature: 'Company Events', free: '❌', premium: '✅', current: user?.isPremium ? '✅' : '❌' },
            { feature: 'Real-time News', free: '❌', premium: '✅', current: user?.isPremium ? '✅' : '❌' },
            { feature: 'Financial Reports', free: '❌', premium: '✅', current: user?.isPremium ? '✅' : '❌' },
            { feature: 'Stock Comparison', free: '✅', premium: '✅', current: '✅' },
            { feature: 'Priority Support', free: '❌', premium: '✅', current: user?.isPremium ? '✅' : '❌' },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-4 divide-x divide-white/10 border-t border-white/10">
              <div className="p-4">
                <span className="text-white/80 text-sm">{item.feature}</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-white/60 text-sm">{item.free}</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-white/60 text-sm">{item.premium}</span>
              </div>
              <div className="p-4 text-center">
                <span className={`text-sm font-medium ${
                  item.current === '✅' ? 'text-green-400' : 
                  item.current === '❌' ? 'text-red-400' : 'text-white'
                }`}>
                  {item.current}
                </span>
              </div>
            </div>
          ))}
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
      case 'premium':
        return renderPremium();
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
                        { id: 'premium', label: 'Premium', icon: Crown },
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
                    {activeSection === 'premium' && 'Premium Management'}
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

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 border border-white/20 shadow-2xl max-w-2xl mx-4">
            <CardHeader className="border-b border-white/20 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Crown className="h-12 w-12 text-yellow-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Upgrade to Premium</CardTitle>
                  <CardDescription className="text-white/70 text-lg">
                    Unlock unlimited stock management and advanced analytics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-white">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-lg">Add unlimited stocks to your portfolio</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-lg">Advanced technical analysis tools</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-lg">Real-time news and events</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-lg">Financial reports and insights</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center py-6 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-4xl font-bold text-white">$9.99</div>
                  <div className="text-white/70 text-lg">per month</div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-white py-3 text-lg font-semibold"
                    onClick={() => handleBuyPremium('monthly')}
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 py-3"
                    onClick={() => setShowPremiumModal(false)}
                  >
                    Cancel
                  </Button>
                </div>

                <div className="text-center text-white/60 text-sm">
                  <p>30-day money-back guarantee • Cancel anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
