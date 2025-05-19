"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Home,
  Grid3X3,
  Store,
  Mail,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  UserPlus,
  Sparkles,
  Star,
} from "lucide-react";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

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
        <Link
          href="/"
          className="flex items-center gap-2 group transition-all duration-300"
        >
          <div className="rounded-md p-0.5">
            <img
              src="/noBgLogo.png"
              alt="Logo"
              className="h-6  object-contain"
            />
          </div>
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
            {pathname !== "/" && (
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink
                    className={
                      navigationMenuTriggerStyle() +
                      (pathname === "/"
                        ? " bg-accent text-accent-foreground"
                        : "")
                    }
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link href="/vendors">
                <NavigationMenuLink
                  className={
                    navigationMenuTriggerStyle() +
                    (pathname.startsWith("/vendors")
                      ? " bg-accent text-accent-foreground"
                      : "")
                  }
                >
                  <Store className="mr-2 h-4 w-4" />
                  <span>Vendors</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/customer/vendors/recommendations">
                <NavigationMenuLink
                  className={
                    navigationMenuTriggerStyle() +
                    (pathname.startsWith("/customer/vendors/recommendations")
                      ? " bg-accent text-accent-foreground"
                      : "")
                  }
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>AI Tools</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact">
                <NavigationMenuLink
                  className={
                    navigationMenuTriggerStyle() +
                    (pathname.startsWith("/contact")
                      ? " bg-accent text-accent-foreground"
                      : "")
                  }
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Contact Us</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth buttons for desktop */}
        <div className="hidden md:flex items-center gap-2">
          {console.log("session", session?.user.role)}
          {session?.user && session.user.role?.toUpperCase() !== "VENDOR" && (
            <Button
              variant="outline"
              asChild
              className="border-rose text-rose hover:bg-rose/10"
            >
              <Link href="/signup/vendor">
                <UserPlus className="mr-2 h-4 w-4" />
                Join us
              </Link>
            </Button>
          )}
          {session?.user ? (
            <div className="relative">
              {" "}
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-accent px-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-accent w-8 h-8 flex items-center justify-center overflow-hidden">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline-block">
                    {session?.user?.name?.split(" ")[0] || "Profile"}
                  </span>
                </div>
              </Button>
              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-1/2 translate-x-1/2 mt-2 w-40 py-2 bg-background rounded-md shadow-lg border animate-in fade-in-0 slide-in-from-top-5 flex flex-col items-center">
                  {" "}
                  <Link
                    href={`/${session?.user?.role?.toLowerCase()}-dashboard`}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent w-full justify-center"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-accent justify-center"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                className="hover:border-rose hover:text-rose"
              >
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
              {/* Mobile Auth Section */}
              {session?.user ? (
          <div className="px-4 py-2 space-y-2">
            {/* Profile Info */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "Profile"}
              className="w-full h-full object-cover"
            />
                ) : (
            <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <span className="text-base font-medium">
                {session?.user?.name?.split(" ")[0] || "Profile"}
              </span>
            </div>
            <Link
              href={`/${session?.user?.role?.toLowerCase()}-dashboard`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent ${
                pathname === `/${session?.user?.role?.toLowerCase()}-dashboard`
            ? "bg-accent text-accent-foreground"
            : ""
              }`}
              onClick={toggleMenu}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Button
              variant="outline"
              asChild
              className="border-rose text-rose hover:bg-rose/10"
            >
              {session?.user.role?.toUpperCase() !== "VENDOR" && (
                <Link
            href="/signup/vendor"
            onClick={toggleMenu}
            className={
              pathname === "/signup/vendor"
                ? "bg-accent text-accent-foreground"
                : ""
            }
                >
            <UserPlus className="mr-2 h-4 w-4" />
            Join us
                </Link>
              )}
            </Button>
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
            <Button
              variant="outline"
              asChild
              className={`w-1/2 hover:border-rose hover:text-rose ${
                pathname === "/login"
            ? "bg-accent text-accent-foreground"
            : ""
              }`}
            >
              <Link href="/login" onClick={toggleMenu}>
                Login
              </Link>
            </Button>
            <Button
              variant="default"
              asChild
              className={`w-1/2 hover:bg-rose-dark `}
            >
              <Link href="/signup" onClick={toggleMenu}>
                Sign up
              </Link>
            </Button>
          </div>
              )}
              <div className="border-t my-2"></div>
            <div>{pathname !== "/" && (
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent ${
            pathname === "/" ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={toggleMenu}
              >
                <Home size={18} /> Home
              </Link>
            )}
            <Link
              href="/vendors"
              className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent ${
                pathname.startsWith("/vendors")
            ? "bg-accent text-accent-foreground"
            : ""
              }`}
              onClick={toggleMenu}
            >
              <Store size={18} /> Vendors
            </Link>
            <Link
              href="/customer/vendors/recommendations"
              className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent ${
                pathname.startsWith("/customer/vendors/recommendations")
            ? "bg-accent text-accent-foreground"
            : ""
              }`}
              onClick={toggleMenu}
            >
              <Sparkles size={18} /> AI Tools
            </Link>
            <Link
              href="/contact"
              className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent ${
                pathname.startsWith("/contact")
            ? "bg-accent text-accent-foreground"
            : ""
              }`}
              onClick={toggleMenu}
            >
              <Mail size={18} /> Contact Us
            </Link></div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
