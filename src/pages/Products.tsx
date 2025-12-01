import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Laptop, Smartphone, Search, Cpu, CircuitBoard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import techBackground from "@/assets/tech-background.jpg";

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
  const [loading, setLoading] = useState(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-glow mx-auto mb-4"></div>
          <p className="text-tech-accent">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Tech Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${techBackground})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-tech-glow/10 via-transparent to-tech-accent/10"></div>
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--tech-border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--tech-border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <Badge className="bg-tech-glow/20 text-tech-glow border-tech-glow/50 px-4 py-1 text-sm font-semibold">
              TECH DIVISION
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-tech-glow to-tech-accent bg-clip-text text-transparent tracking-tight">
            Premium Tech Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cutting-edge technology meets exceptional value
          </p>
          
          {/* Tech Accent Line */}
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-tech-glow to-transparent"></div>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-tech-accent to-transparent"></div>
          </div>
        </div>

        {/* Filters with Tech Style */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tech-accent" size={20} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-tech-border/30 focus:border-tech-glow focus:ring-tech-glow/30 bg-background/50 backdrop-blur-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px] border-tech-border/30 focus:border-tech-glow focus:ring-tech-glow/30 bg-background/50 backdrop-blur-sm">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="laptop">Laptops</SelectItem>
              <SelectItem value="phone">Phones</SelectItem>
              <SelectItem value="accessory">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-tech transition-all duration-300 flex flex-col group border-tech-border/20 bg-card/80 backdrop-blur-sm relative"
              >
                {/* Tech Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-tech-glow/0 via-tech-glow/0 to-tech-accent/0 group-hover:from-tech-glow/5 group-hover:to-tech-accent/5 transition-all duration-500 pointer-events-none"></div>
                
                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-tech-glow/0 group-hover:border-tech-glow/50 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-tech-accent/0 group-hover:border-tech-accent/50 transition-all duration-300"></div>

                <CardHeader className="p-0 relative">
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-tech-dark/20 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 bg-white/5"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-tech-dark/30">
                        {product.type === "laptop" ? (
                          <Laptop className="w-20 h-20 text-tech-glow/60" />
                        ) : (
                          <Smartphone className="w-20 h-20 text-tech-accent/60" />
                        )}
                      </div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge className="absolute top-3 right-3 shadow-tech-sm bg-destructive/90 backdrop-blur-sm" variant="destructive">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge className="absolute top-3 right-3 shadow-tech-sm bg-muted/90 backdrop-blur-sm" variant="outline">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow border-t border-tech-border/10 relative">
                  <Badge variant="secondary" className="mb-3 capitalize text-xs px-3 py-1 bg-tech-glow/10 text-tech-glow border-tech-glow/30">
                    {product.type}
                  </Badge>
                  {product.brand && (
                    <p className="text-sm text-tech-accent mb-2 font-bold uppercase tracking-widest">{product.brand}</p>
                  )}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-tech-glow transition-colors">
                    {product.name}
                  </h3>
                </CardContent>
                <CardFooter className="p-5 pt-0 mt-auto relative">
                  <div className="w-full">
                    <p className="text-3xl font-bold mb-4 bg-gradient-to-r from-tech-glow to-tech-accent bg-clip-text text-transparent">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <Button 
                      asChild 
                      className="w-full group-hover:shadow-tech-sm transition-all bg-gradient-to-r from-tech-dark to-tech-border hover:from-tech-glow hover:to-tech-accent"
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
