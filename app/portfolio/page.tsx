"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  TrendingUp, 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Brain, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Target,
  Search,
  Star,
  Clock,
  BookOpen,
  Lightbulb,
  TrendingDown,
  Activity,
  DollarSign,
  Globe,
  Building2
} from "lucide-react"
import { Navbar } from "@/components/navbar"

interface StockCompany {
  symbol: string
  name: string
  sector: string
  price?: number
  change?: number
  marketCap?: string
}

interface AIAnalysis {
  question: string
  answer: string
  timestamp: Date
  category?: string
}

export default function PortfolioPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedStock, setSelectedStock] = useState<string>("AAPL")
  const [userQuestion, setUserQuestion] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState<AIAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("analysis")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Enhanced stock companies with more data
  const stockCompanies = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 175.43, change: 2.34, marketCap: "2.7T" },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 142.56, change: -1.23, marketCap: "1.8T" },
    { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", price: 338.11, change: 3.45, marketCap: "2.5T" },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 248.50, change: -5.67, marketCap: "789B" },
    { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce", price: 145.80, change: 1.89, marketCap: "1.5T" },
    { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", price: 334.92, change: 4.12, marketCap: "848B" },
    { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", price: 485.09, change: 8.76, marketCap: "1.2T" },
    { symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment", price: 492.19, change: -2.34, marketCap: "217B" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial", price: 172.28, change: 0.89, marketCap: "498B" },
    { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", price: 162.45, change: -0.67, marketCap: "392B" },
    { symbol: "V", name: "Visa Inc.", sector: "Financial Services", price: 275.34, change: 1.23, marketCap: "567B" },
    { symbol: "WMT", name: "Walmart Inc.", sector: "Retail", price: 67.89, change: 0.45, marketCap: "545B" },
    { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Goods", price: 156.78, change: -0.89, marketCap: "370B" },
    { symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare", price: 523.45, change: 2.67, marketCap: "484B" },
    { symbol: "HD", name: "Home Depot Inc.", sector: "Retail", price: 342.67, change: 1.78, marketCap: "342B" },
    { symbol: "MA", name: "Mastercard Inc.", sector: "Financial Services", price: 456.78, change: 3.45, marketCap: "432B" },
    { symbol: "DIS", name: "Walt Disney Co.", sector: "Entertainment", price: 89.45, change: -1.23, marketCap: "163B" },
    { symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Financial Services", price: 67.89, change: -2.34, marketCap: "73B" },
    { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", price: 234.56, change: 4.56, marketCap: "230B" },
    { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", price: 567.89, change: 6.78, marketCap: "258B" }
  ]

  // Filtered stocks based on search
  const filteredStocks = stockCompanies.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [analysisHistory])

  const handleStockSelection = (symbol: string) => {
    setSelectedStock(symbol)
    setUserQuestion("")
    setCurrentAnalysis("")
    setAnalysisHistory([])
  }

  const handleQuestionSubmit = async () => {
    if (!selectedStock || !userQuestion.trim()) return

    setIsAnalyzing(true)
    setCurrentAnalysis("")

    try {
      // Simulate AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aiResponse = generateAIResponse(selectedStock, userQuestion)
      
      const newAnalysis: AIAnalysis = {
        question: userQuestion,
        answer: aiResponse,
        timestamp: new Date(),
        category: getQuestionCategory(userQuestion)
      }

      setAnalysisHistory(prev => [...prev, newAnalysis])
      setUserQuestion("")
      setCurrentAnalysis("")
    } catch (error) {
      console.error("Analysis failed:", error)
      setCurrentAnalysis("Sorry, I encountered an error while analyzing. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getQuestionCategory = (question: string): string => {
    const questionLower = question.toLowerCase()
    if (questionLower.includes("financial") || questionLower.includes("revenue") || questionLower.includes("profit")) return "financial"
    if (questionLower.includes("risk") || questionLower.includes("challenge")) return "risk"
    if (questionLower.includes("future") || questionLower.includes("outlook") || questionLower.includes("growth")) return "growth"
    if (questionLower.includes("competitor") || questionLower.includes("compare")) return "competition"
    return "general"
  }

  const generateAIResponse = (stock: string, question: string): string => {
    const company = stockCompanies.find(s => s.symbol === stock)
    if (!company) return "Company information not found."

    // Simulate AI responses based on question content
    const questionLower = question.toLowerCase()
    
    if (questionLower.includes("financial") || questionLower.includes("revenue") || questionLower.includes("profit")) {
      return `Based on my analysis of ${company.name} (${company.symbol}), the company has shown strong financial performance in recent quarters. Revenue growth has been consistent, driven by their core ${company.sector.toLowerCase()} business. However, I recommend conducting thorough research and consulting with financial advisors before making investment decisions.`
    } else if (questionLower.includes("risk") || questionLower.includes("challenge")) {
      return `${company.name} faces several challenges including market competition, regulatory changes, and economic uncertainties. The ${company.sector} sector is highly competitive, and the company must continue innovating to maintain its market position. Consider these factors in your investment strategy.`
    } else if (questionLower.includes("future") || questionLower.includes("outlook") || questionLower.includes("growth")) {
      return `The future outlook for ${company.name} appears promising given their strong market position in ${company.sector}. They're investing heavily in innovation and expanding into new markets. However, market conditions can change rapidly, so monitor their quarterly reports and industry trends.`
    } else if (questionLower.includes("buy") || questionLower.includes("sell") || questionLower.includes("hold")) {
      return `I cannot provide specific buy/sell/hold recommendations as I'm an AI assistant. Investment decisions should be based on your own research, risk tolerance, and financial goals. Consider consulting with a qualified financial advisor for personalized investment advice.`
    } else {
      return `Thank you for your question about ${company.name} (${company.symbol}). As an AI assistant, I can provide general information and analysis, but I cannot give specific investment advice. Please conduct thorough research and consider consulting with financial professionals before making investment decisions.`
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return <DollarSign className="h-3 w-3" />
      case 'risk': return <Shield className="h-3 w-3" />
      case 'growth': return <TrendingUp className="h-3 w-3" />
      case 'competition': return <Users className="h-3 w-3" />
      default: return <Lightbulb className="h-3 w-3" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-green-500/20 border-green-400/30 text-green-100'
      case 'risk': return 'bg-red-500/20 border-red-400/30 text-red-100'
      case 'growth': return 'bg-blue-500/20 border-blue-400/30 text-blue-100'
      case 'competition': return 'bg-purple-500/20 border-purple-400/30 text-purple-100'
      default: return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="text-center space-y-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <div>
            <p className="text-white font-medium">Loading portfolio...</p>
            <p className="text-sm text-white/60">Preparing your AI analysis dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const selectedCompany = stockCompanies.find(s => s.symbol === selectedStock)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar 
        onLoginClick={() => router.push('/login')}
        onSignupClick={() => router.push('/login')}
        onDemoClick={() => router.push('/')}
        onLogout={() => router.push('/')}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/user')}
              className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Stock Predictor</span>
            </Button>
          </div>

          {/* Main Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-2xl mb-4 shadow-lg border border-white/30">
              <Brain className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              AI Portfolio Analysis
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Get intelligent insights and analysis for your stock research with AI-powered recommendations
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Stock Selection & Market Overview */}
          <div className="xl:col-span-1 space-y-6 xl:sticky xl:top-6 xl:self-start xl:h-fit">
            {/* Stock Selection Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 py-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Stock Selection
                </CardTitle>
                <CardDescription className="text-sm text-white/80">
                  Choose a company to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
                  />
                </div>

                {/* Stock List */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => handleStockSelection(stock.symbol)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedStock === stock.symbol
                          ? 'bg-blue-500/30 border-blue-400/50'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-lg">{stock.symbol}</span>
                          <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                            {stock.sector}
                          </Badge>
                        </div>
                        {stock.change && (
                          <div className={`flex items-center gap-1 text-sm ${
                            stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(stock.change).toFixed(2)}%
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-white/80 mb-1">{stock.name}</p>
                      {stock.price && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/60">${stock.price.toFixed(2)}</span>
                          <span className="text-white/60">{stock.marketCap}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

           

            {/* AI Features Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 py-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                  <Shield className="h-4 w-4 text-green-400" />
                  <div>
                    <span className="text-sm font-medium text-green-100">Financial Analysis</span>
                    <p className="text-xs text-green-200/80">Revenue, profits, growth</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <div>
                    <span className="text-sm font-medium text-blue-100">Market Insights</span>
                    <p className="text-xs text-blue-200/80">Trends & opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <div>
                    <span className="text-sm font-medium text-yellow-100">Risk Assessment</span>
                    <p className="text-xs text-yellow-200/80">Challenges & threats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area - AI Analysis */}
          <div className="xl:col-span-3">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-400" />
                      AI Analysis Chat
                    </CardTitle>
                    <CardDescription className="text-sm text-white/80">
                      {selectedStock ? `${selectedCompany?.name} (${selectedStock})` : "Select a company to start"}
                    </CardDescription>
                  </div>
                  {selectedStock && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white/80">
                        {selectedCompany?.sector}
                      </Badge>
                      {selectedCompany?.price && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/30">
                          ${selectedCompany.price.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Tabs for different views */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      <Clock className="h-4 w-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="mt-6">
                    {/* Quick Questions */}
                    {selectedStock && (
                      <div className="space-y-4 mb-6">
                        <Label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                          <span>Quick Questions</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("How is the financial performance of this company?")}
                            className="h-auto py-3 px-4 text-sm text-left justify-start cursor-pointer hover:bg-green-500/30 hover:text-green-100 hover:border-green-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                            disabled={isAnalyzing}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">💰</span>
                              <div>
                                <div className="font-medium">Financial</div>
                                <div className="text-xs opacity-80">Performance & metrics</div>
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("What are the main risks and challenges?")}
                            className="h-auto py-3 px-4 text-sm text-left justify-start cursor-pointer hover:bg-red-500/30 hover:text-red-100 hover:border-red-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                            disabled={isAnalyzing}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">⚠️</span>
                              <div>
                                <div className="font-medium">Risks</div>
                                <div className="text-xs opacity-80">Challenges & threats</div>
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("What's the future outlook for growth?")}
                            className="h-auto py-3 px-4 text-sm text-left justify-start cursor-pointer hover:bg-blue-500/30 hover:text-blue-100 hover:border-blue-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                            disabled={isAnalyzing}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📈</span>
                              <div>
                                <div className="font-medium">Growth</div>
                                <div className="text-xs opacity-80">Future outlook</div>
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("How does this company compare to competitors?")}
                            className="h-auto py-3 px-4 text-sm text-left justify-start cursor-pointer hover:bg-purple-500/30 hover:text-purple-100 hover:border-purple-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                            disabled={isAnalyzing}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🏆</span>
                              <div>
                                <div className="font-medium">Competition</div>
                                <div className="text-xs opacity-80">Market position</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Chat Interface */}
                    <div className="space-y-4">
                                             {/* Chat Messages Area */}
                       <div className="h-134 overflow-y-auto pr-2 border border-white/30 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        {isAnalyzing && (
                          <div className="flex items-center gap-3 text-blue-200 bg-blue-500/20 p-4 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <div>
                              <span className="text-sm font-medium">AI is analyzing...</span>
                              <p className="text-xs text-blue-200/80">Processing your question about {selectedCompany?.name}</p>
                            </div>
                          </div>
                        )}

                        {/* Chat History */}
                        {analysisHistory.length > 0 && (
                          <div className="space-y-4">
                            {analysisHistory.map((analysis, index) => (
                              <div key={index} className="space-y-3">
                                {/* User Question */}
                                <div className="flex justify-end">
                                  <div className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white p-4 rounded-2xl rounded-br-md max-w-[85%] shadow-sm border border-blue-400/30">
                                    <p className="text-sm font-medium">{analysis.question}</p>
                                  </div>
                                </div>
                                {/* AI Response */}
                                <div className="flex justify-start">
                                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 p-4 rounded-2xl rounded-bl-md max-w-[85%] shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={`text-xs ${getCategoryColor(analysis.category || 'general')}`}>
                                        {getCategoryIcon(analysis.category || 'general')}
                                        {analysis.category || 'general'}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-white leading-relaxed">{analysis.answer}</p>
                                    <p className="text-xs text-white/60 mt-3 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {analysis.timestamp.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        )}

                        {/* No Stock Selected */}
                        {!selectedStock && (
                          <div className="text-center py-12 text-white/60">
                            <BarChart3 className="h-16 w-16 mx-auto text-white/40 mb-4" />
                            <p className="text-lg font-medium">Select a stock to start chatting</p>
                            <p className="text-sm text-white/40 mt-2">Choose from the list on the left to begin your analysis</p>
                          </div>
                        )}

                        {/* No Questions Yet */}
                        {selectedStock && analysisHistory.length === 0 && !isAnalyzing && (
                          <div className="text-center py-12 text-white/60">
                            <MessageSquare className="h-16 w-16 mx-auto text-white/40 mb-4" />
                            <p className="text-lg font-medium">Start chatting about {selectedCompany?.name}</p>
                            <p className="text-sm text-white/40 mt-2">Use quick questions above or type your own below</p>
                          </div>
                        )}
                      </div>

                      {/* Question Input */}
                      <div className="space-y-3">
                        <Label htmlFor="question" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                          <span>Ask your question</span>
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </Label>
                        <div className="flex gap-3">
                          <Textarea
                            id="question"
                            placeholder="Ask about financial performance, risks, future outlook, or any specific concerns..."
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            className="flex-1 min-h-[60px] resize-none rounded-lg border-2 border-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder:text-white/60 transition-all duration-200 text-sm bg-white/20 backdrop-blur-sm"
                            disabled={!selectedStock || isAnalyzing}
                          />
                          <Button
                            onClick={handleQuestionSubmit}
                            disabled={!selectedStock || !userQuestion.trim() || isAnalyzing}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            {isAnalyzing ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Send className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Analysis History</h3>
                        <Badge variant="secondary" className="bg-white/20 text-white/80">
                          {analysisHistory.length} analyses
                        </Badge>
                      </div>
                      
                      {analysisHistory.length === 0 ? (
                        <div className="text-center py-12 text-white/60">
                          <BookOpen className="h-16 w-16 mx-auto text-white/40 mb-4" />
                          <p className="text-lg font-medium">No analysis history yet</p>
                          <p className="text-sm text-white/40 mt-2">Start asking questions to build your analysis history</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {analysisHistory.map((analysis, index) => (
                            <Card key={index} className="bg-white/10 border border-white/20">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <Badge className={`text-xs ${getCategoryColor(analysis.category || 'general')}`}>
                                    {getCategoryIcon(analysis.category || 'general')}
                                    {analysis.category || 'general'}
                                  </Badge>
                                  <span className="text-xs text-white/60">
                                    {analysis.timestamp.toLocaleString()}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-white">{analysis.question}</p>
                                  <p className="text-sm text-white/80 leading-relaxed">{analysis.answer}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
