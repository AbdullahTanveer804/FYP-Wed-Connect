'use client';
import { useState, useEffect } from "react";
import {
    Calendar,
    MapPin,
    Phone,
    Mail,
    Share,
    ExternalLink,
    Clock,
    User,
    Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import VENDOR_DATA from "@/vendor.json"; // Renamed to avoid confusion with the component name

interface Vendor {
    id: number;
    name: string;
    category: string;
    subCategory: string;
    location: string;
    rating: number;
    reviews: number;
    images: string[];
    price: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    expertise: string;
    staff: string;
    equipment: {
        soundSystem: boolean;
        projector: boolean;
        mic: boolean;
    };
    packages: {
        name: string;
        price: string;
        description: string;
        isPopular: boolean;
    }[];
    availability: {
        date: string;
        available: boolean;
    }[];
    mapLocation: {
        lat: string;
        lng: string;
        address: string;
    };
}

interface VendorData {
    VENDOR: Vendor[];
}

const VendorDetail = () => {
    const { id } = useParams<{ id: string }>();
    const vendorId = parseInt(id);
    const [vendor, setVendor] = useState<Vendor | undefined>(undefined);
    const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
    const [eventDate, setEventDate] = useState<string>("");

    // Contact vendor form
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        message: "",
        eventDate: ""
    });

    useEffect(() => {
        const foundVendor = (VENDOR_DATA as VendorData).VENDOR.find((v) => v.id === vendorId);
        setVendor(foundVendor);
        if (foundVendor && foundVendor.packages.length > 0) {
            setSelectedPackage(foundVendor.packages[0].name); // Set initial selected package
        }
    }, [vendorId]);

    // For image gallery
    const [activeImage, setActiveImage] = useState<string | undefined>(vendor?.images[0]);
    useEffect(() => {
        if (vendor?.images && vendor.images.length > 0) {
            setActiveImage(vendor.images[0]);
        }
    }, [vendor?.images]);


    if (!vendor) {
        return <div className="container mx-auto px-4 py-8 max-w-7xl">Loading vendor details...</div>;
    }

    const handleShareClick = () => {
        // In a real app, this would copy a sharing link to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link copied!",
            description: "Vendor link has been copied to clipboard",
        });
    };

    const handlePackageSelect = (packageName: string) => {
        setSelectedPackage(packageName);
        toast({
            title: "Package selected",
            description: `You selected the ${packageName} package`,
        });
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message sent!",
            description: "We've received your message and will contact you soon",
        });
    };

    const selectedPackageData = vendor.packages.find((pkg) => pkg.name === selectedPackage);
    const defaultPrice = vendor.price; // Assuming a general price if no package is selected

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm mb-6 text-gray-600">
                <Link href="/" className="hover:text-rose">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/vendors" className="hover:text-rose">Vendors</Link>
                <span className="mx-2">/</span>
                <span className="text-rose font-medium">{vendor.name}</span>
            </div>

            {/* Vendor Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">{vendor.name}</h1>
                    <div className="flex items-center mt-2 text-gray-600">
                        <MapPin size={16} className="mr-1" />
                        <span>{vendor.location}</span>
                    </div>
                    <div className="flex items-center mt-1">
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
                    <div className="mt-2">
                        <span className="inline-block bg-rose/10 text-rose rounded-full px-3 py-1 text-sm font-semibold mr-2">
                            {vendor.category}
                        </span>
                        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                            {vendor.subCategory}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" size="sm" onClick={handleShareClick}>
                        <Share size={16} className="mr-1" />
                        Share
                    </Button>
                    {vendor.website && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} className="mr-1" />
                                Visit Website
                            </a>
                        </Button>
                    )}
                    <Button size="sm" className="bg-rose hover:bg-rose-dark">
                        Contact Vendor
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images and Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Image and Gallery */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                        <div className="aspect-w-16 aspect-h-9 relative">
                            <img
                                src={activeImage || vendor.images[0]}
                                alt={vendor.name}
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {vendor.images.map((image, index) => (
                                        <CarouselItem key={index} className="basis-1/4 pl-0">
                                            <div
                                                className={`h-20 w-full cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === image ? 'border-rose' : 'border-transparent'}`}
                                                onClick={() => setActiveImage(image)}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Gallery image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </div>

                    {/* Tabs for Description, Reviews, etc. */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="w-full justify-start bg-gray-50 border-b p-0">
                                <TabsTrigger value="description" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:shadow-none">Description</TabsTrigger>
                                <TabsTrigger value="features" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:shadow-none">Features</TabsTrigger>
                                <TabsTrigger value="reviews" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:shadow-none">Reviews</TabsTrigger>
                                <TabsTrigger value="location" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:shadow-none">Location</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="p-6 animate-fade-in">
                                <h3 className="text-xl font-semibold mb-4">Vendor Description</h3>
                                <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
                            </TabsContent>

                            <TabsContent value="features" className="p-6 animate-fade-in">
                                <h3 className="text-xl font-semibold mb-4">Features & Equipment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <h4 className="font-semibold mb-3">Expertise</h4>
                                            <p className="text-gray-700">{vendor.expertise}</p>

                                            <h4 className="font-semibold mt-4 mb-3">Staff</h4>
                                            <div className="flex items-center">
                                                <User size={16} className="mr-2 text-gray-500" />
                                                <span>{vendor.staff}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <h4 className="font-semibold mb-3">Equipment</h4>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Sound System</TableCell>
                                                        <TableCell className={vendor.equipment.soundSystem ? 'text-green-600' : 'text-red-600'}>
                                                            {vendor.equipment.soundSystem ? 'Yes' : 'No'}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Projector</TableCell>
                                                        <TableCell className={vendor.equipment.projector ? 'text-green-600' : 'text-red-600'}>
                                                            {vendor.equipment.projector ? 'Yes' : 'No'}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Microphone</TableCell>
                                                        <TableCell className={vendor.equipment.mic ? 'text-green-600' : 'text-red-600'}>
                                                            {vendor.equipment.mic ? 'Yes' : 'No'}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="p-6 animate-fade-in">
                                <h3 className="text-xl font-semibold mb-4">Client Reviews</h3>
                                <div className="text-center py-8">
                                    <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 mb-4">No reviews available yet</p>
                                    <Button className="bg-rose hover:bg-rose-dark">Write a Review</Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="location" className="p-6 animate-fade-in">
                                <h3 className="text-xl font-semibold mb-4">Vendor Location</h3>
                                <div className="bg-gray-100 p-4 mb-4 rounded">
                                    <p className="text-gray-700 mb-1"><span className="font-medium">Address:</span> {vendor.mapLocation.address}</p>
                                    <p className="text-gray-700 mb-1"><span className="font-medium">Coordinates:</span> {vendor.mapLocation.lat}, {vendor.mapLocation.lng}</p>
                                </div>
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
                                    {/* In a real app, this would be a Google Map or similar */}
                                    <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 rounded-lg">
                                        <MapPin className="w-8 h-8 text-rose" />
                                        <span className="ml-2 text-gray-600">Map View</span>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Right Column: Pricing, Booking, Contact */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <Card className="overflow-hidden animate-fade-in">
                        <div className="bg-rose text-white p-4">
                            <h3 className="text-xl font-semibold">Pricing</h3>
                            <p className="text-sm opacity-90">Select your preferred package</p>
                        </div>
                        <CardContent className="p-4">
                            {vendor.packages.map((pkg, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePackageSelect(pkg.name)}
                                    className={`flex items-center justify-between p-3 my-2 rounded-lg cursor-pointer transition-colors ${
                                        selectedPackage === pkg.name ? 'bg-rose/10 border border-rose/30' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                    }`}
                                >
                                    <div>
                                        <h4 className="font-medium">{pkg.name}</h4>
                                        <p className="text-xs text-gray-500">{pkg.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-rose font-semibold">{pkg.price}</div>
                                        <div className="text-xs text-gray-500">Per Event</div>
                                    </div>
                                </div>
                            ))}

                            <Separator className="my-4" />

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500">Standard Price:</span>
                                    <span className="font-semibold">{defaultPrice}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500">Discount:</span>
                                    <span>0%</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Final Price:</span>
                                    <span className="text-rose">{selectedPackageData?.price || defaultPrice}</span>
                                </div>
                            </div>

                            <Button className="w-full mt-4 bg-rose hover:bg-rose-dark">
                                Book Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Date Selection */}
                    <Card className="animate-fade-in">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <Calendar size={18} className="mr-2" />
                                Check Availability
                            </h3>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {eventDate ? eventDate : <span>Choose Your Event Date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            {vendor.availability.map((date, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-2 rounded-md flex justify-between items-center cursor-pointer ${
                                                        date.available ? 'hover:bg-rose/10' : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                                    onClick={() => date.available && setEventDate(date.date)}
                                                >
                                                    <span className="flex items-center">
                                                        <Calendar size={14} className="mr-2" />
                                                        {date.date}
                                                    </span>
                                                    <span className={date.available ? 'text-green-600' : 'text-red-600'}>
                                                        {date.available ? 'Available' : 'Booked'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="animate-fade-in">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-3 text-rose" />
                                    <span>{vendor.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail size={16} className="mr-3 text-rose" />
                                    <span>{vendor.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-3 text-rose" />
                                    <span>{vendor.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-3 text-rose" />
                                    <span>Available 9:00 AM - 9:00 PM</span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <h4 className="font-medium">Send a Message</h4>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full p-2 border rounded-md"
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full p-2 border rounded-md"
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Your Message"
                                        className="w-full p-2 border rounded-md"
                                        rows={3}
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                        required
                                    ></textarea>
                                </div>

                                <Button type="submit" className="w-full bg-rose hover:bg-rose-dark">
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Related Vendors */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Similar Vendors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
                            <div className="h-40 overflow-hidden">
                                <img
                                    src={`https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop&q=80`}
                                    alt="Related vendor"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold">DJ Master Events</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <MapPin size={14} className="mr-1" />
                                    <span>Islamabad</span>
                                </div>
                                <div className="mt-1 text-sm">
                                    <span className="text-rose font-medium">PKR 45,000</span>
                                    <span className="text-gray-500"> / event</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VendorDetail;