import { Camera, Utensils, Home, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const categories = [
  {
    id: "photography",
    name: "Photography",
    description: "Capture your special moments",
    icon: <Camera className="h-8 w-8 text-rose" />,
    route: "/categories/photography"
  },
  {
    id: "catering",
    name: "Catering",
    description: "Delicious dining experiences",
    icon: <Utensils className="h-8 w-8 text-rose" />,
    route: "/categories/catering"
  },
  {
    id: "venues",
    name: "Venues",
    description: "Perfect spaces for your event",
    icon: <Home className="h-8 w-8 text-rose" />,
    route: "/categories/venues"
  },
  {
    id: "decorations",
    name: "Decorations",
    description: "Beautiful wedding setups",
    icon: <MapPin className="h-8 w-8 text-rose" />,
    route: "/categories/decorations"
  }
];

export const VendorCategories = () => {
  return (
    <section className="py-16 bg-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Wedding Vendors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect professionals to bring your wedding vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              href={category.route} 
              key={category.id}
              className="block h-full"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] animate-fade-in" 
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-rose/10 rounded-full">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
