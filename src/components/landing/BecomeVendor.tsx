"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const BecomeVendor = () => {
  const { data: session } = useSession();

  const handleJoinClick = (e: React.MouseEvent) => {
    if (session?.user?.role === "VENDOR") {
      e.preventDefault();
      toast({
        title: "Already a Vendor",
        description: "You are already registered as a vendor.",
        variant: "destructive",
      });
    }
  };
  return (
    <section className="relative py-16 bg-rose-light overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gray/30 rounded-bl-full transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-rose/20 rounded-tr-full transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 lg:p-12 animate-fade-in">
              <div className="inline-flex items-center justify-center p-2 bg-rose/20 rounded-full mb-6">
                <UserPlus className="h-8 w-8 text-rose" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Join WedConnect as a Vendor
              </h2>
              <p className="text-gray-600 mb-6">
                Reach more couples, grow your business, and be part of the most
                trusted wedding vendor network.
              </p>
              <ul className="mb-8">
                {[
                  "Showcase your services to thousands of couples",
                  "Receive qualified leads directly to your inbox",
                  "Manage bookings and client communication all in one place",
                  "Get featured in our vendor spotlight",
                ].map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start mb-3 animate-slide-in"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="mr-2 mt-1 bg-rose/20 text-rose rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="bg-rose hover:bg-rose-dark text-white px-6"
                asChild
              >
                <Link
                  href={session?.user ? "/signup/vendor" : "/login"}
                  onClick={handleJoinClick}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Join us
                </Link>
              </Button>
            </div>
            <div
              className="lg:w-1/2 relative overflow-hidden animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose/20 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray/30 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                alt="Wedding planner working"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
