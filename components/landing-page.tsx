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
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
    
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-lg">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Stock Predictions
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform news sentiment into accurate stock price predictions using advanced artificial intelligence. 
            Make informed investment decisions with data-driven insights.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={onSignupClick} 
              className="h-14 px-8 text-lg font-semibold bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Predicting Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={onDemoClick} 
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white hover:from-purple-600/90 hover:to-pink-600/90 border border-purple-400/30 hover:border-purple-400/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm"
            >
              Try Free Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose StockPredict AI?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Cutting-edge technology designed for modern investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out border border-blue-400/30">
                  <Brain className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-all duration-300">AI-Powered Analysis</CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white transition-all duration-300">
                  Advanced machine learning algorithms analyze news sentiment and market patterns in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out border border-green-400/30">
                  <BarChart3 className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-green-300 transition-all duration-300">Interactive Charts</CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white transition-all duration-300">
                  Beautiful, responsive charts with detailed analytics and price predictions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out border border-purple-400/30">
                  <Zap className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-all duration-300">Real-time Predictions</CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white transition-all duration-300">
                  Get instant predictions based on the latest news and market developments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out border border-red-400/30">
                  <Shield className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-red-300 transition-all duration-300">Risk Assessment</CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white transition-all duration-300">
                  Understand potential risks and confidence levels for each prediction
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out border border-orange-400/30">
                  <Users className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-orange-300 transition-all duration-300">Expert Insights</CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white transition-all duration-300">
                  Access insights from financial experts and market analysts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out rounded-xl overflow-hidden cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out border border-indigo-400/30">
                  <TrendingUp className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-indigo-300 transition-all duration-300">Portfolio Tracking</CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white transition-all duration-300">
                  Track multiple stocks and build comprehensive investment strategies
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/80">
              Three simple steps to accurate predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-blue-400/30">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Select Stock & News</h3>
              <p className="text-white/80 leading-relaxed">
                Choose your stock and input relevant company news that might impact the price
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500/80 to-green-600/80 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-green-400/30">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI Analysis</h3>
              <p className="text-white/80 leading-relaxed">
                Our AI analyzes news sentiment and predicts price movements over your chosen timeframe
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-purple-400/30">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">View Predictions</h3>
              <p className="text-white/80 leading-relaxed">
                Get detailed charts and insights to make informed investment decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Transform Your Investment Strategy Today
          </h2>
          <p className="text-xl mb-10 text-white/80 leading-relaxed">
            Experience the power of AI-driven stock predictions with our cutting-edge platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onSignupClick} 
              className="h-14 px-8 text-lg font-semibold bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline" 
              onClick={onDemoClick}
              className="h-14 px-8 text-lg font-semibold  bg-accent backdrop-blur-sm border  border-white/30 text-white hover:bg-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              View Live Demo
            </Button>
          </div>
          <p className="mt-8 text-white/70 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
