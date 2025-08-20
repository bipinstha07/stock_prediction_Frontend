'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  TrendingUp, 
  Star, 
  Crown, 
  Plus, 
  BarChart3, 
  Building2, 
  Calendar, 
  Newspaper, 
  FileText, 
  Scale,
  ArrowLeft,
  Lock,
  CheckCircle,
  XCircle,
  ChevronRight,
  DollarSign,
  Users,
  Globe,
  Target,
  Zap,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  marketCap: string;
  pe: number;
  dividend: number;
}

interface CompanyDetails {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  employees: number;
  website: string;
  description: string;
  ceo: string;
  founded: number;
  headquarters: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [compareStock, setCompareStock] = useState<string>('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'fundamental' | 'technical' | 'events' | 'news' | 'reports' | 'compare'>('overview');
  const [stockSearch, setStockSearch] = useState<string>('');
  const [userPortfolio, setUserPortfolio] = useState<Stock[]>([]);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newStockSymbol, setNewStockSymbol] = useState("");
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [addStockMessage, setAddStockMessage] = useState("");

  // Initialize user portfolio based on premium status
  useEffect(() => {
    if (user?.isPremium) {
      // Premium users start with all stocks
      setUserPortfolio(allStocks);
    } else {
      // Free users start with first 3 stocks
      setUserPortfolio(allStocks.slice(0, 3));
    }
  }, [user?.isPremium]);

  // Function to add a new stock to portfolio
  const handleAddNewStock = async () => {
    if (!newStockSymbol.trim()) return;
    
    setIsAddingStock(true);
    
    try {
      // Here you would typically call your backend API
      // For now, we'll simulate adding a new stock
      const newStock: Stock = {
        symbol: newStockSymbol.trim().toUpperCase(),
        name: `${newStockSymbol.trim().toUpperCase()} Inc.`,
        price: Math.random() * 500 + 50, // Random price between 50-550
        change: (Math.random() - 0.5) * 20, // Random change between -10 to +10
        changePercent: (Math.random() - 0.5) * 10, // Random percentage
        sector: 'Technology', // Default sector
        marketCap: '100B', // Default market cap
        pe: Math.random() * 50 + 10, // Random P/E between 10-60
        dividend: Math.random() * 2 // Random dividend between 0-2
      };
      
      // Add to portfolio
      setUserPortfolio(prev => [...prev, newStock]);
      
      // Clear input and close modal
      setNewStockSymbol("");
      setShowAddStockModal(false);
      
      // Show success message
      setAddStockMessage(`✅ Successfully added ${newStock.symbol} to your portfolio!`);
      setTimeout(() => setAddStockMessage(""), 3000); // Clear message after 3 seconds
      
    } catch (error) {
      console.error('❌ Error adding stock:', error);
      setAddStockMessage("❌ Error adding stock. Please try again.");
      setTimeout(() => setAddStockMessage(""), 3000);
    } finally {
      setIsAddingStock(false);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('🏠 PROFILE PAGE - User object:', user);
    console.log('🏠 PROFILE PAGE - isPremium:', user?.isPremium);
    console.log('🏠 PROFILE PAGE - isPremium type:', typeof user?.isPremium);
    console.log('🏠 PROFILE PAGE - User JSON:', JSON.stringify(user, null, 2));
    console.log('🏠 PROFILE PAGE - User from localStorage:', localStorage.getItem('user'));
    
    // Check if user is actually premium
    if (user?.isPremium) {
      console.log('✅ PROFILE PAGE - User IS PREMIUM - Unlocking all features!');
    } else {
      console.log('❌ PROFILE PAGE - User is NOT PREMIUM - Features restricted');
    }
  }, [user]);

