'use client'
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, Grid3X3, Store, Mail, Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="bg-gradient-to-br from-rose to-rose-dark rounded-md p-1.5 shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="font-bold text-white text-xl">A</span>
          </div>
          <span className="font-bold text-xl hidden sm:block text-foreground group-hover:text-rose-dark transition-colors duration-300">Acme Inc</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground hover:text-rose-dark transition-colors p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Grid3X3 className="mr-2 h-4 w-4" />
                <span>Categories</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-64">
                  {["Electronics", "Clothing", "Home & Garden", "Sports", "Books"].map((category) => (
                    <li key={category} className="hover:bg-accent rounded-md">
                      <Link
                        href="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/vendors">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Store className="mr-2 h-4 w-4" />
                  <span>Vendors</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Contact Us</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth buttons for desktop */}
        <div className="hidden md:flex items-center gap-2">
          {session?.user ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-accent"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User size={20} />
                <span className="hidden sm:inline">{session.user.fullName || 'Profile'}</span>
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-background rounded-md shadow-lg border animate-in fade-in-0 slide-in-from-top-5">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-accent"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" asChild className="hover:border-rose hover:text-rose">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-rose hover:bg-rose-dark">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-background border-b shadow-lg md:hidden animate-fade-in z-50">
            <nav className="container py-4 flex flex-col gap-2">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                onClick={toggleMenu}
              >
                <Home size={18} /> Home
              </Link>
              <Link 
                href="#" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                onClick={toggleMenu}
              >
                <Grid3X3 size={18} /> Categories
              </Link>
              <Link 
                href="/vendors" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                onClick={toggleMenu}
              >
                <Store size={18} /> Vendors
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                onClick={toggleMenu}
              >
                <Mail size={18} /> Contact Us
              </Link>
              <div className="border-t my-2"></div>
              
              {/* Mobile Auth Section */}
              {session?.user ? (
                <div className="px-4 py-2 space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                    onClick={toggleMenu}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                    onClick={toggleMenu}
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-red-500 hover:bg-accent"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-4 py-2">
                  <Button variant="outline" asChild className="w-1/2 hover:border-rose hover:text-rose">
                    <Link href="/login" onClick={toggleMenu}>Login</Link>
                  </Button>
                  <Button asChild className="w-1/2 bg-rose hover:bg-rose-dark">
                    <Link href="/signup" onClick={toggleMenu}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
