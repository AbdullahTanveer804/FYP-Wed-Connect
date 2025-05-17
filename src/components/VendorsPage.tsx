'use client'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";

// Mock data for vendor categories and locations
const CATEGORIES = [
  "All Categories",
  "Venues",
  "Photographers",
  "Caterers",
  "Florists",
  "Wedding Planners",
  "DJs & Musicians",
  "Decorators",
];

const LOCATIONS = [
  "All Locations",
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
  "Dallas",
  "Seattle",
];

// Mock data for vendors
const VENDORS = [
  {
    id: 1,
    name: "Elegant Venues",
    category: "Venues",
    location: "New York",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    price: "$$$",
    description: "Luxurious wedding venues with stunning views of the city skyline.",
  },
  {
    id: 2,
    name: "Capture Moments",
    category: "Photographers",
    location: "Los Angeles",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
    price: "$$",
    description: "Award-winning photography to capture your special day perfectly.",
  },
  {
    id: 3,
    name: "Divine Catering",
    category: "Caterers",
    location: "Chicago",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033",
    price: "$$",
    description: "Exquisite cuisine with custom menus for your wedding reception.",
  },
  {
    id: 4,
    name: "Floral Fantasy",
    category: "Florists",
    location: "Miami",
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1561128290-014957374488",
    price: "$$",
    description: "Beautiful floral arrangements to make your wedding truly special.",
  },
  {
    id: 5,
    name: "Perfect Planning",
    category: "Wedding Planners",
    location: "San Francisco",
    rating: 4.9,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    price: "$$$",
    description: "Full-service wedding planning to make your day stress-free.",
  },
  {
    id: 6,
    name: "Melodic Moments",
    category: "DJs & Musicians",
    location: "Dallas",
    rating: 4.7,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    price: "$$",
    description: "Professional DJs and live musicians for ceremony and reception.",
  },
  {
    id: 7,
    name: "Dream Decorations",
    category: "Decorators",
    location: "Seattle",
    rating: 4.8,
    reviews: 103,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    price: "$$",
    description: "Transform any venue into a magical wedding wonderland.",
  },
  {
    id: 8,
    name: "Royal Venues",
    category: "Venues",
    location: "New York",
    rating: 4.7,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    price: "$$$",
    description: "Historic and elegant venues for a romantic wedding experience.",
  },
  // Adding more vendors for pagination
  {
    id: 9,
    name: "Sparkle Photography",
    category: "Photographers",
    location: "Miami",
    rating: 4.5,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b",
    price: "$$",
    description: "Capturing love stories through a creative lens.",
  },
  {
    id: 10,
    name: "Gourmet Celebrations",
    category: "Caterers",
    location: "Chicago",
    rating: 4.6,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15",
    price: "$$$",
    description: "Unforgettable dining experiences for your wedding guests.",
  },
  {
    id: 11,
    name: "Blooming Beauty",
    category: "Florists",
    location: "Los Angeles",
    rating: 4.7,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d",
    price: "$$",
    description: "Creating floral masterpieces for your special day.",
  },
  {
    id: 12,
    name: "Wedding Wizards",
    category: "Wedding Planners",
    location: "Seattle",
    rating: 4.8,
    reviews: 104,
    image: "https://images.unsplash.com/photo-1530023367847-a683933f4172",
    price: "$$$",
    description: "Making wedding dreams come true with perfect planning.",
  },
];

const VendorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 6;

  // Filter vendors based on search term, category, and location
  const filteredVendors = VENDORS.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || vendor.category === selectedCategory;
    const matchesLocation = selectedLocation === "All Locations" || vendor.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Calculate pagination
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Find the Perfect Wedding Vendor</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Search input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search vendors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div className="md:col-span-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Location filter */}
          <div className="md:col-span-3">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Search button */}
          <div className="md:col-span-1">
            <Button className="w-full bg-rose hover:bg-rose-dark">
              <Search size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <p className="text-gray-600 mb-6">
        {filteredVendors.length} vendors found
        {selectedCategory !== "All Categories" && ` in ${selectedCategory}`}
        {selectedLocation !== "All Locations" && ` from ${selectedLocation}`}
      </p>
      
      {/* Vendors Grid */}
      {currentVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {currentVendors.map((vendor) => (
            <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <div className="h-48 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{vendor.name}</CardTitle>
                  <span className="bg-rose/10 text-rose px-2 py-1 rounded text-sm font-medium">
                    {vendor.price}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{vendor.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(vendor.rating) ? 'text-amber-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {vendor.rating} ({vendor.reviews} reviews)
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{vendor.description}</p>
                <div className="mt-3">
                  <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
                    {vendor.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button 
                  className="w-full bg-rose hover:bg-rose-dark"
                  asChild
                >
                  <Link href={`/vendors/${vendor.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No vendors found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mb-8">
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default VendorsPage;