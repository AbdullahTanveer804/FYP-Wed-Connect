'use client'
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah & James",
    date: "June 2024",
    content: "WedConnect made planning our wedding so much easier! We found our dream photographer and venue through the platform, and their AI recommendation feature saved us so much time.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    id: 2,
    name: "Emily & Michael",
    date: "March 2024",
    content: "The vendors we found through WedConnect were absolutely amazing. Everything from the catering to the flowers exceeded our expectations. We couldn't be happier!",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    id: 3,
    name: "Jennifer & David",
    date: "May 2024",
    content: "What stood out to us was how easy it was to compare vendors and read verified reviews. WedConnect helped us stay within our budget while still having the wedding of our dreams.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Love Stories from Happy Couples</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from couples who planned their perfect wedding with WedConnect
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="h-full border-none shadow-lg animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4 text-rose">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="text-gray-600 mb-6 flex-grow">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
