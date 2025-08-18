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
import { Loader2, TrendingUp, MessageSquare, Send, ArrowLeft, Brain, BarChart3, Shield, Zap, Users, Target } from "lucide-react"
import { Navbar } from "@/components/navbar"

interface StockCompany {
  symbol: string
  name: string
  sector: string
}

interface AIAnalysis {
  question: string
  answer: string
  timestamp: Date
}

export default function PortfolioPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedStock, setSelectedStock] = useState<string>("AAPL")
  const [userQuestion, setUserQuestion] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState<AIAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Predefined stock companies
  const stockCompanies = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
    { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce" },
    { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
    { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
    { symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial" },
    { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
    { symbol: "V", name: "Visa Inc.", sector: "Financial Services" },
    { symbol: "WMT", name: "Walmart Inc.", sector: "Retail" },
    { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Goods" },
    { symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare" },
    { symbol: "HD", name: "Home Depot Inc.", sector: "Retail" },
    { symbol: "MA", name: "Mastercard Inc.", sector: "Financial Services" },
    { symbol: "DIS", name: "Walt Disney Co.", sector: "Entertainment" },
    { symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Financial Services" },
    { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology" },
    { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology" }
  ]

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
        timestamp: new Date()
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
      
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
      

        {/* Minimal Hero Section */}
        <div className="text-center mb-8">
          {/* Header */}
          <div >
            <Button
              variant="ghost"
              onClick={() => router.push('/user')}
              className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Stock Predictor</span>
            </Button>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-xl mb-3 shadow-md border border-white/30">
            <Brain className="h-6 w-6 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-white mb-2">
            Portfolio Analysis
          </h1>
          <p className="text-sm text-white/80">
            AI-powered insights for your stock research
          </p>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Stock Selection & Features */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6 lg:self-start lg:h-fit">
            {/* Stock Selection */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg ">
              <CardHeader className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 py-2 -mt-6">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  Stock Selection
                </CardTitle>
                <CardDescription className="text-xs text-white/80">
                  Choose a company to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <div className="space-y-3">
                  <Select value={selectedStock} onValueChange={handleStockSelection}>
                    <SelectTrigger className="h-10 px-3 text-sm border border-white/30 rounded-lg bg-white/20 text-white placeholder:text-white/60 hover:bg-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                      <SelectValue placeholder="Choose a stock company" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-lg overflow-hidden max-h-60">
                      {stockCompanies.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol} className="px-3 py-2 text-white hover:bg-white/20 focus:bg-white/20 focus:text-white data-[state=checked]:bg-blue-500/30 data-[state=checked]:text-white cursor-pointer border-b border-white/20 last:border-0 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-semibold text-white">{stock.symbol}</span>
                              <span className="text-xs text-white/70">{stock.name}</span>
                            </div>
                            <span className="text-xs bg-blue-500/30 text-blue-100 px-2 py-1 rounded-md border border-blue-400/30">
                              {stock.sector}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedStock && (
                    <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg backdrop-blur-sm">
                      <p className="text-xs text-blue-100 font-medium">
                        <strong>Selected:</strong> {stockCompanies.find(s => s.symbol === selectedStock)?.name} ({selectedStock})
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r -mt-6 from-purple-500/20 to-pink-500/20">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  AI Features
                </CardTitle>
                <CardDescription className="text-xs text-white/80">
                  Analysis capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className=" space-y-3">
                <div className="flex items-center gap-2 p-2 bg-green-500/20 rounded-lg border border-green-400/30 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-xs font-medium text-green-100">Financial Analysis</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-blue-100">Market Insights</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-500/20 rounded-lg border border-yellow-400/30 backdrop-blur-sm">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-100">Risk Assessment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - AI Analysis */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 -mt-6 py-2">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-400" />
                  AI Analysis Chat
                </CardTitle>
                <CardDescription className="text-xs text-white/80">
                  {selectedStock ? `${stockCompanies.find(s => s.symbol === selectedStock)?.name} (${selectedStock})` : "Select a company to start"}
                </CardDescription>
              </CardHeader>
              <CardContent className=" space-y-4">
                {/* Chat Interface */}
                <div className="flex flex-col h-full">
                  {/* Predefined Questions */}
                  {selectedStock && (
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-white/90 flex items-center gap-2">
                        <span>Quick Questions</span>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("How is the financial performance of this company?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-green-500/30 hover:text-green-100 hover:border-green-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                          disabled={isAnalyzing}
                        >
                          💰 Financial
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("What are the main risks and challenges?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-red-500/30 hover:text-red-100 hover:border-red-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                          disabled={isAnalyzing}
                        >
                          ⚠️ Risks
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("What's the future outlook for growth?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-blue-500/30 hover:text-blue-100 hover:border-blue-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                          disabled={isAnalyzing}
                        >
                          📈 Growth
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("How does this company compare to competitors?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-purple-500/30 hover:text-purple-100 hover:border-purple-400 transition-all duration-200 rounded-lg backdrop-blur-sm"
                          disabled={isAnalyzing}
                        >
                          🏆 Competition
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Chat Messages Area */}
                  <div className="h-120 overflow-y-auto pr-2 mb-4 mt-4 border border-white/30 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                    {isAnalyzing && (
                      <div className="flex items-center gap-2 text-blue-200 bg-blue-500/20 p-3 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-medium">AI is analyzing...</span>
                      </div>
                    )}

                    {/* Chat History */}
                    {analysisHistory.length > 0 && (
                      <div className="space-y-3">
                        {analysisHistory.map((analysis, index) => (
                          <div key={index} className="space-y-2">
                            {/* User Question */}
                            <div className="flex justify-end">
                              <div className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white p-3 rounded-2xl rounded-br-md max-w-[80%] shadow-sm border border-blue-400/30">
                                <p className="text-xs font-medium">{analysis.question}</p>
                              </div>
                            </div>
                            {/* AI Response */}
                            <div className="flex justify-start">
                              <div className="bg-white/20 backdrop-blur-sm border border-white/30 p-3 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
                                <p className="text-xs text-white leading-relaxed">{analysis.answer}</p>
                                <p className="text-xs text-white/60 mt-2">
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
                      <div className="text-center py-8 text-white/60">
                        <BarChart3 className="h-12 w-12 mx-auto text-white/40 mb-3" />
                        <p className="text-sm font-medium">Select a stock to start chatting</p>
                      </div>
                    )}

                    {/* No Questions Yet */}
                    {selectedStock && analysisHistory.length === 0 && !isAnalyzing && (
                      <div className="text-center py-8 text-white/60">
                        <MessageSquare className="h-12 w-12 mx-auto text-white/40 mb-3" />
                        <p className="text-sm font-medium">Start chatting about {stockCompanies.find(s => s.symbol === selectedStock)?.name}</p>
                        <p className="text-xs text-white/40 mt-1">Use quick questions or type your own</p>
                      </div>
                    )}
                  </div>

                  {/* Question Input - Fixed at Bottom */}
                  <div className="border-t border-white/30 pt-4 bg-white/10 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label htmlFor="question" className="text-xs  ml-2 font-semibold text-white/90 flex items-center gap-2">
                        <span>Your Question</span>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      </Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="question"
                          placeholder="Ask about financial performance, risks, future outlook..."
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          className="flex-1 min-h-[50px] ml-2 mb-2 resize-none rounded-lg border-2 border-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder:text-white/60 transition-all duration-200 cursor-pointer text-xs bg-white/20 backdrop-blur-sm"
                          disabled={!selectedStock || isAnalyzing}
                        />
                        <Button
                          onClick={handleQuestionSubmit}
                          disabled={!selectedStock || !userQuestion.trim() || isAnalyzing}
                          className="px-4 py-2 bg-gradient-to-r mt-1 mr-1 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 rounded-lg h-10 w-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
