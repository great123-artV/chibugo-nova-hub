import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path: string) => {
    // Check for exact match or if it's a sub-route (e.g. /products/123 should highlight /products)
    const isActive = path === "/" 
      ? location.pathname === "/"
      : location.pathname.startsWith(path);
      
    return isActive 
      ? "text-tech-glow font-medium transition-colors drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
      : "text-foreground hover:text-primary transition-colors";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="Chibugo Logo" className="h-10 w-10 object-contain rounded-md" />
            <div>
              <div className="text-2xl font-bold text-primary">Chibugo</div>
              <div className="text-sm text-muted-foreground hidden md:block">Computers & Real Estate</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/products" className={getLinkClass("/products")}>
              Products
            </Link>
            <Link to="/properties" className={getLinkClass("/properties")}>
              Properties
            </Link>
            <Link to="/video-editor" className={getLinkClass("/video-editor")}>
              Video Editor
            </Link>
            <Link to="/about" className={getLinkClass("/about")}>
              About
            </Link>
            <Link to="/contact" className={getLinkClass("/contact")}>
              Contact
            </Link>

          </div>

          <div className="hidden md:flex items-center space-x-4">
{/* Phone number removed */}
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className={`block py-2 ${getLinkClass("/")}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`block py-2 ${getLinkClass("/products")}`}
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/properties"
              className={`block py-2 ${getLinkClass("/properties")}`}
              onClick={() => setIsOpen(false)}
            >
              Properties
            </Link>
            <Link
              to="/video-editor"
              className={`block py-2 ${getLinkClass("/video-editor")}`}
              onClick={() => setIsOpen(false)}
            >
              Video Editor
            </Link>
            <Link
              to="/about"
              className={`block py-2 ${getLinkClass("/about")}`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block py-2 ${getLinkClass("/contact")}`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-4 space-y-2">
{/* Mobile Gadgets phone number removed */}
              <div className="text-sm">
                <span className="text-muted-foreground">Real Estate: </span>
                <a href="tel:07045024855" className="text-primary">07045024855</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;