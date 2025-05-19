"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Dummy data for fallback
const dummyCategories = [
  { _id: "1", name: "Book Hall" },
  { _id: "2", name: "Catering" },
  { _id: "3", name: "Photographer" },
  { _id: "4", name: "Makeup Artist" },
  { _id: "5", name: "Decor" },
  { _id: "6", name: "Musician" },
  { _id: "7", name: "Mehndi Artist" }
];

interface Category {
  _id: string;
  name: string;
}

const defaultCategoryIcons: { [key: string]: string } = {
  'book hall': '/icons/hall.svg',
  'catering': '/icons/catering.svg',
  'photographer': '/icons/photographer.svg',
  'makeup artist': '/icons/makeup.svg',
  'decor': '/icons/decor.svg',
  'musician': '/icons/musician.svg',
  'mehndi artist': '/icons/mehndi.svg',
};

export const VendorCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        const data = await response.json();
        
        // If no categories found in database, use dummy data
        if (!data || data.length === 0) {
          setCategories(dummyCategories);
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to dummy data on error
        setCategories(dummyCategories);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId: string) => {
    try {
      // Fetch listings for the selected category
      await fetch(`/api/listing?categoryId=${categoryId}`);      
      // Navigate to the listings page with the results
      router.push(`/vendors?category=${categoryId}`);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  return (
    <section className="py-16 bg-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Wedding Vendors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect professionals to bring your wedding vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((category, index) => {
            const normalizedCategoryName = category.name.toLowerCase();
            const iconPath = defaultCategoryIcons[normalizedCategoryName] || '/icons/default.svg';
            
            return (
              <div 
                key={category._id}
                className="cursor-pointer"
                onClick={() => handleCategoryClick(category._id)}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in" 
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-3 bg-rose/10 rounded-full p-3">
                      <Image
                        src={iconPath}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-sm font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
