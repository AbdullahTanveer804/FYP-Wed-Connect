"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calendar, Search, Sparkles, ThumbsUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const AIRecommendationSection = () => {
  return (
    <section className="py-20 bg-gray relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ai-bg1.jpg"
          alt="AI Background"
          fill
          className="object-cover opacity-100"
          priority
        />
      </div>

      {/* Content Container with dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md text-rose rounded-full px-4 py-2 text-sm font-medium border border-white/20">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Recommendations
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-rose">
              Find Your Perfect Wedding Vendors with AI
            </h2>
            
            <p className="text-gray-100 text-lg leading-relaxed">
              Our advanced AI technology analyzes your preferences, budget, and style to recommend the most suitable vendors for your special day.
            </p>

            <div className="grid gap-6 mt-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 group">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-white/10 group-hover:bg-white/30 transition-all">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-rose">Smart Analysis</h3>
                  <p className="text-gray-200">AI understands your unique requirements and wedding vision</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 group">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-white/10 group-hover:bg-white/30 transition-all">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-rose">Personalized Matches</h3>
                  <p className="text-gray-200">Get vendor recommendations that perfectly match your criteria</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 group">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-white/10 group-hover:bg-white/30 transition-all">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-rose">Time-Saving</h3>
                  <p className="text-gray-200">Skip hours of searching and get instant, curated recommendations</p>
                </div>
              </div>
            </div>

            <Link href="/customer/vendors/recommendations">
              <Button className="mt-8 bg-rose hover:bg-rose/90 text-white px-8 py-6 text-lg rounded-full group border border-rose/20 shadow-lg shadow-rose/20">
                Try AI Recommendations
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Illustration */}
          <div className="lg:block relative">
            <Card className="bg-white/95 backdrop-blur-xl border-none shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-rose/20 rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-rose" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose">AI Assistant</h3>
                    <p className="text-sm text-gray-600">Finding perfect matches...</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* AI Process Visualization */}
                  <div className="bg-rose/5 rounded-lg p-4 border border-rose/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-rose" />
                      <span className="text-sm font-medium">Analyzing preferences...</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-rose h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};