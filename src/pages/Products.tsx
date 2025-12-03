import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Laptop, Smartphone, Search, Cpu, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SocialRibbon from "@/components/SocialRibbon";

interface Product {
  id: string;
  name: string;
  type: string;
  brand: string;
  price: number;
  images: string[];
  stock: number;
  specs: any;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, typeFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (typeFilter !== "all") {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tech-dark">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-tech-glow/30 border-t-tech-glow animate-spin mx-auto mb-4"></div>
          <p className="text-tech-glow/70 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden bg-tech-dark">
      {/* Futuristic Laptop Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 800 600" className="w-full h-full max-w-[1200px] opacity-[0.04]">
          {/* Large Laptop Screen */}
          <rect x="150" y="50" width="500" height="320" rx="12" fill="none" stroke="hsl(var(--tech-glow))" strokeWidth="2"/>
          <rect x="165" y="65" width="470" height="290" rx="6" fill="hsl(var(--tech-glow)/0.02)" stroke="hsl(var(--tech-glow)/0.3)" strokeWidth="1"/>
          {/* Screen Content Lines */}
          <line x1="185" y1="100" x2="615" y2="100" stroke="hsl(var(--tech-glow)/0.2)" strokeWidth="1"/>
          <line x1="185" y1="140" x2="500" y2="140" stroke="hsl(var(--tech-glow)/0.15)" strokeWidth="1"/>
          <line x1="185" y1="180" x2="550" y2="180" stroke="hsl(var(--tech-glow)/0.1)" strokeWidth="1"/>
          <line x1="185" y1="220" x2="480" y2="220" stroke="hsl(var(--tech-glow)/0.1)" strokeWidth="1"/>
          <line x1="185" y1="260" x2="520" y2="260" stroke="hsl(var(--tech-glow)/0.08)" strokeWidth="1"/>
          {/* Laptop Base */}
          <path d="M100 370 L150 370 L150 400 L650 400 L650 370 L700 370 L730 450 L70 450 Z" fill="none" stroke="hsl(var(--tech-glow))" strokeWidth="2"/>
          {/* Trackpad */}
          <rect x="340" y="410" width="120" height="25" rx="4" fill="none" stroke="hsl(var(--tech-glow)/0.4)" strokeWidth="1"/>
          {/* Keyboard Lines */}
          <line x1="180" y1="380" x2="620" y2="380" stroke="hsl(var(--tech-glow)/0.2)" strokeWidth="0.5"/>
          <line x1="180" y1="390" x2="620" y2="390" stroke="hsl(var(--tech-glow)/0.2)" strokeWidth="0.5"/>
        </svg>
      </div>
      
      {/* Futuristic Grid */}
      <div className="absolute inset-0 futuristic-grid opacity-30"></div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-tech-dark via-transparent to-tech-dark"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-tech-glow/5 via-transparent to-tech-accent/5"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-tech-glow/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-tech-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Neon Edge Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-glow/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-accent/30 to-transparent"></div>

      {/* Social Ribbon */}
      <SocialRibbon variant="tech" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge className="mb-6 glass border-tech-glow/30 text-tech-glow px-6 py-2 text-xs tracking-[0.2em] uppercase font-medium">
            Tech Division
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient-tech">
            Premium Gadgets
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Cutting-edge technology meets exceptional value
          </p>
          
          {/* Tech Accent Lines */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-tech-glow"></div>
            <Cpu className="w-5 h-5 text-tech-glow/60" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-tech-accent"></div>
          </div>
        </div>

        {/* Filters - Glassmorphic */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tech-glow/50" size={20} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 glass border-tech-border/30 focus:border-tech-glow/50 focus:ring-tech-glow/20 rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-14 glass border-tech-border/30 focus:border-tech-glow/50 focus:ring-tech-glow/20 rounded-xl">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-tech-border/30 rounded-xl">
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="laptop">Laptops</SelectItem>
              <SelectItem value="phone">Phones</SelectItem>
              <SelectItem value="accessory">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <Monitor className="w-16 h-16 text-tech-glow/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden glass-strong hover:shadow-tech transition-all duration-500 flex flex-col group border-tech-border/20 rounded-2xl relative animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Neon Corner Accents */}
                <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-tech-glow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-tech-glow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-tech-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 right-0 w-px h-12 bg-gradient-to-t from-tech-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardHeader className="p-0 relative">
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-tech-dark/50 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {product.type === "laptop" ? (
                          <Laptop className="w-20 h-20 text-tech-glow/30" />
                        ) : (
                          <Smartphone className="w-20 h-20 text-tech-accent/30" />
                        )}
                      </div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-sm border-0 text-xs" variant="destructive">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge className="absolute top-3 right-3 bg-muted/90 backdrop-blur-sm border-0 text-xs" variant="outline">
                        Out of Stock
                      </Badge>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"></div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 flex-grow relative">
                  <Badge variant="secondary" className="mb-3 capitalize text-[10px] px-3 py-1 bg-tech-glow/10 text-tech-glow border-tech-glow/20 tracking-wider">
                    {product.type}
                  </Badge>
                  {product.brand && (
                    <p className="text-xs text-tech-accent mb-2 font-bold uppercase tracking-[0.15em]">{product.brand}</p>
                  )}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-tech-glow transition-colors">
                    {product.name}
                  </h3>
                </CardContent>
                
                <CardFooter className="p-5 pt-0 mt-auto relative">
                  <div className="w-full">
                    <p className="text-2xl font-bold mb-4 text-gradient-tech">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <Button 
                      asChild 
                      className="w-full h-11 bg-gradient-to-r from-tech-glow/20 to-tech-accent/20 hover:from-tech-glow hover:to-tech-accent text-foreground hover:text-tech-dark border border-tech-glow/30 hover:border-transparent rounded-xl font-medium transition-all duration-300"
                    >
                      <Link to={`/product/${product.id}`}>
                        View Details
                        <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;