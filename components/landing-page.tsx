"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Brain, BarChart3, Shield, Zap, Users } from "lucide-react"

interface LandingPageProps {
  onLoginClick: () => void
  onSignupClick: () => void
  onDemoClick: () => void
}

export function LandingPage({ onLoginClick, onSignupClick, onDemoClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Stock Themed Background */}
      <div className="absolute inset-0 pointer-events-none stock-chart-bg" style={{ zIndex: 1 }}>
        {/* Stock Chart Lines */}
        <svg className="absolute top-20 left-10 w-32 h-24" viewBox="0 0 100 60" fill="none">
          <path d="M0 50 L20 40 L40 45 L60 30 L80 35 L100 25" stroke="#22c55e" strokeWidth="2" fill="none"/>
          <circle cx="20" cy="40" r="2" fill="#22c55e"/>
          <circle cx="40" cy="45" r="2" fill="#22c55e"/>
          <circle cx="60" cy="30" r="2" fill="#22c55e"/>
          <circle cx="80" cy="35" r="2" fill="#22c55e"/>
          <circle cx="100" cy="25" r="2" fill="#22c55e"/>
        </svg>
        
        <svg className="absolute top-40 right-20 w-40 h-32" viewBox="0 0 100 60" fill="none">
          <path d="M0 40 L25 35 L50 45 L75 20 L100 30" stroke="#ef4444" strokeWidth="2" fill="none"/>
          <circle cx="25" cy="35" r="2" fill="#ef4444"/>
          <circle cx="50" cy="45" r="2" fill="#ef4444"/>
          <circle cx="75" cy="20" r="2" fill="#ef4444"/>
          <circle cx="100" cy="30" r="2" fill="#ef4444"/>
        </svg>
        
        <svg className="absolute bottom-40 left-20 w-36 h-28" viewBox="0 0 100 60" fill="none">
          <path d="M0 45 L30 30 L60 40 L100 25" stroke="#3b82f6" strokeWidth="2" fill="none"/>
          <circle cx="30" cy="30" r="2" fill="#3b82f6"/>
          <circle cx="60" cy="40" r="2" fill="#3b82f6"/>
          <circle cx="100" cy="25" r="2" fill="#3b82f6"/>
        </svg>
        
        {/* Additional Chart Elements */}
        <svg className="absolute top-60 left-1/3 w-28 h-20" viewBox="0 0 100 60" fill="none">
          <path d="M0 35 L33 25 L66 40 L100 30" stroke="#8b5cf6" strokeWidth="1.5" fill="none"/>
          <circle cx="33" cy="25" r="1.5" fill="#8b5cf6"/>
          <circle cx="66" cy="40" r="1.5" fill="#8b5cf6"/>
          <circle cx="100" cy="30" r="1.5" fill="#8b5cf6"/>
        </svg>
        
        <svg className="absolute bottom-20 right-10 w-32 h-24" viewBox="0 0 100 60" fill="none">
          <path d="M0 30 L25 40 L50 20 L75 35 L100 25" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="40" r="1.5" fill="#f59e0b"/>
          <circle cx="50" cy="20" r="1.5" fill="#f59e0b"/>
          <circle cx="75" cy="35" r="1.5" fill="#f59e0b"/>
          <circle cx="100" cy="25" r="1.5" fill="#f59e0b"/>
        </svg>
        
        {/* Stock Symbols */}
        <div className="stock-symbol absolute top-32 left-1/4">AAPL</div>
        <div className="stock-symbol absolute top-48 right-1/3">GOOGL</div>
        <div className="stock-symbol absolute bottom-32 left-1/3">TSLA</div>
        <div className="stock-symbol absolute top-64 left-1/2">MSFT</div>
        <div className="stock-symbol absolute bottom-48 right-1/4">AMZN</div>
        <div className="stock-symbol absolute top-80 right-1/2">NVDA</div>
        <div className="stock-symbol absolute bottom-60 left-1/5">META</div>
        <div className="stock-symbol absolute top-96 left-1/6">NFLX</div>
        
        {/* Candlestick Patterns */}
        <div className="candlestick absolute top-80 left-16 text-green-500">
          <div className="body h-6"></div>
          <div className="wick"></div>
        </div>
        
        <div className="candlestick absolute top-72 right-32 text-red-500">
          <div className="body h-4"></div>
          <div className="wick"></div>
        </div>
        
        <div className="candlestick absolute bottom-64 left-1/2 text-blue-500">
          <div className="body h-5"></div>
          <div className="wick"></div>
        </div>
        
        <div className="candlestick absolute top-40 left-3/4 text-purple-500">
          <div className="body h-3"></div>
          <div className="wick"></div>
        </div>
        
        <div className="candlestick absolute bottom-80 right-1/6 text-orange-500">
          <div className="body h-4"></div>
          <div className="wick"></div>
        </div>
        
        {/* Additional Stock Chart Lines */}
        <svg className="absolute top-16 right-1/4 w-24 h-16" viewBox="0 0 100 60" fill="none">
          <path d="M0 45 L20 35 L40 40 L60 25 L80 30 L100 20" stroke="#06b6d4" strokeWidth="1.5" fill="none"/>
          <circle cx="20" cy="35" r="1.5" fill="#06b6d4"/>
          <circle cx="40" cy="40" r="1.5" fill="#06b6d4"/>
          <circle cx="60" cy="25" r="1.5" fill="#06b6d4"/>
          <circle cx="80" cy="30" r="1.5" fill="#06b6d4"/>
          <circle cx="100" cy="20" r="1.5" fill="#06b6d4"/>
        </svg>
        
        <svg className="absolute top-72 left-1/5 w-20 h-14" viewBox="0 0 100 60" fill="none">
          <path d="M0 40 L25 30 L50 35 L75 25 L100 20" stroke="#ec4899" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="30" r="1.5" fill="#ec4899"/>
          <circle cx="50" cy="35" r="1.5" fill="#ec4899"/>
          <circle cx="75" cy="25" r="1.5" fill="#ec4899"/>
          <circle cx="100" cy="20" r="1.5" fill="#ec4899"/>
        </svg>
        
        <svg className="absolute bottom-32 right-1/3 w-28 h-18" viewBox="0 0 100 60" fill="none">
          <path d="M0 35 L33 25 L66 40 L100 30" stroke="#10b981" strokeWidth="1.5" fill="none"/>
          <circle cx="33" cy="25" r="1.5" fill="#10b981"/>
          <circle cx="66" cy="40" r="1.5" fill="#10b981"/>
          <circle cx="100" cy="30" r="1.5" fill="#10b981"/>
        </svg>
        
        <svg className="absolute top-48 left-2/3 w-22 h-16" viewBox="0 0 100 60" fill="none">
          <path d="M0 30 L25 40 L50 20 L75 35 L100 25" stroke="#f97316" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="40" r="1.5" fill="#f97316"/>
          <circle cx="50" cy="20" r="1.5" fill="#f97316"/>
          <circle cx="75" cy="35" r="1.5" fill="#f97316"/>
          <circle cx="100" cy="25" r="1.5" fill="#f97316"/>
        </svg>
        
        <svg className="absolute bottom-16 left-1/3 w-26 h-20" viewBox="0 0 100 60" fill="none">
          <path d="M0 45 L20 35 L40 45 L60 30 L80 40 L100 25" stroke="#8b5cf6" strokeWidth="1.5" fill="none"/>
          <circle cx="20" cy="35" r="1.5" fill="#8b5cf6"/>
          <circle cx="40" cy="45" r="1.5" fill="#8b5cf6"/>
          <circle cx="60" cy="30" r="1.5" fill="#8b5cf6"/>
          <circle cx="80" cy="40" r="1.5" fill="#8b5cf6"/>
          <circle cx="100" cy="25" r="1.5" fill="#8b5cf6"/>
        </svg>
        
        <svg className="absolute top-88 right-1/6 w-24 h-18" viewBox="0 0 100 60" fill="none">
          <path d="M0 40 L25 30 L50 40 L75 25 L100 35" stroke="#059669" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="30" r="1.5" fill="#059669"/>
          <circle cx="50" cy="40" r="1.5" fill="#059669"/>
          <circle cx="75" cy="25" r="1.5" fill="#059669"/>
          <circle cx="100" cy="35" r="1.5" fill="#059669"/>
        </svg>
        
        <svg className="absolute bottom-48 left-1/6 w-20 h-14" viewBox="0 0 100 60" fill="none">
          <path d="M0 35 L33 25 L66 35 L100 20" stroke="#dc2626" strokeWidth="1.5" fill="none"/>
          <circle cx="33" cy="25" r="1.5" fill="#dc2626"/>
          <circle cx="66" cy="35" r="1.5" fill="#dc2626"/>
          <circle cx="100" cy="20" r="1.5" fill="#dc2626"/>
        </svg>
        
        <svg className="absolute top-32 right-1/2 w-26 h-18" viewBox="0 0 100 60" fill="none">
          <path d="M0 30 L25 40 L50 25 L75 35 L100 20" stroke="#0891b2" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="40" r="1.5" fill="#0891b2"/>
          <circle cx="50" cy="25" r="1.5" fill="#0891b2"/>
          <circle cx="75" cy="35" r="1.5" fill="#0891b2"/>
          <circle cx="100" cy="20" r="1.5" fill="#0891b2"/>
        </svg>
        
        {/* More Stock Chart Lines */}
        <svg className="absolute top-56 left-1/4 w-20 h-16" viewBox="0 0 100 60" fill="none">
          <path d="M0 40 L33 30 L66 35 L100 25" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
          <circle cx="33" cy="30" r="1.5" fill="#7c3aed"/>
          <circle cx="66" cy="35" r="1.5" fill="#7c3aed"/>
          <circle cx="100" cy="25" r="1.5" fill="#7c3aed"/>
        </svg>
        
        <svg className="absolute bottom-24 right-1/5 w-22 h-16" viewBox="0 0 100 60" fill="none">
          <path d="M0 35 L25 45 L50 30 L75 40 L100 20" stroke="#ea580c" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="45" r="1.5" fill="#ea580c"/>
          <circle cx="50" cy="30" r="1.5" fill="#ea580c"/>
          <circle cx="75" cy="40" r="1.5" fill="#ea580c"/>
          <circle cx="100" cy="20" r="1.5" fill="#ea580c"/>
        </svg>
        
        <svg className="absolute top-80 left-1/2 w-24 h-18" viewBox="0 0 100 60" fill="none">
          <path d="M0 45 L20 35 L40 40 L60 30 L80 35 L100 25" stroke="#be185d" strokeWidth="1.5" fill="none"/>
          <circle cx="20" cy="35" r="1.5" fill="#be185d"/>
          <circle cx="40" cy="40" r="1.5" fill="#be185d"/>
          <circle cx="60" cy="30" r="1.5" fill="#be185d"/>
          <circle cx="80" cy="35" r="1.5" fill="#be185d"/>
          <circle cx="100" cy="25" r="1.5" fill="#be185d"/>
        </svg>
        
        <svg className="absolute bottom-40 right-2/3 w-20 h-14" viewBox="0 0 100 60" fill="none">
          <path d="M0 30 L25 40 L50 25 L75 35 L100 20" stroke="#0d9488" strokeWidth="1.5" fill="none"/>
          <circle cx="25" cy="40" r="1.5" fill="#0d9488"/>
          <circle cx="50" cy="25" r="1.5" fill="#0d9488"/>
          <circle cx="75" cy="35" r="1.5" fill="#0d9488"/>
          <circle cx="100" cy="20" r="1.5" fill="#0d9488"/>
        </svg>
        
        <svg className="absolute top-24 left-1/6 w-18 h-14" viewBox="0 0 100 60" fill="none">
          <path d="M0 35 L33 25 L66 35 L100 20" stroke="#c2410c" strokeWidth="1.5" fill="none"/>
          <circle cx="33" cy="25" r="1.5" fill="#c2410c"/>
          <circle cx="66" cy="35" r="1.5" fill="#c2410c"/>
          <circle cx="100" cy="20" r="1.5" fill="#c2410c"/>
        </svg>
        
        <svg className="absolute bottom-56 left-2/5 w-24 h-16" viewBox="0 0 100 60" fill="none">
          <path d="M0 40 L20 30 L40 35 L60 25 L80 30 L100 20" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
          <circle cx="20" cy="30" r="1.5" fill="#a855f7"/>
          <circle cx="40" cy="35" r="1.5" fill="#a855f7"/>
          <circle cx="60" cy="25" r="1.5" fill="#a855f7"/>
          <circle cx="80" cy="30" r="1.5" fill="#a855f7"/>
          <circle cx="100" cy="20" r="1.5" fill="#a855f7"/>
        </svg>
        
        {/* 3 Big and Thick Stock Chart Lines */}
        <svg className="absolute top-20 left-10 w-96 h-48 opacity-70" viewBox="0 0 400 200" fill="none">
          <path d="M0 150 L50 120 L100 140 L150 100 L200 130 L250 80 L300 110 L350 90 L400 70" stroke="#22c55e" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <circle cx="50" cy="120" r="6" fill="#22c55e"/>
          <circle cx="100" cy="140" r="6" fill="#22c55e"/>
          <circle cx="150" cy="100" r="6" fill="#22c55e"/>
          <circle cx="200" cy="130" r="6" fill="#22c55e"/>
          <circle cx="250" cy="80" r="6" fill="#22c55e"/>
          <circle cx="300" cy="110" r="6" fill="#22c55e"/>
          <circle cx="350" cy="90" r="6" fill="#22c55e"/>
          <circle cx="400" cy="70" r="6" fill="#22c55e"/>
        </svg>
        
        <svg className="absolute top-40 right-20 w-80 h-40 opacity-20" viewBox="0 0 300 150" fill="none">
          <path d="M0 100 L60 80 L120 90 L180 60 L240 80 L300 50" stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <circle cx="60" cy="80" r="5" fill="#ef4444"/>
          <circle cx="120" cy="90" r="5" fill="#ef4444"/>
          <circle cx="180" cy="60" r="5" fill="#ef4444"/>
          <circle cx="240" cy="80" r="5" fill="#ef4444"/>
          <circle cx="300" cy="50" r="5" fill="#ef4444"/>
        </svg>
        
        <svg className="absolute bottom-20 left-1/2 w-72 h-36 opacity-20" viewBox="0 0 250 120" fill="none">
          <path d="M0 80 L50 60 L100 70 L150 50 L200 60 L250 40" stroke="#3b82f6" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <circle cx="50" cy="60" r="5" fill="#3b82f6"/>
          <circle cx="100" cy="70" r="5" fill="#3b82f6"/>
          <circle cx="150" cy="50" r="5" fill="#3b82f6"/>
          <circle cx="200" cy="60" r="5" fill="#3b82f6"/>
          <circle cx="250" cy="40" r="5" fill="#3b82f6"/>
        </svg>

      
      </div>
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" style={{ zIndex: 2 }}></div>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Predict Stock Prices with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                AI-Powered News Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform company news into actionable stock predictions. Our advanced AI analyzes market sentiment and
              news impact to forecast price movements with unprecedented accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onSignupClick} className="text-lg px-8 py-3 bg-gray-900 cursor-pointer text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent">
                Start Predicting Now
              </Button>
              <Button size="lg" variant="outline" onClick={onDemoClick} className="text-lg px-8 py-3 cursor-pointer border-gray-300 text-white hover:bg-white hover:text-black hover:border-black border-2">
                Try Free Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose StockPredict AI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leverage cutting-edge technology to make informed investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-gray-700 mb-4" />
                <CardTitle className="text-gray-900">AI-Powered Analysis</CardTitle>
                <CardDescription className="text-gray-600">
                  Advanced machine learning algorithms analyze news sentiment and market patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-gray-700 mb-4" />
                <CardTitle className="text-gray-900">Interactive Charts</CardTitle>
                <CardDescription className="text-gray-600">
                  Visualize predictions with beautiful, interactive charts and detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-gray-700 mb-4" />
                <CardTitle className="text-gray-900">Real-time Predictions</CardTitle>
                <CardDescription className="text-gray-600">
                  Get instant predictions based on the latest news and market developments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-gray-700 mb-4" />
                <CardTitle className="text-gray-900">Risk Assessment</CardTitle>
                <CardDescription className="text-gray-600">Understand potential risks and confidence levels for each prediction</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-gray-700 mb-4" />
                <CardTitle className="text-gray-900">Expert Insights</CardTitle>
                <CardDescription className="text-gray-600">Access insights from financial experts and market analysts</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-gray-700 mb-4" />
                <CardTitle className="text-gray-900">Portfolio Tracking</CardTitle>
                <CardDescription className="text-gray-600">Track multiple stocks and build comprehensive investment strategies</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-25 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get accurate stock predictions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Stock & News</h3>
              <p className="text-gray-600">
                Input the stock symbol and relevant company news that might impact the price
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes the news sentiment and predicts price movements over your chosen timeframe
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">View Predictions</h3>
              <p className="text-gray-600">Get detailed charts and insights to make informed investment decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ready to Start Predicting?</h2>
          <p className="text-xl mb-8 text-gray-600">
            Join thousands of investors who trust StockPredict AI for their investment decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onSignupClick} className="text-lg px-8 py-3 bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent cursor-pointer">
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline" 
              onClick={onDemoClick}
              className="text-lg px-8 py-3 bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent cursor-pointer"
            >
              Try Demo First
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
