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

  // Predefined stock companies
  const stockCompanies = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
    { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce" }
  ]

  // Automatically fetch Apple stock data when component mounts
  useEffect(() => {
    if (stockSymbol) {
      fetchCurrentStockData(stockSymbol)
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
          // Real API call for current stock data
          const requestBody: NewsStatementDto = {
            news: ["Current market conditions"],
            months: 1, // Get 1 month of current data
          }

          const response = await fetch(`http://localhost:8080/user/stock/${symbol}`, {
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

          // Process current stock data
          const currentData: PredictionData[] = data
            .map((item: any, index: number) => ({
              date: item.date,
              price: Number(item.price),
              index: index,
            }))
            .sort((a: PredictionData, b: PredictionData) => new Date(a.date).getTime() - new Date(b.date).getTime())

          setCurrentStockData(currentData)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1400px] mx-auto pt-1">
        {isDemo && (
          <Alert className="mb-6 bg-blue-50 text-blue-700 border-blue-200 shadow-sm">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium">
              Demo mode - showing sample data for demonstration purposes
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
     
          
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
          {/* Chart Section - 70% of screen (7/10 columns) */}
          <div className="xl:col-span-7">
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Price Chart {stockSymbol ? `- ${stockSymbol}` : ""}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      {predictionData.length > 0
                        ? `${months} month AI prediction for ${stockSymbol}`
                        : currentStockData.length > 0
                        ? `Current market data for ${stockSymbol}`
                        : "Select a stock to view current market data"}
                    </CardDescription>
                  </div>
                  {stockSymbol && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Live Data</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                {isLoadingCurrent ? (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Loading market data...</p>
                        <p className="text-sm text-gray-400">Fetching current stock information</p>
                      </div>
                    </div>
                  </div>
                ) : predictionData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="min-h-[320px] chart-text-black">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
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
                          tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value.toFixed(2)}`} 
                          tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                          axisLine={{ stroke: '#e5e7eb' }}
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
                ) : currentStockData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="min-h-[320px] chart-text-black">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentStockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }}
                          interval={Math.max(0, Math.floor(currentStockData.length / 8))}
                          tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value.toFixed(2)}`} 
                          tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                          axisLine={{ stroke: '#e5e7eb' }}
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
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <BarChart3 className="h-10 w-10 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium text-lg">No data available</p>
                        <p className="text-gray-400">Select a stock from the right panel to view current market data</p>
                      </div>
                    </div>
                  </div>
                )}
                                </CardContent>
                </Card>

                {/* Prediction Summary Section */}
                {predictionData.length > 0 && (
                  <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                        Prediction Summary
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Key insights from your AI-powered stock analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-blue-600 font-medium mb-1">Starting Price</p>
                          <p className="text-2xl font-bold text-blue-900">${predictionData[0]?.price.toFixed(2)}</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-purple-600 font-medium mb-1">Target Price</p>
                          <p className="text-2xl font-bold text-purple-900">
                            ${predictionData[predictionData.length - 1]?.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BarChart3 className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-green-600 font-medium mb-1">Price Change</p>
                          <p className="text-2xl font-bold text-green-900">
                            {predictionData.length > 1
                              ? `${(((predictionData[predictionData.length - 1].price - predictionData[0].price) / predictionData[0].price) * 100).toFixed(2)}%`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-orange-600 font-medium mb-1">Data Points</p>
                          <p className="text-2xl font-bold text-orange-900">{predictionData.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Prediction Parameters Section - 30% of screen (3/10 columns) */}
              <div className="xl:col-span-3 space-y-6 xl:sticky xl:top-6 xl:self-start">
            {/* Stock Selection Card */}
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-6">
                <CardTitle className="text-xl pt-4 font-bold text-white flex items-center gap-3">
                  <Target className="h-6 w-6 text-white" />
                  Stock Selection
                </CardTitle>
                <CardDescription className="text-blue-100">
                        Choose a company to analyze and predict future trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mx-auto">
                      <div className="space-y-4">
                        <Label htmlFor="stock-select" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <span>Select Company</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2  py-0.5 rounded-full">Required</span>
                        </Label>
                        <Select
        value={stockSymbol}
        onValueChange={(value) => {
          setStockSymbol(value)
          setSelectedStock(value)
          setPredictionData([])
          setError(null)
          fetchCurrentStockData(value)
        }}
              >
          <SelectTrigger className="h-14 px-4 text-base border border-gray-200 rounded-2xl bg-white text-gray-900 shadow-sm hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
            <SelectValue className="text-gray-600 font-medium" placeholder="Choose a stock to analyze" />
          </SelectTrigger>

          <SelectContent className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden w-100 max-h-[400px]">
            {stockCompanies.map((stock) => (
              <SelectItem 
                key={stock.symbol} 
                value={stock.symbol}
                className="p-4 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-700 
                          data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700 
                          cursor-pointer border-b  border-gray-100 last:border-0 transition-colors"
              >
                <div className="flex flex-col  gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold w-30 text-lg">{stock.symbol}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                      {stock.sector}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{stock.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                </div>
              </CardContent>
            </Card>

            {/* Prediction Parameters Card */}
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Prediction Parameters
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure your analysis settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-6">
                {/* Timeframe Selection */}
                <div className="space-y-3">
                  <Label htmlFor="months" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>Prediction Timeframe</span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </Label>
                  <Input
                    id="months"
                    type="number"
                    min="1"
                    max="12"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="h-12 text-sm text-gray-900 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-gray-50 hover:bg-white transition-colors"
                  />
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span>Range: 1-12 months</span>
                  </div>
                </div>

                {/* News Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span>News & Sentiment</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addNewsItem}
                      className="flex items-center gap-2 py-2 px-3 text-sm border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 cursor-pointer rounded-lg"
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
                          className="min-h-[60px] py-3 px-4 text-sm text-gray-900 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-gray-50 hover:bg-white transition-colors resize-none rounded-lg"
                        />
                        {newsList.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeNewsItem(index)}
                            className="absolute top-2 right-2 w-6 h-6 p-0 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 cursor-pointer rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
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
