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
import { Loader2, TrendingUp, MessageSquare, Send, ArrowLeft, Brain, BarChart3, Shield, Zap } from "lucide-react"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
          <p className="mt-2 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onLoginClick={() => router.push('/login')}
        onSignupClick={() => router.push('/login')}
        onDemoClick={() => router.push('/')}
        onLogout={() => router.push('/')}
      />
      
      <div className="max-w-7xl mx-auto px-4 my-2">
        {/* Header */}
        <div className=" ">
          <Button
            variant="ghost"
            onClick={() => router.push('/user')}
            className=" flex cursor-pointer hover:bg-gray-100 rounded-md p-2 items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="">Back to Stock Predictor</span>
          </Button>
          
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stock Selection & Features */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stock Selection */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Select Stock
                </CardTitle>
                <CardDescription>Choose a company to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Select value={selectedStock} onValueChange={handleStockSelection}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Choose a stock company" className="text-black" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto bg-gray-100 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-300">
                      {stockCompanies.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol} className="text-black hover:bg-gray-200">
                          <div className="flex flex-col">
                            <span className="font-semibold text-black">{stock.symbol}</span>
                            <span className="text-xs text-black">{stock.name} - {stock.sector}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedStock && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Selected:</strong> {stockCompanies.find(s => s.symbol === selectedStock)?.name} ({selectedStock})
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Financial Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>Market Insights</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>Risk Assessment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - AI Analysis */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  AI Company Analysis
                </CardTitle>
               
              </CardHeader>
                              <CardContent className="space-y-2">
                                    {/* Chat Interface */}
                  <div className="flex flex-col h-full">
                    {/* Predefined Questions */}
                    {selectedStock && (
                      <div className="space-y-3 mb-4">
                        <Label className="text-sm font-medium text-gray-700">Quick Questions:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("How is the financial performance of this company?")}
                            className="text-xs h-auto py-2 px-3 text-left justify-start cursor-pointer hover:bg-black hover:text-gray-300 hover:border-gray-300"
                            disabled={isAnalyzing}
                          >
                            💰 Financial Performance
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("What are the main risks and challenges?")}
                            className="text-xs h-auto py-2 px-3 text-left justify-start cursor-pointer hover:bg-black hover:text-gray-300 hover:border-gray-300"
                            disabled={isAnalyzing}
                          >
                            ⚠️ Risks & Challenges
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("What's the future outlook for growth?")}
                            className="text-xs h-auto py-2 px-3 text-left justify-start cursor-pointer hover:bg-black hover:text-gray-300 hover:border-gray-300"
                            disabled={isAnalyzing}
                          >
                            📈 Future Growth
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserQuestion("How does this company compare to competitors?")}
                            className="text-xs h-auto py-2 px-3 text-left justify-start cursor-pointer hover:bg-black hover:text-gray-300 hover:border-gray-300"
                            disabled={isAnalyzing}
                          >
                            🏆 Competitive Analysis
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages Area */}
                    <div className="h-80 overflow-y-auto pr-2 mb-4 border border-gray-200 rounded-lg bg-gray-50 p-4">
                      {isAnalyzing && (
                        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is analyzing your question...</span>
                        </div>
                      )}

                      {/* Chat History */}
                      {analysisHistory.length > 0 && (
                        <div className="space-y-4">
                          {analysisHistory.map((analysis, index) => (
                            <div key={index} className="space-y-3">
                              {/* User Question */}
                              <div className="flex justify-end">
                                <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-br-md max-w-[80%] shadow-sm">
                                  <p className="text-sm">{analysis.question}</p>
                                </div>
                              </div>
                                                             {/* AI Response */}
                               <div className="flex justify-start">
                                 <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
                                   <p className="text-sm text-gray-800">{analysis.answer}</p>
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
                          <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p>Select a stock company to start chatting with AI</p>
                        </div>
                      )}

                      {/* No Questions Yet */}
                      {selectedStock && analysisHistory.length === 0 && !isAnalyzing && (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p>Start chatting with AI about {stockCompanies.find(s => s.symbol === selectedStock)?.name}</p>
                          <p className="text-sm text-gray-400 mt-2">Use the quick questions above or type your own</p>
                        </div>
                      )}
                    </div>

                    {/* Question Input - Fixed at Bottom */}
                    <div className="border-t border-gray-200 pt-4 bg-white">
                      <div className="space-y-2">
                        <Label htmlFor="question" className="text-sm font-medium text-gray-700">
                          Your Question
                        </Label>
                        <div className="flex space-x-2">
                          <Textarea
                            id="question"
                            placeholder="Ask about financial performance, risks, future outlook, or any company-related questions..."
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            className="flex-1 min-h-[60px] resize-none rounded-2xl border-1 border-gray-200 focus-visible:border-gray-600 text-black transition-all duration-200 "
                            disabled={!selectedStock || isAnalyzing}
                          />
                          <Button
                            onClick={handleQuestionSubmit}
                            disabled={!selectedStock || !userQuestion.trim() || isAnalyzing}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black disabled:opacity-50 rounded-full h-12 w-12 flex items-center justify-center"
                          >
                            {isAnalyzing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 text-white w-4" />
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