  // All available stocks
  const allStocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      sector: 'Technology',
      marketCap: '2.7T',
      pe: 28.5,
      dividend: 0.92
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 338.11,
      change: -1.23,
      changePercent: -0.36,
      sector: 'Technology',
      marketCap: '2.5T',
      pe: 32.1,
      dividend: 0.68
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.56,
      change: 0.89,
      changePercent: 0.63,
      sector: 'Technology',
      marketCap: '1.8T',
      pe: 25.8,
      dividend: 0.00
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.50,
      change: 5.20,
      changePercent: 2.14,
      sector: 'Automotive',
      marketCap: '789B',
      pe: 78.2,
      dividend: 0.00
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 145.80,
      change: -0.95,
      changePercent: -0.65,
      sector: 'E-commerce',
      marketCap: '1.5T',
      pe: 45.3,
      dividend: 0.00
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 485.09,
      change: 12.45,
      changePercent: 2.64,
      sector: 'Technology',
      marketCap: '1.2T',
      pe: 65.8,
      dividend: 0.16
    },
    // Additional premium stocks
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      price: 485.58,
      change: 8.45,
      changePercent: 1.77,
      sector: 'Technology',
      marketCap: '1.2T',
      pe: 24.2,
      dividend: 0.00
    },
    {
      symbol: 'BRK.A',
      name: 'Berkshire Hathaway Inc.',
      price: 612000.00,
      change: 1500.00,
      changePercent: 0.25,
      sector: 'Financial Services',
      marketCap: '880B',
      pe: 9.8,
      dividend: 0.00
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      price: 172.45,
      change: -1.20,
      changePercent: -0.69,
      sector: 'Financial Services',
      marketCap: '520B',
      pe: 12.5,
      dividend: 2.8
    },
    {
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      price: 158.90,
      change: 0.85,
      changePercent: 0.54,
      sector: 'Healthcare',
      marketCap: '385B',
      pe: 16.8,
      dividend: 2.9
    }
  ];

  // Get stocks based on user's premium status
  const userStocks = user?.isPremium ? allStocks : allStocks.slice(0, 3);

  // Company details for selected stock
  const getCompanyDetails = (symbol: string): CompanyDetails => {
    const companies = {
      AAPL: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        employees: 164000,
        website: 'www.apple.com',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
        ceo: 'Tim Cook',
        founded: 1976,
        headquarters: 'Cupertino, California'
      },
      MSFT: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        sector: 'Technology',
        industry: 'Software',
        employees: 221000,
        website: 'www.microsoft.com',
        description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
        ceo: 'Satya Nadella',
        founded: 1975,
        headquarters: 'Redmond, Washington'
      },
      GOOGL: {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        sector: 'Technology',
        industry: 'Internet Services',
        employees: 156500,
        website: 'www.google.com',
        description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
        ceo: 'Sundar Pichai',
        founded: 1998,
        headquarters: 'Mountain View, California'
      }
    };
    return companies[symbol as keyof typeof companies] || companies.AAPL;
  };

  const currentCompany = getCompanyDetails(selectedStock);

  // Filter stocks based on search term
  const filteredUserStocks = userPortfolio.filter(stock =>
    stock.symbol.toLowerCase().includes(stockSearch.toLowerCase()) ||
    stock.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
    stock.sector.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const renderStockCard = (stock: Stock, isPremium: boolean = false) => (
    <div 
      key={stock.symbol}
      className={`flex items-center justify-between py-3 px-3 sm:py-2 sm:px-1 cursor-pointer transition-all duration-200 rounded ${
        selectedStock === stock.symbol ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
      onClick={() => setSelectedStock(stock.symbol)}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white text-sm truncate">{stock.name}</h3>
        <span className="text-white/70 text-xs">{stock.sector}</span>
      </div>
      <div className="text-right ml-3">
        <div className="text-white font-semibold text-sm">${stock.price.toFixed(2)}</div>
        <div className="text-white/60 text-xs">{stock.symbol}</div>
      </div>
    </div>
  );

  const renderCompanyOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">CEO</span>
              <span className="text-white">{currentCompany.ceo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Founded</span>
              <span className="text-white">{currentCompany.founded}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Employees</span>
              <span className="text-white">{currentCompany.employees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Headquarters</span>
              <span className="text-white">{currentCompany.headquarters}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Market Cap</span>
              <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">P/E Ratio</span>
              <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.pe}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Dividend Yield</span>
              <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.dividend}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Sector</span>
              <span className="text-white">{currentCompany.sector}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Company Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 leading-relaxed">{currentCompany.description}</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderStockComparison = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-white/70">Compare</span>
          <span className="text-white font-semibold">{selectedStock}</span>
          <span className="text-white/70">with</span>
        </div>
        <select
          value={compareStock}
          onChange={(e) => setCompareStock(e.target.value)}
          className="bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2 focus:border-blue-400 w-full sm:w-auto"
        >
          <option value="">Select stock to compare</option>
          {userStocks.map(stock => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      {compareStock && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">{selectedStock}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Price</span>
                  <span className="text-white">${userStocks.find(s => s.symbol === selectedStock)?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">P/E</span>
                  <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.pe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Market Cap</span>
                  <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.marketCap}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">{compareStock}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Price</span>
                  <span className="text-white">${userStocks.find(s => s.symbol === selectedStock)?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">P/E</span>
                  <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.pe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Market Cap</span>
                  <span className="text-white">{userStocks.find(s => s.symbol === selectedStock)?.marketCap}</span>
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );

  const renderPremiumModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 border border-white/20 shadow-2xl w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-white">Upgrade to Premium</CardTitle>
          <CardDescription className="text-white/80 text-sm sm:text-base">
            Unlock unlimited stock management and advanced analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Add unlimited stocks to your portfolio</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Advanced technical analysis tools</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Real-time news and events</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Financial reports and insights</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">$9.99<span className="text-base sm:text-lg text-white/70">/month</span></div>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3">
              Upgrade Now
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowPremiumModal(false)}
            className="w-full text-white/70 hover:text-white hover:bg-white/10"
          >
            Maybe Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/user')}
              className="text-white/80 hover:text-white hover:bg-white/20 w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile & Portfolio</h1>
              <p className="text-white/70 text-sm sm:text-base">Manage your stocks and analyze companies</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge variant="secondary" className={`${user?.isPremium ? 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30' : 'bg-blue-500/20 text-blue-100 border-blue-400/30'} w-fit`}>
              {user?.isPremium ? (
                <>
                  <Crown className="h-4 w-4 mr-1" />
                  Premium Plan
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-1" />
                  Free Plan
                </>
              )}
            </Badge>
            {!user?.isPremium && (
              <Button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white w-fit"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Stocks Section - First on mobile, hidden on desktop */}
        <div className="lg:hidden space-y-6 mb-6">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                My Stocks
              </CardTitle>
              <CardDescription className="text-white/70">
                {user?.isPremium ? (
                  `${filteredUserStocks.length} of unlimited stocks (Premium Plan)`
                ) : (
                  `${filteredUserStocks.length} of ${userPortfolio.length} stocks (Free Plan)`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
                <div className="absolute right-3 top-2.5">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Scrollable Stocks List */}
              <div className="h-[200px] overflow-y-auto space-y-2 pr-2">
                {filteredUserStocks.map(stock => renderStockCard(stock))}
              </div>
              
              <div className="pt-3 border-t border-white/20">
                {user?.isPremium ? (
                  <Button
                    onClick={() => setShowAddStockModal(true)}
                    variant="outline"
                    className="w-full border-green-400/30 text-green-400 hover:bg-green-400/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Stock
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Stocks
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {!user?.isPremium && (
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Premium Stocks
                </CardTitle>
                <CardDescription className="text-white/70">
                  Unlock with Premium Plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <p className="text-white/70 mb-2">Premium stocks locked</p>
                  <Button onClick={() => setShowPremiumModal(true)} variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Stock Management (Hidden on mobile, visible on desktop) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  My Stocks
                </CardTitle>
                <CardDescription className="text-white/70">
                  {user?.isPremium ? (
                    `${filteredUserStocks.length} of unlimited stocks (Premium Plan)`
                  ) : (
                    `${filteredUserStocks.length} of ${userPortfolio.length} stocks (Free Plan)`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  />
                  <div className="absolute right-3 top-2.5">
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {filteredUserStocks.map(stock => renderStockCard(stock))}
                
                <div className="pt-3 border-t border-white/20">
                  {user?.isPremium ? (
                    <Button
                      onClick={() => setShowAddStockModal(true)}
                      variant="outline"
                      className="w-full border-green-400/30 text-green-400 hover:bg-green-400/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Stock
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowPremiumModal(true)}
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Stocks
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            
          </div>

          {/* Main Content - Company Analysis */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-6 lg:self-start lg:h-fit">
            {/* Company Header */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{selectedStock}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl text-white">{currentCompany.name}</CardTitle>
                      <CardDescription className="text-white/70 text-sm">
                        {currentCompany.sector} • {currentCompany.industry}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      ${userStocks.find(s => s.symbol === selectedStock)?.price.toFixed(2)}
                    </div>
                    <div className={`text-sm ${userStocks.find(s => s.symbol === selectedStock)?.changePercent! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {userStocks.find(s => s.symbol === selectedStock)?.changePercent! >= 0 ? '+' : ''}
                      {userStocks.find(s => s.symbol === selectedStock)?.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>



            {/* Navigation Tabs */}
            <div className="overflow-x-auto">
              <div className="flex space-x-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1 min-w-max">
                {[
                  { id: 'overview', label: 'Overview', icon: Building2 },
                  { id: 'fundamental', label: 'Fundamental', icon: BarChart3 },
                  { id: 'technical', label: 'Technical', icon: TrendingUp },
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'news', label: 'News', icon: Newspaper },
                  { id: 'reports', label: 'Reports', icon: FileText },
                  { id: 'compare', label: 'Compare Stocks', icon: Scale }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && renderCompanyOverview()}
                             {activeTab === 'fundamental' && (
                 <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                   <CardHeader>
                     <CardTitle className="text-white flex items-center gap-2">
                       {user?.isPremium ? (
                         <BarChart3 className="h-5 w-5 text-green-400" />
                       ) : (
                         <Lock className="h-5 w-5 text-yellow-400" />
                       )}
                       Fundamental Analysis
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     {user?.isPremium ? (
                       <div className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                           <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                             <CardHeader>
                               <CardTitle className="text-white text-lg">Financial Ratios</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3">
                               <div className="flex justify-between">
                                 <span className="text-white/70">ROE</span>
                                 <span className="text-white">15.2%</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">ROA</span>
                                 <span className="text-white">8.7%</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">Debt-to-Equity</span>
                                 <span className="text-white">0.45</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">Current Ratio</span>
                                 <span className="text-white">1.8</span>
                               </div>
                             </CardContent>
                           </Card>
                           <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                             <CardHeader>
                               <CardTitle className="text-white text-lg">Growth Metrics</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3">
                               <div className="flex justify-between">
                                 <span className="text-white/70">Revenue Growth</span>
                                 <span className="text-green-400">+12.5%</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">EPS Growth</span>
                                 <span className="text-green-400">+18.2%</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">Dividend Growth</span>
                                 <span className="text-green-400">+5.8%</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">Book Value Growth</span>
                                 <span className="text-green-400">+9.3%</span>
                               </div>
                             </CardContent>
                           </Card>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center py-12">
                         <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                         <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
                         <p className="text-white/70 mb-4">Upgrade to access detailed fundamental analysis</p>
                         <Button onClick={() => setShowPremiumModal(true)}>
                           <Crown className="h-4 w-4 mr-2" />
                           Upgrade to Premium
                         </Button>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               )}
                             {activeTab === 'technical' && (
                 <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                   <CardHeader>
                     <CardTitle className="text-white flex items-center gap-2">
                       {user?.isPremium ? (
                         <TrendingUp className="h-5 w-5 text-green-400" />
                       ) : (
                         <Lock className="h-5 w-5 text-yellow-400" />
                       )}
                       Technical Analysis
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     {user?.isPremium ? (
                       <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                             <CardHeader>
                               <CardTitle className="text-white text-lg">Moving Averages</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3">
                               <div className="flex justify-between">
                                 <span className="text-white/70">SMA (20)</span>
                                 <span className="text-white">$172.45</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">EMA (20)</span>
                                 <span className="text-white">$173.20</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">SMA (50)</span>
                                 <span className="text-white">$168.90</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">SMA (200)</span>
                                 <span className="text-white">$165.30</span>
                               </div>
                             </CardContent>
                           </Card>
                           <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                             <CardHeader>
                               <CardTitle className="text-white text-lg">Technical Indicators</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3">
                               <div className="flex justify-between">
                                 <span className="text-white/70">RSI (14)</span>
                                 <span className="text-white">58.5</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">MACD</span>
                                 <span className="text-green-400">+2.15</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">Bollinger Bands</span>
                                 <span className="text-white">$170.20</span>
                               </div>
                               <div className="flex justify-between">
                                 <span className="text-white/70">Volume</span>
                                 <span className="text-white">45.2M</span>
                               </div>
                             </CardContent>
                           </Card>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center py-12">
                         <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                         <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
                         <p className="text-white/70 mb-4">Upgrade to access advanced technical indicators</p>
                         <Button onClick={() => setShowPremiumModal(true)}>
                           <Crown className="h-4 w-4 mr-2" />
                           Upgrade to Premium
                         </Button>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               )}
              {activeTab === 'events' && (
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {user?.isPremium ? (
                        <Calendar className="h-5 w-5 text-green-400" />
                      ) : (
                        <Lock className="h-5 w-5 text-yellow-400" />
                      )}
                      Company Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user?.isPremium ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                            <CardHeader>
                              <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="border-l-4 border-blue-400 pl-3 py-2">
                                <div className="text-white font-medium">Earnings Call</div>
                                <div className="text-white/70 text-sm">Q4 2024 Results</div>
                                <div className="text-blue-400 text-xs">January 25, 2025</div>
                              </div>
                              <div className="border-l-4 border-green-400 pl-3 py-2">
                                <div className="text-white font-medium">Annual Meeting</div>
                                <div className="text-white/70 text-sm">Shareholder Meeting</div>
                                <div className="text-green-400 text-xs">March 15, 2025</div>
                              </div>
                              <div className="border-l-4 border-purple-400 pl-3 py-2">
                                <div className="text-white font-medium">Product Launch</div>
                                <div className="text-white/70 text-sm">New iPhone Series</div>
                                <div className="text-purple-400 text-xs">September 2025</div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                            <CardHeader>
                              <CardTitle className="text-white text-lg">Recent Events</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="border-l-4 border-gray-400 pl-3 py-2">
                                <div className="text-white font-medium">Q3 Earnings</div>
                                <div className="text-white/70 text-sm">Beat expectations by 8%</div>
                                <div className="text-gray-400 text-xs">October 28, 2024</div>
                              </div>
                              <div className="border-l-4 border-gray-400 pl-3 py-2">
                                <div className="text-white font-medium">Board Meeting</div>
                                <div className="text-white/70 text-sm">Dividend increase approved</div>
                                <div className="text-gray-400 text-xs">September 15, 2024</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
                        <p className="text-white/70 mb-4">Upgrade to access upcoming events and earnings</p>
                        <Button onClick={() => setShowPremiumModal(true)}>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {activeTab === 'news' && (
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {user?.isPremium ? (
                        <Newspaper className="h-5 w-5 text-green-400" />
                      ) : (
                        <Lock className="h-5 w-5 text-yellow-400" />
                      )}
                      Company News
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user?.isPremium ? (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                <div className="flex-1">
                                  <h4 className="text-white font-medium mb-2">Apple Reports Record Q4 Revenue</h4>
                                  <p className="text-white/70 text-sm mb-2">Apple Inc. announced record-breaking Q4 revenue of $119.6 billion, driven by strong iPhone sales and services growth.</p>
                                  <div className="text-blue-400 text-xs">2 hours ago • Financial Times</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                <div className="flex-1">
                                  <h4 className="text-white font-medium mb-2">New AI Features Coming to iPhone 16</h4>
                                  <p className="text-white/70 text-sm mb-2">Apple is reportedly working on advanced AI features for the upcoming iPhone 16, including enhanced Siri capabilities.</p>
                                  <div className="text-blue-400 text-xs">5 hours ago • TechCrunch</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                <div className="flex-1">
                                  <h4 className="text-white font-medium mb-2">Apple Expands Renewable Energy Initiatives</h4>
                                  <p className="text-white/70 text-sm mb-2">The company announced new partnerships to achieve 100% renewable energy across all operations by 2030.</p>
                                  <div className="text-blue-400 text-xs">1 day ago • Bloomberg</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
                        <p className="text-white/70 mb-4">Upgrade to access real-time news and updates</p>
                        <Button onClick={() => setShowPremiumModal(true)}>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
                             {activeTab === 'reports' && (
                 <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                   <CardHeader>
                     <CardTitle className="text-white flex items-center gap-2">
                       {user?.isPremium ? (
                         <FileText className="h-5 w-5 text-green-400" />
                       ) : (
                         <Lock className="h-5 w-5 text-yellow-400" />
                       )}
                       Financial Reports
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     {user?.isPremium ? (
                       <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                             <CardHeader>
                               <CardTitle className="text-white text-lg">Quarterly Reports</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3">
                               <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <div>
                                   <div className="text-white font-medium">Q4 2024</div>
                                   <div className="text-white/70 text-sm">Revenue: $119.6B</div>
                                 </div>
                                 <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/20">
                                   <Download className="h-4 w-4 mr-1" />
                                   PDF
                                 </Button>
                               </div>
                               <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <div>
                                   <div className="text-white font-medium">Q3 2024</div>
                                   <div className="text-white/70 text-sm">Revenue: $89.5B</div>
                                 </div>
                                 <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/20">
                                   <Download className="h-4 w-4 mr-1" />
                                   PDF
                                 </Button>
                               </div>
                               <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <div>
                                   <div className="text-white font-medium">Q2 2024</div>
                                   <div className="text-white/70 text-sm">Revenue: $94.8B</div>
                                 </div>
                                 <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/20">
                                   <Download className="h-4 w-4 mr-1" />
                                   PDF
                                 </Button>
                               </div>
                             </CardContent>
                           </Card>
                           <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                             <CardHeader>
                               <CardTitle className="text-white text-lg">Annual Reports</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3">
                               <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <div>
                                   <div className="text-white font-medium">2024 Annual Report</div>
                                   <div className="text-white/70 text-sm">Full year financial summary</div>
                                 </div>
                                 <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/20">
                                   <Download className="h-4 w-4 mr-1" />
                                   PDF
                                 </Button>
                               </div>
                               <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <div>
                                   <div className="text-white font-medium">2023 Annual Report</div>
                                   <div className="text-white/70 text-sm">Previous year analysis</div>
                                 </div>
                                 <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/20">
                                   <Download className="h-4 w-4 mr-1" />
                                   Download
                                 </Button>
                               </div>
                             </CardContent>
                           </Card>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center py-12">
                         <Lock className="h-16 w-16 text-yellow-400 mx-2" />
                         <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
                         <p className="text-white/70 mb-4">Upgrade to access quarterly reports and analysis</p>
                         <Button onClick={() => setShowPremiumModal(true)}>
                           <Crown className="h-4 w-4 mr-2" />
                           Upgrade to Premium
                         </Button>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               )}
               {activeTab === 'compare' && (
                 <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                   <CardHeader>
                     <CardTitle className="text-white flex items-center gap-2">
                       <Scale className="h-5 w-5 text-purple-400" />
                       Stock Comparison
                     </CardTitle>
                     <CardDescription className="text-white/70">
                       Compare fundamentals between different stocks
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     {renderStockComparison()}
                   </CardContent>
                 </Card>
               )}
            </div>

            
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && renderPremiumModal()}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Add New Stock to Portfolio</CardTitle>
              <CardDescription className="text-white/70 text-center">
                Search and add stocks to your premium portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={newStockSymbol}
                    onChange={(e) => setNewStockSymbol(e.target.value)}
                    placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)..."
                    className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:border-blue-400 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNewStock()}
                  />
                  <div className="absolute right-4 top-3.5">
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={handleAddNewStock}
                    disabled={!newStockSymbol.trim() || isAddingStock}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isAddingStock ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Adding Stock...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Stock to Portfolio
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center text-white/60 text-sm">
                  Enter any stock symbol and our backend will handle the rest!
                </div>
                
                {/* Success/Error Message */}
                {addStockMessage && (
                  <div className={`text-center text-sm font-medium p-3 rounded-lg ${
                    addStockMessage.startsWith('✅') 
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-400/30'
                  }`}>
                    {addStockMessage}
                  </div>
                )}
              </div>

              {/* Stock Categories */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {['Technology', 'Financial Services', 'Healthcare', 'Automotive', 'E-commerce', 'All'].map(category => (
                  <button
                    key={category}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-xs sm:text-sm transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Available Stocks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {allStocks.filter(stock => !userPortfolio.find(p => p.symbol === stock.symbol)).map(stock => (
                  <Card 
                    key={stock.symbol}
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setUserPortfolio([...userPortfolio, stock]);
                      setShowAddStockModal(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{stock.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">${stock.price.toFixed(2)}</div>
                          <div className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-white text-sm mb-2">{stock.name}</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/60">Sector:</span>
                          <span className="text-white/80">{stock.sector}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Market Cap:</span>
                          <span className="text-white/80">{stock.marketCap}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">P/E:</span>
                          <span className="text-white/80">{stock.pe}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="flex items-center justify-center text-green-400 text-sm font-medium">
                          <Plus className="h-4 w-4 mr-1" />
                          Click to Add
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Add Section */}
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Quick Add Popular Stocks</h3>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA'].map(symbol => {
                    const stock = allStocks.find(s => s.symbol === symbol);
                    if (!stock || userPortfolio.find(p => p.symbol === symbol)) return null;
                    return (
                      <button
                        key={symbol}
                        onClick={() => {
                          setUserPortfolio([...userPortfolio, stock]);
                          setShowAddStockModal(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 rounded-lg text-white text-sm transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>{symbol}</span>
                        <Plus className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center sm:justify-end space-x-3 pt-4 border-t border-white/20">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAddStockModal(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
