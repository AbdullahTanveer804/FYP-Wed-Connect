'use client'
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative bg-rose-light overflow-hidden">
      {/* Background decoration */} 
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gray/30 rounded-bl-full transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-rose/20 rounded-tr-full transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
              Your Perfect Wedding 
              <span className="text-rose block mt-2">Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Connect with top wedding vendors, plan your perfect day, and create memories that last a lifetime.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-rose hover:bg-rose-dark text-white">
                Find Vendors
              </Button>
              <Button size="lg" variant="outline" className="border-rose text-rose hover:bg-rose/10">
                Plan My Wedding
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-12 md:mt-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-rose rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" 
                alt="Wedding celebration" 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: "500px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
