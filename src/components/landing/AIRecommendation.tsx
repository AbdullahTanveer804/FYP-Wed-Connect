"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export const AIRecommendation = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real implementation, this would connect to an AI service
      // and display results
    }, 1500);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-rose-light to-gray-light overflow-hidden border-none shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
                <div className="bg-white p-3 rounded-full shadow-md mb-4">
                  <Search className="h-8 w-8 text-rose" />
                </div>
                <h2 className="text-3xl font-bold mb-3">AI Vendor Recommendation</h2>
                <p className="text-gray-700 max-w-2xl">
                  Tell us about your dream wedding and our AI will recommend the perfect vendors for your special day.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-white rounded-lg p-2 shadow-inner">
                  <textarea 
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none resize-none rounded bg-transparent"
                    placeholder="Describe your wedding vision, preferences, location, and budget..."
                    rows={4}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      type="submit"
                      className="bg-rose hover:bg-rose-dark"
                      disabled={!query.trim() || loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Search className="h-4 w-4 mr-2" />
                          Get Recommendations
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};