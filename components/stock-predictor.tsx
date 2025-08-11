"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, TrendingUp, Plus, X, AlertCircle } from "lucide-react"
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
  const [stockSymbol, setStockSymbol] = useState("")
  const [newsList, setNewsList] = useState<string[]>([""])
  const [months, setMonths] = useState<number>(6)
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="min-h-screen bg-white ">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {isDemo && (
          <Alert className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Demo mode - showing sample data
            </AlertDescription>
          </Alert>
        )}

       

        <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
          {/* Chart Section - 70% of screen (7/10 columns) */}
          <div className="xl:col-span-7">
            <Card className="bg-white  border  border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Price Chart   <span className="text-center">
          <h1 className="text-xl font-medium text-gray-900">{isDemo ? "Demo: " : ""}Stock Predictor</h1>
          <p className="text-gray-500 text-xs">AI-powered price predictions based on news analysis</p>
        </span></CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  {predictionData.length > 0
                    ? `${months} month prediction for ${stockSymbol}`
                    : "Generate prediction to view chart"} 
                   
                  
                   
                </CardDescription>
                
              </CardHeader>
              <CardContent className="pt-0">
                {predictionData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="min-h-[450px] chart-text-black">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                          tick={{ fontSize: 11, fill: '#000000', fontWeight: 500 }}
                          axisLine={{ stroke: '#000000' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value.toFixed(2)}`} 
                          tick={{ fontSize: 11, fill: '#000000', fontWeight: 500 }}
                          axisLine={{ stroke: '#000000' }}
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
                                r={months <= 6 ? 4 : 3}
                                fill="white"
                                stroke={color}
                                strokeWidth={2}
                              />
                            );
                          }}
                          activeDot={{ r: months <= 6 ? 6 : 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-6 w-6 mx-auto text-gray-300" />
                      <p className="text-xs text-gray-500">No data available</p>
                      <p className="text-xs text-gray-400">Generate prediction to view chart</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prediction Parameters Section - 30% of screen (3/10 columns) */}
          <div className="xl:col-span-3 space-y-3">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <TrendingUp className="h-3 w-3 text-gray-600" />
                  Parameters
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">Stock symbol, news, and timeframe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-1">
                  <Label htmlFor="stock-symbol" className="text-xs font-medium text-gray-700">Symbol</Label>
                  <Input
                    id="stock-symbol"
                    placeholder="AAPL, GOOGL, TSLA"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                    className="py-1.5 text-sm text-black border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="months" className="text-xs font-medium text-gray-700">Months</Label>
                  <Input
                    id="months"
                    type="number"
                    min="1"
                    max="12"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="py-1.5 text-sm text-black border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                  <p className="text-xs text-gray-400">1-12 months</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-gray-700">News</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addNewsItem}
                      className="flex items-center gap-1 py-1 px-2 text-xs border-gray-200 hover:bg-green-500"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>

                  {newsList.map((news, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        placeholder={`News ${index + 1}...`}
                        value={news}
                        onChange={(e) => updateNewsItem(index, e.target.value)}
                        className="min-h-[50px] py-1.5 text-xs text-black border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      />
                      {newsList.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeNewsItem(index)}
                          className="shrink-0 py-1 px-2 text-xs border-gray-200 hover:bg-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>
                )}

                <Button onClick={handlePrediction} disabled={isLoading} className="w-full py-2 text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 cursor-pointer">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    `Get ${isDemo ? "Demo " : ""}Prediction`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {predictionData.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-600">Start</p>
                  <p className="text-lg font-semibold text-gray-900">${predictionData[0]?.price.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-600">End</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${predictionData[predictionData.length - 1]?.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-600">Change</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {predictionData.length > 1
                      ? `${(((predictionData[predictionData.length - 1].price - predictionData[0].price) / predictionData[0].price) * 100).toFixed(2)}%`
                      : "N/A"}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-600">Points</p>
                  <p className="text-lg font-semibold text-gray-900">{predictionData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
