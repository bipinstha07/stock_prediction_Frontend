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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Loading portfolio...</p>
            <p className="text-sm text-gray-400">Preparing your AI analysis dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onLoginClick={() => router.push('/login')}
        onSignupClick={() => router.push('/login')}
        onDemoClick={() => router.push('/')}
        onLogout={() => router.push('/')}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
      

        {/* Minimal Hero Section */}
        <div className="text-center mb-8">
          {/* Header */}
          <div >
            <Button
              variant="ghost"
              onClick={() => router.push('/user')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Stock Predictor</span>
            </Button>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-3 shadow-md">
            <Brain className="h-6 w-6 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Portfolio Analysis
          </h1>
          <p className="text-sm text-gray-600">
            AI-powered insights for your stock research
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Stock Selection & Features */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stock Selection */}
            <Card className="bg-white border-0 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Stock Selection
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Choose a company to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="space-y-3">
                  <Select value={selectedStock} onValueChange={handleStockSelection}>
                    <SelectTrigger className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 cursor-pointer">
                      <SelectValue placeholder="Choose a stock company" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden max-h-60">
                      {stockCompanies.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol} className="px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700 cursor-pointer border-b border-gray-100 last:border-0 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{stock.symbol}</span>
                              <span className="text-xs text-gray-500">{stock.name}</span>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {stock.sector}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedStock && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium">
                        <strong>Selected:</strong> {stockCompanies.find(s => s.symbol === selectedStock)?.name} ({selectedStock})
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-white border-0 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Features
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Analysis capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-3 space-y-3">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Financial Analysis</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Market Insights</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-800">Risk Assessment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - AI Analysis */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-sm rounded-lg overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  AI Analysis Chat
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  {selectedStock ? `${stockCompanies.find(s => s.symbol === selectedStock)?.name} (${selectedStock})` : "Select a company to start"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-3 space-y-4">
                {/* Chat Interface */}
                <div className="flex flex-col h-full">
                  {/* Predefined Questions */}
                  {selectedStock && (
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                        <span>Quick Questions</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("How is the financial performance of this company?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all duration-200 rounded-lg"
                          disabled={isAnalyzing}
                        >
                          💰 Financial
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("What are the main risks and challenges?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200 rounded-lg"
                          disabled={isAnalyzing}
                        >
                          ⚠️ Risks
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("What's the future outlook for growth?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 rounded-lg"
                          disabled={isAnalyzing}
                        >
                          📈 Growth
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserQuestion("How does this company compare to competitors?")}
                          className="h-auto py-2 px-3 text-xs text-left justify-start cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all duration-200 rounded-lg"
                          disabled={isAnalyzing}
                        >
                          🏆 Competition
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Chat Messages Area */}
                  <div className="h-120 overflow-y-auto pr-2 mb-4 border border-gray-200 rounded-lg bg-gray-50 p-3">
                    {isAnalyzing && (
                      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
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
                              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-2xl rounded-br-md max-w-[80%] shadow-sm">
                                <p className="text-xs font-medium">{analysis.question}</p>
                              </div>
                            </div>
                            {/* AI Response */}
                            <div className="flex justify-start">
                              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
                                <p className="text-xs text-gray-800 leading-relaxed">{analysis.answer}</p>
                                <p className="text-xs text-gray-500 mt-2">
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
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-medium">Select a stock to start chatting</p>
                      </div>
                    )}

                    {/* No Questions Yet */}
                    {selectedStock && analysisHistory.length === 0 && !isAnalyzing && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-medium">Start chatting about {stockCompanies.find(s => s.symbol === selectedStock)?.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Use quick questions or type your own</p>
                      </div>
                    )}
                  </div>

                  {/* Question Input - Fixed at Bottom */}
                  <div className="border-t border-gray-200 pt-4 bg-white">
                    <div className="space-y-2">
                      <Label htmlFor="question" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                        <span>Your Question</span>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      </Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="question"
                          placeholder="Ask about financial performance, risks, future outlook..."
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          className="flex-1 min-h-[50px] resize-none rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all duration-200 cursor-pointer text-xs"
                          disabled={!selectedStock || isAnalyzing}
                        />
                        <Button
                          onClick={handleQuestionSubmit}
                          disabled={!selectedStock || !userQuestion.trim() || isAnalyzing}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 rounded-lg h-10 w-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
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
