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
