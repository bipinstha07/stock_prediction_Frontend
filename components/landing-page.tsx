"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Brain, BarChart3, Shield, Zap, Users, ArrowRight, CheckCircle } from "lucide-react"

interface LandingPageProps {
  onLoginClick: () => void
  onSignupClick: () => void
  onDemoClick: () => void
}

export function LandingPage({ onLoginClick, onSignupClick, onDemoClick }: LandingPageProps) {
  return (
    <>
          <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200">
    
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-lg">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Stock Predictions
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform news sentiment into accurate stock price predictions using advanced artificial intelligence. 
            Make informed investment decisions with data-driven insights.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={onSignupClick} 
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Predicting Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={onDemoClick} 
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Try Free Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose StockPredict AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology designed for modern investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group bg-gradient-to-br from-blue-50 via-white to-blue-100 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
                  <Brain className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-blue-700 transition-all duration-300">AI-Powered Analysis</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-all duration-300">
                  Advanced machine learning algorithms analyze news sentiment and market patterns in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-gradient-to-br from-green-50 via-white to-green-100 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
                  <BarChart3 className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-green-700 transition-all duration-300">Interactive Charts</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-all duration-300">
                  Beautiful, responsive charts with detailed analytics and price predictions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-gradient-to-br from-purple-50 via-white to-purple-100 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
                  <Zap className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-purple-700 transition-all duration-300">Real-time Predictions</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-all duration-300">
                  Get instant predictions based on the latest news and market developments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-gradient-to-br from-red-50 via-white to-red-100 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
                  <Shield className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-red-700 transition-all duration-300">Risk Assessment</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-all duration-300">
                  Understand potential risks and confidence levels for each prediction
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-gradient-to-br from-orange-50 via-white to-orange-100 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
                  <Users className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-orange-700 transition-all duration-300">Expert Insights</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-all duration-300">
                  Access insights from financial experts and market analysts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
                  <TrendingUp className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-indigo-700 transition-all duration-300">Portfolio Tracking</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-all duration-300">
                  Track multiple stocks and build comprehensive investment strategies
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to accurate predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Select Stock & News</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose your stock and input relevant company news that might impact the price
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes news sentiment and predicts price movements over your chosen timeframe
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">View Predictions</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed charts and insights to make informed investment decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Transform Your Investment Strategy Today
          </h2>
          <p className="text-xl mb-10 text-gray-700 leading-relaxed">
            Experience the power of AI-driven stock predictions with our cutting-edge platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onSignupClick} 
              className="h-14 px-8 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline" 
              onClick={onDemoClick}
              className="h-14 px-8 text-lg font-semibold border-2 border-gray-700 text-white hover:bg-gray-700 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              View Live Demo
            </Button>
          </div>
          <p className="mt-8 text-gray-600 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
