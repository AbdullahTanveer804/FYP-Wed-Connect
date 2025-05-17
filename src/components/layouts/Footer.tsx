'use client'
import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-background border-t border-border">
      {/* Top section with scroll to top button */}
      <div className="container flex justify-center py-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full animate-fade-in hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main footer content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Company</h3>
            <p className="text-muted-foreground text-sm">
              We provide innovative solutions for all your needs. Our team is dedicated to delivering excellence.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Quick Links</h3>
            <ul className="space-y-2">
              <li className="animate-slide-in" style={{ animationDelay: "100ms" }}>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link>
              </li>
              <li className="animate-slide-in" style={{ animationDelay: "150ms" }}>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors text-sm">Categories</Link>
              </li>
              <li className="animate-slide-in" style={{ animationDelay: "200ms" }}>
                <Link href="/vendors" className="text-muted-foreground hover:text-primary transition-colors text-sm">Vendors</Link>
              </li>
              <li className="animate-slide-in" style={{ animationDelay: "250ms" }}>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Support</h3>
            <ul className="space-y-2">
              <li className="animate-slide-in" style={{ animationDelay: "300ms" }}>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link>
              </li>
              <li className="animate-slide-in" style={{ animationDelay: "350ms" }}>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link>
              </li>
              <li className="animate-slide-in" style={{ animationDelay: "400ms" }}>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link>
              </li>
              <li className="animate-slide-in" style={{ animationDelay: "450ms" }}>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Newsletter</h3>
            <p className="text-muted-foreground text-sm">Subscribe to our newsletter for updates</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 rounded-l-md border border-border bg-background focus:ring-rose"
              />
              <Button className="rounded-l-none bg-rose hover:bg-rose-dark">
                <Mail className="h-4 w-4 mr-1" />
                <span>Join</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright bar */}
      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="flex items-center">
            <span className="mr-1">©</span> {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link href="/privacy" className="mr-4 hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
