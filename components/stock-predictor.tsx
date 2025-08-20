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
  stockPrice: string
  stockPriceHistory: Array<{date: string, price: number}>
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

interface StockNewsItem {
  id: string
  author: string
  created: string
  updated: string
  title: string
  url: string
  image?: {
    size: string
    url: string
  }[]
  channels: string[]
  stocks: string[]
  tags: string[]
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
  const [stockNews, setStockNews] = useState<any[]>([])
  const [isLoadingNews, setIsLoadingNews] = useState(false)

  // Function to clear prediction data and return to real data view
  const clearPredictionAndShowRealData = () => {
    console.log('Clearing prediction data, current state:', {
      predictionDataLength: predictionData.length,
      currentStockDataLength: currentStockData.length,
      stockSymbol
    })
    setPredictionData([])
    setError(null)
    console.log('Cleared prediction data, showing real market data')
  }

  // Function to fetch news from Benzinga API
  const fetchStockNews = async (symbol: string) => {
    setIsLoadingNews(true)
    try {
      const response = await fetch(`https://api.benzinga.com/api/v2/news?token=bz.WOXIG7ZDFTGSM4YMZL5YPAJRFHGK3NCP&tickers=${symbol}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const xmlText = await response.text()
      
      // Check if response contains expected content
      if (xmlText.includes('Access denied') || xmlText.includes('Invalid token')) {
        throw new Error('API access denied - check token validity')
      }
      
      // Parse XML to extract news items
      const newsItems = parseNewsXML(xmlText)
      
      setStockNews(newsItems)
      
    } catch (error) {
      console.error('Failed to fetch news:', error)
      setStockNews([])
    } finally {
      setIsLoadingNews(false)
    }
  }

  // Helper function to parse XML news data
  const parseNewsXML = (xmlText: string): StockNewsItem[] => {
    try {
      // Check if we have valid XML content
      if (!xmlText.includes('<result') || !xmlText.includes('<item>')) {
        return []
      }
      
      const newsItems: StockNewsItem[] = []
      const itemRegex = /<item>([\s\S]*?)<\/item>/g
      let match
      let itemCount = 0
      
      while ((match = itemRegex.exec(xmlText)) !== null) {
        itemCount++
        const itemContent = match[1]
        const id = extractXMLValue(itemContent, 'id')
        const author = decodeHtmlEntities(extractXMLValue(itemContent, 'author'))
        const created = extractXMLValue(itemContent, 'created')
        const updated = extractXMLValue(itemContent, 'updated')
        const title = decodeHtmlEntities(extractXMLValue(itemContent, 'title'))
        const url = extractXMLValue(itemContent, 'url')
        
        // Extract image URLs
        const imageRegex = /<image[^>]*>([\s\S]*?)<\/image>/g
        const images: {size: string, url: string}[] = []
        let imageMatch
        while ((imageMatch = imageRegex.exec(itemContent)) !== null) {
          const imageContent = imageMatch[1]
          const size = extractXMLValue(imageContent, 'size')
          const imageUrl = extractXMLValue(imageContent, 'url')
          if (size && imageUrl) {
            images.push({ size, url: imageUrl })
          }
        }
        
        // Extract channels
        const channels = extractXMLArray(itemContent, 'channels', 'name').map(decodeHtmlEntities)
        
        // Extract stocks
        const stocks = extractXMLArray(itemContent, 'stocks', 'name').map(decodeHtmlEntities)
        
        // Extract tags
        const tags = extractXMLArray(itemContent, 'tags', 'name').map(decodeHtmlEntities)
        
        if (id && title) {
          newsItems.push({
            id,
            author: author || 'Unknown',
            created: created || '',
            updated: updated || '',
            title,
            url: url || '',
            image: images.length > 0 ? images : undefined,
            channels,
            stocks,
            tags
          })
        }
      }
      
      return newsItems
    } catch (error) {
      return []
    }
  }

  // Helper function to extract single XML values
  const extractXMLValue = (content: string, tag: string): string => {
    const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`)
    const match = content.match(regex)
    const result = match ? match[1].trim() : ''
    return result
  }

  // Helper function to extract XML arrays
  const extractXMLArray = (content: string, parentTag: string, childTag: string): string[] => {
    const regex = new RegExp(`<${parentTag}[^>]*>([\s\S]*?)</${parentTag}>`, 'g')
    const matches = content.match(regex)
    if (!matches) return []
    
    const items: string[] = []
    matches.forEach(match => {
      const value = extractXMLValue(match, childTag)
      if (value) items.push(value)
    })
    return items
  }

  // Helper function to format news dates
  const formatNewsDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours}h ago`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d ago`
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch (error) {
      return 'Unknown'
    }
  }

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    if (!text) return text
    
    // Create a temporary div element to decode HTML entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }

  // Helper function to parse stock data from various response formats
  const parseStockData = (rawData: any): PredictionData[] => {
    
    if (!Array.isArray(rawData)) {
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
      fetchStockNews(stockSymbol)
    } else if (stockSymbol && isDemo) {
      const dummyData = generateDummyHistoricalData(stockSymbol)
      setCurrentStockData(dummyData)
    }
  }, []) // Empty dependency array means this runs once on mount



  // Effect to fetch news when stock symbol changes
  useEffect(() => {
    if (stockSymbol && !isDemo) {
      // Clear previous news first
      setStockNews([])
      // Fetch new news with a small delay to ensure state is updated
      setTimeout(() => {
        fetchStockNews(stockSymbol)
      }, 100)
    }
  }, [stockSymbol]) // This will trigger whenever stockSymbol changes

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
          // Clear prediction data when updating real stock data to prevent mixing
          setPredictionData([])
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

    // Check if we have current stock data
    if (currentStockData.length === 0) {
      setError("Please select a stock first to get current market data")
      return
    }

    // Validate prediction timeframe
    if (months < 1 || months > 12) {
      setError("Prediction timeframe must be between 1 and 12 months")
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
          // Get the latest stock price and complete price history from current data
          let currentStockPrice = "0"
          let stockPriceHistory: Array<{date: string, price: number}> = []
          
          if (currentStockData.length > 0) {
            // Get the most recent price (last item in the sorted array)
            const latestData = currentStockData[currentStockData.length - 1]
            currentStockPrice = latestData.price.toString()
            
            // Get the complete price history
            stockPriceHistory = currentStockData.map(item => ({
              date: item.date,
              price: item.price
            }))
            
            console.log('Current stock price for prediction:', currentStockPrice)
            console.log('Stock price history for prediction:', stockPriceHistory)
          }
          
          // Real API call
          const requestBody: NewsStatementDto = {
            news: filteredNews,
            months: months,
            stockPrice: currentStockPrice,
            stockPriceHistory: stockPriceHistory
          }

          console.log('Sending prediction request:', {
            stockSymbol,
            requestBody,
            currentStockDataLength: currentStockData.length,
            latestPrice: currentStockPrice,
            priceHistoryLength: stockPriceHistory.length
          })

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
          // If API fails, show AI model busy message
          console.warn("API call failed:", apiError)
          setError("AI model is currently busy. Please try again later.")
          // Don't set prediction data - keep the chart showing current stock data
        }
      }
    } catch (err) {
      console.error("Prediction request failed:", err)
      setError("AI model is currently busy. Please try again later.")
      // Don't set prediction data - keep the chart showing current stock data
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
     
          
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 lg:gap-5">
          {/* Chart Section - 70% of screen (7/10 columns) on large screens, full width on mobile */}
          <div className="lg:col-span-7">
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
                    <div className="flex items-center gap-2">
                      <div className="px-0 md:px-3 py-1.5 flex items-center gap-2 bg-blue-500/20 md:rounded-full border border-blue-400/30">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs md:text-sm font-medium text-blue-100">
                          {predictionData.length > 0 ? 'AI Prediction' : 'Real Market Data'}
                        </span>
                      </div>
                      {predictionData.length > 0 && (
                        <Button
                          onClick={clearPredictionAndShowRealData}
                          size="sm"
                          variant="outline"
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 transition-colors backdrop-blur-sm"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Back to Real Data
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                {isLoadingCurrent ? (
                  <div className="min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
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
                  <ChartContainer config={chartConfig} className="min-h-[200px] sm:min-h-[280px] md:min-h-[320px] chart-text-black">
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
                          strokeWidth={2}
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
                                r={months <= 6 ? 3 : 2}
                                fill="white"
                                stroke={color}
                                strokeWidth={2}
                              />
                            );
                          }}
                          activeDot={{ r: months <= 6 ? 5 : 4, stroke: "#1f2937", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : isLoadingCurrent ? (
                  <div className="min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
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
                  <ChartContainer config={chartConfig} className="min-h-[200px] sm:min-h-[280px] md:min-h-[320px] chart-text-black">
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
                          strokeWidth={2}
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
                                  r={3}
                                  fill="white"
                                  stroke={color}
                                  strokeWidth={2}
                                />
                              );
                          }}
                                                      activeDot={{ r: 4, stroke: "#1f2937", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
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
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <p className="text-xs sm:text-sm text-blue-200 font-medium mb-1">Starting Price</p>
                          <p className="text-lg sm:text-2xl font-bold text-white">${predictionData[0]?.price.toFixed(2)}</p>
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

                {/* News Section - Hidden on mobile, shown on larger screens */}
                <div className="hidden sm:block">
                  <Card className="bg-white/10 backdrop-blur-md border mt-5 border-white/20 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r -mt-6 from-blue-500/20 to-indigo-500/20 border-b border-blue-400/30">
                    <CardTitle className="pt-4 text-base sm:text-lg font-bold text-white flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        <span className="text-sm sm:text-base">Market News & Sentiment</span>
                      </div>
                      {stockSymbol && (
                        <span className="text-xs sm:text-sm font-normal text-blue-200 bg-blue-500/20 px-2 py-1 rounded-full self-start sm:self-center">
                          {stockSymbol}
                          {isLoadingNews && (
                            <Loader2 className="h-3 w-3 animate-spin ml-1" />
                          )}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Real-time market updates and analysis for {stockSymbol || 'selected company'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {isLoadingNews ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center space-y-4">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
                          <p className="text-white/60">Loading latest news for {stockSymbol}...</p>
                          {/* Mobile-specific loading message */}
                          <div className="block sm:hidden">
                            <p className="text-xs text-blue-300/80">🔄 Fetching real-time news...</p>
                            <p className="text-xs text-white/40 mt-1">This may take a few seconds</p>
                          </div>
                        </div>
                      </div>
                    ) : stockNews.length > 0 ? (
                      <div className="space-y-4">
                        {stockNews.slice(0, 8).map((newsItem, index) => (
                          <div 
                            key={newsItem.id} 
                            className="group p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/25 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 focus:bg-white/25 focus:border-white/40 focus:shadow-lg focus:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1 focus:-translate-y-1 min-h-[120px] sm:min-h-[100px]"
                            onClick={() => {
                              if (newsItem.url) {
                                window.open(newsItem.url, '_blank')
                              }
                            }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-xs text-white/60 mb-2 group-hover:text-white/80 transition-colors duration-300">
                                  <span className="group-hover:text-blue-200 transition-colors duration-200">{newsItem.author}</span>
                                  <span>•</span>
                                  <span>{formatNewsDate(newsItem.created)}</span>
                                </div>
                                <h4 className="text-sm font-medium text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                                  {newsItem.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {newsItem.stocks.slice(0, 3).map((stock: string, stockIndex: number) => (
                                    <span key={stockIndex} className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200">
                                      {stock}
                                    </span>
                                  ))}
                                  {newsItem.channels.slice(0, 2).map((channel: string, channelIndex: number) => (
                                    <span key={channelIndex} className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200">
                                      {channel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {newsItem.image && newsItem.image.length > 0 && (
                                <div className="w-full sm:w-16 h-20 sm:h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg sm:ml-4 flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                  <img 
                                    src={newsItem.image[0].url} 
                                    alt={newsItem.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/60">No news available for {stockSymbol}</p>
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">

                          <button 
                            onClick={() => fetchStockNews(stockSymbol)}
                            className="mt-2 px-3 py-1 bg-blue-500/30 text-blue-100 text-xs rounded hover:bg-blue-500/50"
                          >
                            Retry News Fetch
                          </button>
                          

                        </div>
                      </div>
                    )}
                    
                    {/* News Status Footer */}
                    {stockNews.length > 0 && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>Showing  news for {stockSymbol}</span>
                          <button 
                            onClick={() => fetchStockNews(stockSymbol)}
                            className="px-2 py-1 bg-blue-500/30 text-blue-100 rounded hover:bg-blue-500/50"
                          >
                            Refresh News
                          </button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  </div>
              </div>

                            {/* Prediction Parameters Section - 30% of screen (3/10 columns) on large screens, full width on mobile */}
              <div className="lg:col-span-3 space-y-3 lg:space-y-2  md:mt-6 lg:sticky lg:top-6 lg:self-start lg:h-fit">
                {/* Stock Selection Card */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-400/40 -mt-6 to-purple-300/40 pb-3 border border-blue-400/30  sm:p-1 ">
                <CardTitle className="text-lg sm:text-xl pt-2 sm:pt-4 font-bold text-white flex items-center gap-2 sm:gap-3">
                  <Target className="h-6 w-6 text-white" />
                  Stock Selection
                </CardTitle>
                <CardDescription className="text-xs text-blue-100">
                        Choose a company to analyze and predict future trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mx-auto  sm:p-1 ">
                                      <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="stock-select" className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <span>Select Company</span>
                    <span className="text-xs bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30">Required</span>
                  </Label>
                  
                  <div className="flex flex-row gap-2 items-center">
                    <Select
                      value={stockSymbol}
                      onOpenChange={(open) => {
                        // Mobile compatibility: ensure dropdown state is properly managed
                        if (!open && stockSymbol) {

                          // Double-check that news is fetched when dropdown closes on mobile
                          setTimeout(() => {
                            if (stockNews.length === 0) {
                              fetchStockNews(stockSymbol)
                            }
                          }, 200)
                        }
                      }}
                      onValueChange={async (value) => {

                        setStockSymbol(value)
                        setSelectedStock(value)
                        // Clear prediction data, errors, and news when switching stocks
                        setPredictionData([])
                        setError(null)
                        setStockNews([]) // Clear previous news
                        
                        // Fetch real stock data and news from the new API endpoint
                        try {
                          setIsLoadingCurrent(true)

                          const response = await fetch(`http://localhost:8080/user/stock/getByCode/${value}`)
                          
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                          }
                          
                          const stockData = await response.json()
                          
                          // Use the helper function to parse the data
                          const chartData = parseStockData(stockData)
                          
                          if (chartData.length === 0) {
                            throw new Error('No valid stock data found in the response')
                          }
                          

                          setCurrentStockData(chartData)
                          // Clear prediction data when updating real stock data to prevent mixing
                          setPredictionData([])
                          setError(null) // Clear any previous errors
                          
                          // Fetch news for the selected stock
                          await fetchStockNews(value) // Make sure to await this
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
                      onClick={() => {
                        // Clear prediction data when refreshing real data
                        setPredictionData([])
                        setError(null)
                        fetchCurrentStockData(stockSymbol)
                        // Also refresh news
                        fetchStockNews(stockSymbol)
                      }}
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
              <CardHeader className="bg-gradient-to-r -mt-6 from-purple-500/20 to-pink-500/20 border-b border-purple-400/30 p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Prediction Parameters
                </CardTitle>
                <CardDescription className="text-white/80">
                  Configure your analysis settings
                  {currentStockData.length > 0 && (
                    <div className="mt-2 text-xs text-white/60">
                      Current stock price: ${currentStockData[currentStockData.length - 1]?.price.toFixed(2)}
                      <br />
                   
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className=" lg:px-6 space-y-4 sm:space-y-6">
                {/* Timeframe Selection */}
                <div className="space-y-2 sm:space-y-3">
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
                    onChange={(e) => {
                      const value = e.target.value
                      // If user tries to make it blank, set to 0
                      if (value === '') {
                        setMonths(0)
                      } else {
                        const numValue = Number(value)
                        // Ensure value is within valid range
                        if (numValue >= 1 && numValue <= 12) {
                          setMonths(numValue)
                        } else if (numValue < 1) {
                          setMonths(1)
                        } else if (numValue > 12) {
                          setMonths(12)
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure value is valid when user leaves the field
                      const value = e.target.value
                      if (value === '' || Number(value) < 1 || Number(value) > 12 || isNaN(Number(value))) {
                        setMonths(1)
                      }
                    }}
                    className={`h-6 text-sm text-white border-white/30 focus:border-purple-400 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm ${
                      months < 1 || months > 12 ? 'border-red-400 focus:border-red-400' : ''
                    }`}
                  />
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                    <span>Range: 1-12 months</span>
                  </div>
                  {(months < 1 || months > 12) && (
                    <div className="flex items-center gap-2 text-xs text-red-400">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span>Invalid timeframe. Must be between 1-12 months.</span>
                    </div>
                  )}
                </div>

                {/* News Input Section */}
                <div className="space-y-3 sm:space-y-4">
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

                  <div className="space-y-2 sm:space-y-3">
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
                  <div className={`p-4 text-sm rounded-lg flex items-center gap-2 backdrop-blur-sm ${
                    error.includes('AI model is currently busy') 
                      ? 'text-orange-200 bg-orange-500/20 border border-orange-400/30' 
                      : 'text-red-200 bg-red-500/20 border border-red-400/30'
                  }`}>
                    <div className="flex items-center gap-2 flex-1">
                      <AlertCircle className={`h-4 w-4 ${
                        error.includes('AI model is currently busy') ? 'text-orange-400' : 'text-red-400'
                      }`} />
                      <span>{error}</span>
                    </div>
                    {error.includes('AI model is currently busy') && (
                      <Button
                        onClick={handlePrediction}
                        disabled={isLoading}
                        size="sm"
                        className="bg-orange-500/30 hover:bg-orange-500/50 text-orange-100 border border-orange-400/30 hover:border-orange-400 transition-colors"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Zap className="h-3 w-3 mr-1" />
                        )}
                        Retry
                      </Button>
                    )}
                  </div>
                )}

                {/* Prediction Button */}
                <Button 
                  onClick={handlePrediction} 
                  disabled={isLoading || !stockSymbol.trim() || months < 1 || months > 12} 
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
                
                {/* Validation Message */}
                {months < 1 || months > 12 ? (
                  <div className="text-center text-xs text-red-400 bg-red-500/10 border border-red-400/20 rounded-lg p-2">
                    ⚠️ Please set a valid prediction timeframe (1-12 months) to enable AI prediction
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Mobile-Only News Section - Shown at bottom on mobile devices */}
        <div className="block sm:hidden mt-8">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r -mt-6 from-blue-500/20 to-indigo-500/20 border-b border-blue-400/30">
              <CardTitle className="pt-4 text-lg font-bold text-white flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <span>Market News & Sentiment</span>
                </div>
                {stockSymbol && (
                  <span className="text-sm font-normal text-blue-200 bg-blue-500/20 px-3 py-1 rounded-full">
                    {stockSymbol}
                    {isLoadingNews && (
                      <Loader2 className="h-3 w-3 animate-spin ml-2" />
                    )}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-white/80 text-center">
                Real-time market updates and analysis for {stockSymbol || 'selected company'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoadingNews ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
                    <p className="text-white/60">Loading latest news for {stockSymbol}...</p>
                    <div className="block sm:hidden">
                      <p className="text-xs text-blue-300/80">🔄 Fetching real-time news...</p>
                      <p className="text-xs text-white/40 mt-1">This may take a few seconds</p>
                    </div>
                  </div>
                </div>
              ) : stockNews.length > 0 ? (
                <div className="space-y-4">
                  {stockNews.slice(0, 6).map((newsItem, index) => (
                    <div 
                      key={newsItem.id} 
                      className="group p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/25 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 focus:bg-white/25 focus:border-white/40 focus:shadow-lg focus:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1 focus:-translate-y-1 min-h-[120px]"
                      onClick={() => {
                        if (newsItem.url) {
                          window.open(newsItem.url, '_blank')
                        }
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-white/60 mb-2 group-hover:text-white/80 transition-colors duration-300">
                            <span className="group-hover:text-blue-200 transition-colors duration-200">{newsItem.author}</span>
                            <span>•</span>
                            <span>{formatNewsDate(newsItem.created)}</span>
                          </div>
                          <h4 className="text-sm font-medium text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                            {newsItem.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {newsItem.stocks.slice(0, 3).map((stock: string, stockIndex: number) => (
                              <span key={stockIndex} className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200">
                                {stock}
                              </span>
                            ))}
                            {newsItem.channels.slice(0, 2).map((channel: string, channelIndex: number) => (
                              <span key={channelIndex} className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200">
                                {channel}
                              </span>
                            ))}
                          </div>
                        </div>
                        {newsItem.image && newsItem.image.length > 0 && (
                          <div className="w-full h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            <img 
                              src={newsItem.image[0].url} 
                              alt={newsItem.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No news available for {stockSymbol}</p>
                  <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">

                    <button 
                      onClick={() => fetchStockNews(stockSymbol)}
                      className="mt-2 px-3 py-1 bg-blue-500/30 text-blue-100 text-xs rounded hover:bg-blue-500/50"
                    >
                      Retry News Fetch
                    </button>
                    

                  </div>
                </div>
              )}
              
              {/* Mobile News Status Footer */}
              {stockNews.length > 0 && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Showing {stockNews.length} news items for {stockSymbol}</span>
                    <button 
                      onClick={() => fetchStockNews(stockSymbol)}
                      className="px-2 py-1 bg-blue-500/30 text-blue-100 rounded hover:bg-blue-500/50"
                    >
                      Refresh News
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
