"use client"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Star, DollarSign, Loader2, MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

// Types
interface Package {
  name: string;
  description: string;
  price: number;
  venueCapacity: number | null;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Vendor {
  id: string;
  title: string;
  description: string;
  expertise: string[];
  duration: string;
  staff: number;
  categoryId: string;
  packages: Package[];
  priceRange: PriceRange;
  location: string;
  rating: number;
  featured: boolean;
}

interface Recommendation {
  listingId: string;
  title: string;
  matchReason: string;
  matchScore: number;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  summary: string;
}

interface FormValues {
  prompt: string;
  budget: number;
  style: string;
  location: string;
  category: string[];
}

// Define form schema
const AIRecommendationSchema = z.object({
  prompt: z.string().min(10, "Please provide more details about what you're looking for"),
  budget: z.number().min(1000, "Budget must be at least ₹1,000"),
  style: z.string().min(1, "Please select a style"),
  location: z.string().min(1, "Please enter a location"),
  category: z.array(z.string()).min(1, "Please select at least one category"),
});

// Mock categories data
const categories = [
  "Photography", "Catering", "Decor", "Venue",
  "Attire", "Music", "Invitations", "Transport"
];

// Mock styles data
const styles = [
  "Traditional", "Modern", "Rustic", "Luxury",
  "Minimalist", "Vintage", "Bohemian", "Cultural"
];

// Mock vendor data
const mockVendors: Vendor[] = [
  {
    id: "v1",
    title: "Elegant Moments Photography",
    description: "We capture moments that last a lifetime with our artistic approach to wedding photography",
    expertise: ["Candid Photography", "Traditional Shoots", "Video Editing"],
    duration: "Full Day",
    staff: 3,
    categoryId: "Photography",
    packages: [
      {
        name: "Basic Package",
        description: "8 hours coverage, 200 edited photos",
        price: 25000,
        venueCapacity: null,
      },
      {
        name: "Premium Package",
        description: "12 hours coverage, 500 edited photos, wedding film",
        price: 45000,
        venueCapacity: null,
      }
    ],
    priceRange: {
      min: 25000,
      max: 45000,
    },
    location: "Lahore",
    rating: 4.8,
    featured: true,
  },
  {
    id: "v2",
    title: "Royal Feast Catering",
    description: "Exquisite menus crafted with local ingredients and international techniques",
    expertise: ["Multi-cuisine", "Theme-based Food", "Beverages"],
    duration: "Customizable",
    staff: 12,
    categoryId: "Catering",
    packages: [
      {
        name: "Standard Menu",
        description: "10 items including 2 starters, 3 main courses, 2 desserts",
        price: 1200,
        venueCapacity: 100,
      },
      {
        name: "Deluxe Menu",
        description: "15 items including international cuisines and premium desserts",
        price: 2000,
        venueCapacity: 150,
      }
    ],
    priceRange: {
      min: 1200,
      max: 2000,
    },
    location: "Lahore",
    rating: 4.7,
    featured: false,
  },
  {
    id: "v3",
    title: "Dream Decorators",
    description: "Transform any venue into a magical wedding setting with our creative decor",
    expertise: ["Floral Arrangements", "Lighting", "Theme Setup"],
    duration: "Setup day before event",
    staff: 8,
    categoryId: "Decor",
    packages: [
      {
        name: "Classic Decoration",
        description: "Basic floral arrangements, standard lighting",
        price: 35000,
        venueCapacity: 200,
      },
      {
        name: "Luxury Decoration",
        description: "Premium flowers, advanced lighting, custom backdrops",
        price: 85000,
        venueCapacity: 300,
      }
    ],
    priceRange: {
      min: 35000,
      max: 85000,
    },
    location: "Karachi",
    rating: 4.9,
    featured: true,
  }
];

const AIRecommendationsComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [recommendedVendors, setRecommendedVendors] = useState<Vendor[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(AIRecommendationSchema),
    defaultValues: {
      prompt: "",
      budget: 50000,
      style: "",
      location: "",
      category: [],
    },
  });

  // Show featured vendors initially
  useEffect(() => {
    const featuredVendors = mockVendors.filter(vendor => vendor.featured);
    setRecommendedVendors(featuredVendors);
    
    // Set initial recommendations
    setRecommendations({
      recommendations: featuredVendors.map(vendor => ({
        listingId: vendor.id,
        title: vendor.title,
        matchReason: `This is one of our top-rated ${vendor.categoryId} vendors with excellent reviews.`,
        matchScore: 85, // Default high score for featured vendors
      })),
      summary: "Here are some of our featured vendors that are popular among couples. Complete the form for personalized recommendations."
    });
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Mock API response for demonstration
      setTimeout(() => {
        // Find vendors that match criteria
        const filteredVendors = mockVendors.filter(vendor =>
          (!values.location || vendor.location.toLowerCase() === values.location.toLowerCase()) &&
          vendor.priceRange.max <= values.budget &&
          (!values.category.length || values.category.some(cat => cat.toLowerCase() === vendor.categoryId.toLowerCase()))
        );

        // Mock AI recommendations
        const mockRecommendations: RecommendationResponse = {
          recommendations: filteredVendors.map(vendor => {
            const categoryMatch = values.category.find(cat => cat.toLowerCase() === vendor.categoryId.toLowerCase());
            return {
              listingId: vendor.id,
              title: vendor.title,
              matchReason: `Matches your ${values.style || 'preferred'} style, budget, and ${categoryMatch ? categoryMatch.toLowerCase() : 'category'} requirements. Located in ${vendor.location}.`,
              matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
            }
          }),
          summary: `Based on your ${values.style || 'selected'} preferences, budget of ₹${values.budget.toLocaleString()}, and selected categories, we found ${filteredVendors.length} vendors that match your needs.`
        };

        setRecommendations(mockRecommendations);
        setRecommendedVendors(filteredVendors);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Render a vendor card
  const renderVendorCard = (vendor: Vendor, recommendation?: Recommendation) => (
    <Card key={vendor.id} className="overflow-hidden border-none shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="bg-rose/10 p-6 flex flex-col justify-center">
          <div className="mb-3">
            <span className="inline-flex items-center bg-rose/20 text-rose rounded-full px-3 py-1 text-sm font-medium">
              Match Score: {recommendation?.matchScore}%
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-1">{vendor.title}</h3>
          <div className="flex items-center mb-4">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="ml-1 font-medium">{vendor.rating}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{vendor.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>₹{vendor.priceRange.min.toLocaleString()} - ₹{vendor.priceRange.max.toLocaleString()}</span>
          </div>
        </div>

        <div className="col-span-2 p-6">
          <p className="text-muted-foreground mb-4">{vendor.description}</p>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Why we recommended this:</h4>
            <p className="text-muted-foreground">{recommendation?.matchReason}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Expertise:</h4>
            <div className="flex flex-wrap gap-2">
              {vendor.expertise.map((skill, i) => (
                <span
                  key={i}
                  className="bg-accent px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Button className="bg-rose hover:bg-rose-dark">View Full Profile</Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">AI Vendor Recommendations</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Describe what you're looking for, and our AI will help you find the perfect vendors for your special day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compact AI Form - Wider but shorter */}
        <div className="lg:col-span-5">
          <Card className="w-full shadow-lg border-rose/20 sticky top-4" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <CardHeader className="bg-accent/50 rounded-t-lg py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4 text-rose" />
                Tell us what you need
              </CardTitle>
              <CardDescription className="text-xs">
                Our AI will find the perfect vendors for you
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Your Vision</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you're looking for..."
                            className="min-h-[60px] resize-none text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Budget (PKR)</FormLabel>
                        <div className="space-y-1">
                          <Slider
                            min={10000}
                            max={200000}
                            step={5000}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">₹10,000</span>
                            <span className="font-medium">₹{field.value.toLocaleString()}</span>
                            <span className="text-muted-foreground">₹200,000</span>
                          </div>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Style</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {styles.map((style) => (
                                <SelectItem key={style} value={style} className="text-sm">
                                  {style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City name" className="text-sm" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-xs">Categories</FormLabel>
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          {categories.map((category) => (
                            <FormField
                              key={category}
                              control={form.control}
                              name="category"
                              render={({ field }) => {
                                return (
                                  <FormItem key={category} className="flex flex-row items-start space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, category])
                                            : field.onChange(
                                              field.value?.filter((value) => value !== category)
                                            );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-xs">{category}</FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-rose hover:bg-rose-dark text-sm py-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Finding matches...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-3 w-3" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Results */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <Loader2 className="h-12 w-12 text-rose animate-spin mb-4" />
              <p className="text-muted-foreground text-lg">
                Finding the perfect matches for you...
              </p>
            </div>
          ) : recommendations ? (
            <div className="space-y-6">
              <Card className="border-rose/20 shadow-lg">
                <CardHeader className="bg-accent/50 py-4">
                  <CardTitle className="text-lg">AI Recommendation Summary</CardTitle>
                  <CardDescription>{recommendations.summary}</CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recommended Vendors</h3>

                {recommendedVendors.length > 0 ? (
                  recommendedVendors.map((vendor) => {
                    const matchingRecommendation = recommendations.recommendations.find(
                      (rec) => rec.listingId === vendor.id
                    );
                    return renderVendorCard(vendor, matchingRecommendation);
                  })
                ) : (
                  <div className="text-center py-12 bg-accent/20 rounded-lg">
                    <p className="text-lg font-medium mb-2">No vendors found matching your criteria</p>
                    <p className="text-muted-foreground">Try adjusting your filters or budget to see more options.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-accent/20 rounded-lg flex flex-col items-center">
              <Sparkles className="h-8 w-8 text-rose/50 mb-3" />
              <h3 className="text-2xl font-semibold mb-2">Ready for personalized recommendations?</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Fill out the form with your preferences for customized vendor matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsComponent;