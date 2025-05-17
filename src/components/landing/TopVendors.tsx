'use client'
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

// Mock data - in a real app this would come from an API
const cities = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"];

const vendors = [
  {
    id: 1,
    name: "Elegant Moments Photography",
    category: "Photography",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    location: "New York"
  },
  {
    id: 2,
    name: "Divine Cuisine Catering",
    category: "Catering",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    location: "New York"
  },
  {
    id: 3,
    name: "Rosewood Manor",
    category: "Venue",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    location: "New York"
  }
];

export const TopVendors = () => {
  const [selectedCity, setSelectedCity] = useState("New York");
  
  // In a real implementation, this would filter vendors based on the selected city
  const filteredVendors = vendors.filter(vendor => vendor.location === selectedCity);
  
  return (
    <section className="py-16 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Vendors Near You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover highly-rated wedding professionals in your area
          </p>
        </div>
        
        {/* City selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {cities.map(city => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              className={`mb-2 ${selectedCity === city ? 'bg-rose hover:bg-rose-dark' : 'border-rose text-rose hover:bg-rose/10'}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </Button>
          ))}
        </div>
        
        {/* Vendor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor, index) => (
            <Card key={vendor.id} className="overflow-hidden h-full border-none shadow-lg animate-fade-in" 
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={vendor.image} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                />
                <div className="absolute top-2 right-2 bg-rose text-white text-sm font-semibold px-2 py-1 rounded">
                  {vendor.category}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{vendor.name}</h3>
                  <div className="flex items-center bg-rose/10 text-rose font-medium text-sm px-2 py-1 rounded">
                    ★ {vendor.rating} <span className="text-gray-600 ml-1">({vendor.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{vendor.location}</span>
                </div>
                <Button className="w-full bg-rose hover:bg-rose-dark">View Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button variant="outline" className="border-rose text-rose hover:bg-rose/10">
            View All Vendors in {selectedCity}
          </Button>
        </div>
      </div>
    </section>
  );
};
