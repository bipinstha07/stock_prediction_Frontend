"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, TrendingUp, Plus, X, AlertCircle, ChevronDown, BarChart3, Target, Zap, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NewsStatementDto {
  news: string[]
  months: number
}

interface CompanyStockPriceDto {
  date: string
  price: number
  // Add other fields that might be returned by the API
}

// Alternative interface for different response formats
interface StockDataItem {
  date: string
  price: number
  [key: string]: any // Allow for additional fields
}

interface PredictionData {
  date: string
  price: number
  index: number
}

interface StockPredictorProps {
  isDemo?: boolean
}

export function StockPredictor({ isDemo = false }: StockPredictorProps) {
  const [stockSymbol, setStockSymbol] = useState("AAPL")
  const [selectedStock, setSelectedStock] = useState<string>("AAPL")
  const [newsList, setNewsList] = useState<string[]>([""])
  const [months, setMonths] = useState<number>(6)
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [currentStockData, setCurrentStockData] = useState<PredictionData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to parse stock data from various response formats
  const parseStockData = (rawData: any): PredictionData[] => {
    console.log('Parsing stock data:', rawData)
    
    if (!Array.isArray(rawData)) {
      console.error('Expected array but got:', typeof rawData)
      return []
    }
    
    return rawData
      .map((item: any, index: number) => {
        try {
          // Handle different response formats
          let dateStr = item.date
          let price = item.price
          
          // If the response has a different structure, try to extract values
          if (typeof item === 'string') {
            console.log('Item is string:', item)
            // Try to parse string representation like "{date=2025-08-19, price=509.77}"
            const match = item.match(/date=([^,]+),\s*price=([^}]+)/)
            if (match) {
              dateStr = match[1]
              price = match[2]
            } else {
              return null
            }
          }
          
          // Ensure price is a number
          if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^\d.-]/g, ''))
          }
          
          // Ensure date is properly formatted
          if (dateStr) {
            // Handle different date formats
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) {
              console.warn('Invalid date format:', dateStr)
              return null
            }
            dateStr = date.toISOString().split('T')[0] // Format as YYYY-MM-DD
          }
          
          return {
            date: dateStr,
            price: Number(price),
            index: index,
          }
        } catch (error) {
          console.error('Error parsing item:', item, error)
          return null
        }
      })
      .filter((item: PredictionData | null): item is PredictionData => item !== null) // Remove null items
      .sort((a: PredictionData, b: PredictionData) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Predefined stock companies
  const stockCompanies = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
    { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce" }
  ]

  // Fetch real stock data when component mounts
  useEffect(() => {
    if (stockSymbol && !isDemo) {
      fetchCurrentStockData(stockSymbol)
    } else if (stockSymbol && isDemo) {
      const dummyData = generateDummyHistoricalData(stockSymbol)
      setCurrentStockData(dummyData)
    }
  }, []) // Empty dependency array means this runs once on mount

  const addNewsItem = () => {
    setNewsList([...newsList, ""])
  }

  const removeNewsItem = (index: number) => {
    if (newsList.length > 1) {
      setNewsList(newsList.filter((_, i) => i !== index))
    }
  }

  const updateNewsItem = (index: number, value: string) => {
    const updated = [...newsList]
    updated[index] = value
    setNewsList(updated)
  }

  const generateDemoData = (symbol: string, monthsCount: number): PredictionData[] => {
    const data: PredictionData[] = []
    const basePrice = 150 + Math.random() * 100
    const today = new Date()

    for (let i = 0; i <= monthsCount * 30; i += 7) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)

      const volatility = 0.02
      const trend = 0.001
      const randomChange = (Math.random() - 0.5) * volatility
      const price = basePrice * (1 + trend * i + randomChange)

      data.push({
        date: date.toISOString().split("T")[0],
        price: Math.max(price, 10),
        index: i,
      })
    }

    return data
  }

  const generateDummyHistoricalData = (symbol: string): PredictionData[] => {
    const data: PredictionData[] = []
    const basePrice = 150 + Math.random() * 100
    const today = new Date()

    // Generate data for the last 2 months (60 days)
    for (let i = 60; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const volatility = 0.015
      const trend = 0.0005
      const randomChange = (Math.random() - 0.5) * volatility
      const price = basePrice * (1 + trend * (60 - i) + randomChange)

      data.push({
        date: date.toISOString().split("T")[0],
        price: Math.max(price, 10),
        index: 60 - i,
      })
    }

    return data
  }

  const fetchCurrentStockData = async (symbol: string) => {
    setIsLoadingCurrent(true)
    setError(null)
    
    try {
      if (isDemo) {
        // Generate demo current stock data (last 30 days)
        const demoData = generateDemoData(symbol, 1) // 1 month of data
        setCurrentStockData(demoData)
      } else {
        try {
          // Real API call for current stock data using the new endpoint
          const response = await fetch(`http://localhost:8080/user/stock/getByCode/${symbol}`)

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log('Raw API response from fetchCurrentStockData:', data) // Debug log

          // Use the helper function to parse the data
          const currentData = parseStockData(data)

          if (currentData.length === 0) {
            throw new Error('No valid stock data found in the response')
          }

          console.log('Parsed current data:', currentData)
          setCurrentStockData(currentData)
          setError(null) // Clear any previous errors
        } catch (apiError) {
          // If API fails, fall back to demo data
          console.warn("API call failed for current data, falling back to demo data:", apiError)
          setError("Backend API unavailable. Showing demo current data instead.")
          const demoData = generateDemoData(symbol, 1)
          setCurrentStockData(demoData)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch current stock data")
    } finally {
      setIsLoadingCurrent(false)
    }
  }

  const handlePrediction = async () => {
    if (!stockSymbol.trim()) {
      setError("Please enter a stock symbol")
      return
    }

    const filteredNews = newsList.filter((news) => news.trim() !== "")
    if (filteredNews.length === 0) {
      setError("Please enter at least one news item")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (isDemo) {
        // Generate demo data
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const demoData = generateDemoData(stockSymbol, months)
        setPredictionData(demoData)
      } else {
        try {
          // Real API call
          const requestBody: NewsStatementDto = {
            news: filteredNews,
            months: months,
          }

          const response = await fetch(`http://localhost:8080/user/stock/${stockSymbol}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          // Backend returns list of objects with date and price fields
          const chartData: PredictionData[] = data
            .map((item: any, index: number) => ({
              date: item.date,
              price: Number(item.price),
              index: index,
            }))
            .sort((a: PredictionData, b: PredictionData) => new Date(a.date).getTime() - new Date(b.date).getTime())

          setPredictionData(chartData)
        } catch (apiError) {
          // If API fails, fall back to demo data
          console.warn("API call failed, falling back to demo data:", apiError)
          setError("Backend API unavailable. Showing demo data instead.")
          const demoData = generateDemoData(stockSymbol, months)
          setPredictionData(demoData)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prediction data")
    } finally {
      setIsLoading(false)
    }
  }

  const chartConfig = {
    price: {
      label: "Stock Price",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-1 relative z-10">
        {isDemo && (
          <Alert className="mb-6 bg-blue-500/20 text-blue-100 border-blue-400/30 shadow-sm backdrop-blur-sm">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm text-blue-100 font-medium">
              Demo mode - showing sample data for demonstration purposes
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
     
          
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-5">
          {/* Chart Section - 70% of screen (7/10 columns) */}
          <div className="xl:col-span-7">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mt-5 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r -mt-6 from-white/20 to-white/10 border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      Price Chart {stockSymbol ? `- ${stockSymbol}` : ""}
                    </CardTitle>
                    <CardDescription className="text-white/80 mt-1">
                      {predictionData.length > 0
                        ? `${months} month AI prediction for ${stockSymbol}`
                        : currentStockData.length > 0
                        ? `Real-time market data for ${stockSymbol} - Click "Get AI Prediction" for future forecasts`
                        : "Select a stock to view real-time market data"}
                    </CardDescription>
                  </div>
                  {stockSymbol && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-400/30">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-100">
                        {predictionData.length > 0 ? 'AI Prediction' : 'Real Market Data'}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="">
                {isLoadingCurrent ? (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">Loading market data...</p>
                        <p className="text-sm text-white/60">Fetching current stock information</p>
                      </div>
                    </div>
                  </div>
                ) : predictionData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="min-h-[320px]  chart-text-black">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.5)" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            // Dynamic tick formatting based on months (max 12 months)
                            if (months <= 3) {
                              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            } else if (months <= 6) {
                              return date.toLocaleDateString("en-US", { month: "short" })
                            } else {
                              return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
                            }
                          }}
                          interval={Math.max(0, Math.floor(predictionData.length / 8))} // Dynamic interval
                          tick={{ fontSize: 12, stroke: 'white', fontWeight: 100 }}
                          axisLine={{ stroke: 'gray' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value.toFixed(2)}`} 
                          tick={{ fontSize: 12, stroke: 'white', fontWeight: 100 }}
                          axisLine={{ stroke: 'gray' }}
                          domain={['dataMin - 50', 'dataMax + 50']}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              }}
                              formatter={(value) => [`$${Number(value).toFixed(2)}`]}
                            />
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={(props) => {
                            const { payload, cx, cy } = props;
                            if (!payload || payload.value === undefined) {
                              return <circle cx={cx} cy={cy} r={0} />;
                            }
                            
                            const index = payload.payload.index || 0;
                            if (index === 0) {
                              return <circle cx={cx} cy={cy} r={0} />; // Skip first point
                            }
                            
                            const prevPrice = predictionData[index - 1]?.price;
                            const currentPrice = payload.value;
                            const isPriceUp = currentPrice > prevPrice;
                            const color = isPriceUp ? "#10b981" : "#ef4444"; // Green for up, red for down
                            
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={months <= 6 ? 5 : 4}
                                fill="white"
                                stroke={color}
                                strokeWidth={2.5}
                              />
                            );
                          }}
                          activeDot={{ r: months <= 6 ? 7 : 6, stroke: "#1f2937", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : isLoadingCurrent ? (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">Loading market data...</p>
                        <p className="text-sm text-white/60">Fetching current stock information</p>
                      </div>
                    </div>
                  </div>
                ) : currentStockData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="min-h-[320px] chart-text-black">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentStockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.5)" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }}
                          interval={Math.max(0, Math.floor(currentStockData.length / 8))}
                          tick={{ fontSize: 12, stroke: 'white', fontWeight: 100 }}
                          axisLine={{ stroke: 'gray' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value.toFixed(2)}`} 
                          tick={{ fontSize: 12, stroke: 'white', fontWeight: 100 }}
                          axisLine={{ stroke: 'gray' }}
                          domain={['dataMin - 50', 'dataMax + 50']}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              }}
                              formatter={(value) => [`$${Number(value).toFixed(2)}`]}
                            />
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={(props) => {
                            const { payload, cx, cy } = props;
                            if (!payload || payload.value === undefined) {
                              return <circle cx={cx} cy={cy} r={0} />;
                            }
                            
                            const index = payload.payload.index || 0;
                            if (index === 0) {
                              return <circle cx={cx} cy={cy} r={0} />;
                            }
                            
                            const prevPrice = currentStockData[index - 1]?.price;
                            const currentPrice = payload.value;
                            const isPriceUp = currentPrice > prevPrice;
                            const color = isPriceUp ? "#10b981" : "#ef4444";
                            
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={4}
                                fill="white"
                                stroke={color}
                                strokeWidth={2.5}
                              />
                            );
                          }}
                          activeDot={{ r: 6, stroke: "#1f2937", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-white/30">
                        <BarChart3 className="h-10 w-10 text-white/60" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">No data available</p>
                        <p className="text-white/60">Select a stock from the right panel to view current market data</p>
                      </div>
                    </div>
                  </div>
                )}
                                </CardContent>
                </Card>

                {/* Prediction Summary Section */}
                {predictionData.length > 0 && (
                  <Card className="bg-white/10 backdrop-blur-md border mt-5 border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r -mt-6 pt-3 from-green-500/20 to-emerald-500/20 border-b border-green-400/30">
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-green-400" />
                        Prediction Summary
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        Key insights from your AI-powered stock analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-blue-200 font-medium mb-1">Starting Price</p>
                          <p className="text-2xl font-bold text-white">${predictionData[0]?.price.toFixed(2)}</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-400/20 rounded-xl border border-purple-400/30 backdrop-blur-sm">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-purple-200 font-medium mb-1">Target Price</p>
                          <p className="text-2xl font-bold text-white">
                            ${predictionData[predictionData.length - 1]?.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl border border-green-400/30 backdrop-blur-sm">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BarChart3 className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-green-200 font-medium mb-1">Price Change</p>
                          <p className="text-2xl font-bold text-white">
                            {predictionData.length > 1
                              ? `${(((predictionData[predictionData.length - 1].price - predictionData[0].price) / predictionData[0].price) * 100).toFixed(2)}%`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-orange-400/20 rounded-xl border border-orange-400/30 backdrop-blur-sm">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-orange-200 font-medium mb-1">Data Points</p>
                          <p className="text-2xl font-bold text-white">{predictionData.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* News Section */}
                <Card className="bg-white/10 backdrop-blur-md border mt-5 border-white/20 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r -mt-6 from-blue-500/20 to-indigo-500/20 border-b border-blue-400/30">
                    <CardTitle className="pt-4 text-lg font-bold text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Market News & Sentiment
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Real-time market updates and analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Sample News Items */}
                      <div className="p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                              <span>Benzinga</span>
                              <span>•</span>
                              <span>4h ago</span>
                            </div>
                            <h4 className="text-sm font-medium text-white mb-2">
                              Apple's Vision Pro Struggles To Gain Traction Amid Slow Release Of Immersive Video
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-400 font-medium">AAPL ▼ 0.68%</span>
                              <span className="text-xs text-white/60">Apple Inc.</span>
                            </div>
                          </div>
                          <div className="w-16 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg ml-4 flex-shrink-0"></div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                              <span>TipRanks</span>
                              <span>•</span>
                              <span>6h ago</span>
                            </div>
                            <h4 className="text-sm font-medium text-white mb-2">
                              Disney's Marvel creating more content in U.K., WSJ reports
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-400 font-medium">DIS ▼ 0.62%</span>
                              <span className="text-xs text-white/60">Walt Disney Co.</span>
                            </div>
                          </div>
                          <div className="w-16 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg ml-4 flex-shrink-0"></div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                              <span>Nasdaq</span>
                              <span>•</span>
                              <span>7h ago</span>
                            </div>
                            <h4 className="text-sm font-medium text-white mb-2">
                              Guru Fundamental Report for CRWD
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-400 font-medium">CRWD ▲ 0.72%</span>
                              <span className="text-xs text-white/60">CrowdStrike Holdings</span>
                            </div>
                          </div>
                          <div className="w-16 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg ml-4 flex-shrink-0"></div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                              <span>MarketWatch</span>
                              <span>•</span>
                              <span>8h ago</span>
                            </div>
                            <h4 className="text-sm font-medium text-white mb-2">
                              Tech stocks rally as AI optimism drives market sentiment
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-400 font-medium">NVDA ▲ 2.15%</span>
                              <span className="text-xs text-white/60">NVIDIA Corporation</span>
                            </div>
                          </div>
                          <div className="w-16 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg ml-4 flex-shrink-0"></div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                              <span>Yahoo Finance</span>
                              <span>•</span>
                              <span>9h ago</span>
                            </div>
                            <h4 className="text-sm font-medium text-white mb-2">
                              Federal Reserve signals potential rate cuts in 2024
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-400 font-medium">SPY ▲ 0.85%</span>
                              <span className="text-xs text-white/60">SPDR S&P 500 ETF</span>
                            </div>
                          </div>
                          <div className="w-16 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg ml-4 flex-shrink-0"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

                            {/* Prediction Parameters Section - 30% of screen (3/10 columns) */}
              <div className="xl:col-span-3 space-y-2 xl:sticky xl:top-6 mt-5  xl:self-start xl:h-fit">
                {/* Stock Selection Card */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-400/40 -mt-6 to-purple-300/40 pb-3 border border-blue-400/30">
                <CardTitle className="text-xl pt-4 font-bold text-white flex items-center gap-3">
                  <Target className="h-6 w-6 text-white" />
                  Stock Selection
                </CardTitle>
                <CardDescription className="text-xs text-blue-100">
                        Choose a company to analyze and predict future trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mx-auto">
                                      <div className="space-y-2">
                  <Label htmlFor="stock-select" className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <span>Select Company</span>
                    <span className="text-xs bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30">Required</span>
                  </Label>
                  
                  <div className="flex gap-2">
                    <Select
                      value={stockSymbol}
                      onValueChange={async (value) => {
                        setStockSymbol(value)
                        setSelectedStock(value)
                        setPredictionData([])
                        setError(null)
                        
                        // Fetch real stock data from the new API endpoint
                        try {
                          setIsLoadingCurrent(true)
                          const response = await fetch(`http://localhost:8080/user/stock/getByCode/${value}`)
                          
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                          }
                          
                          const stockData = await response.json()
                          console.log('Raw API response:', stockData) // Debug log
                          
                          // Use the helper function to parse the data
                          const chartData = parseStockData(stockData)
                          
                          if (chartData.length === 0) {
                            throw new Error('No valid stock data found in the response')
                          }
                          
                          console.log('Parsed chart data:', chartData)
                          setCurrentStockData(chartData)
                          setError(null) // Clear any previous errors
                        } catch (error) {
                          console.error('Failed to fetch stock data:', error)
                          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
                          setError(`Failed to fetch stock data: ${errorMessage}. Showing demo data instead.`)
                          // Fall back to demo data if API fails
                          const dummyData = generateDummyHistoricalData(value)
                          setCurrentStockData(dummyData)
                        } finally {
                          setIsLoadingCurrent(false)
                        }
                      }}
                    >
                      <SelectTrigger className="h-10 px-3 text-sm border border-white/30 rounded-md bg-white/20 text-white placeholder:text-white/60 hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-colors backdrop-blur-sm">
                        <SelectValue className="text-white" placeholder="Select stock" />
                      </SelectTrigger>

                      <SelectContent className="bg-white/20 backdrop-blur-md border border-white/30 shadow-sm rounded-md overflow-hidden max-h-72">
                        {stockCompanies.map((stock) => (
                          <SelectItem 
                            key={stock.symbol} 
                            value={stock.symbol}
                            className="px-3 py-2 text-white hover:bg-white/20 focus:bg-white/20 focus:text-white data-[state=checked]:bg-blue-500/30 data-[state=checked]:text-white cursor-pointer transition-colors"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium w-30 text-lg">{stock.symbol}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      onClick={() => fetchCurrentStockData(stockSymbol)}
                      disabled={isLoadingCurrent || !stockSymbol}
                      className="px-3 py-2 bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-400/30 hover:border-blue-400 transition-colors rounded-md backdrop-blur-sm"
                      title="Refresh stock data"
                    >
                      {isLoadingCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prediction Parameters Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r -mt-6 from-purple-500/20 to-pink-500/20 border-b border-purple-400/30">
                <CardTitle className="pt-4 text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Prediction Parameters
                </CardTitle>
                <CardDescription className="text-white/80">
                  Configure your analysis settings
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 space-y-6">
                {/* Timeframe Selection */}
                <div className="space-y-3">
                  <Label htmlFor="months" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <span>Prediction Timeframe</span>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </Label>
                  <Input
                    id="months"
                    type="number"
                    min="1"
                    max="12"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="h-6 text-sm text-white border-white/30 focus:border-purple-400 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                  />
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                    <span>Range: 1-12 months</span>
                  </div>
                </div>

                {/* News Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <span>News & Sentiment</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addNewsItem}
                      className="flex items-center gap-2 py-2 px-3 bg-green-500/30 text-sm border-purple-400/30 hover:bg-purple-500/30 hover:text-white hover:border-purple-400 transition-all duration-200 cursor-pointer rounded-lg backdrop-blur-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add News
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {newsList.map((news, index) => (
                      <div key={index} className="relative group">
                        <Textarea
                          placeholder={`News item ${index + 1}...`}
                          value={news}
                          onChange={(e) => updateNewsItem(index, e.target.value)}
                          className="min-h-[30px] py-1 px-4 text-sm text-white border-white/30 focus:border-green-400 bg-white/20 hover:bg-white/30 transition-colors resize-none rounded-lg backdrop-blur-sm placeholder:text-white/60"
                        />
                        {newsList.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeNewsItem(index)}
                            className="absolute top-1 right-2 w-6 h-6 p-0 border-red-400/30 hover:bg-red-500/30 hover:text-white hover:border-red-400 transition-all duration-200 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-red-500/70 backdrop-blur-sm"
                          >
                            <X className="h-3 text-red-600 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Prediction Button */}
                <Button 
                  onClick={handlePrediction} 
                  disabled={isLoading || !stockSymbol.trim()} 
                  className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Prediction...
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {`Get ${isDemo ? "Demo " : ""}AI Prediction`}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
