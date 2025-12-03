import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Home, Building2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string | null;
  property_type: string | null;
  type: string | null;
  images: string[];
  description: string | null;
  featured: boolean | null;
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, typeFilter, searchTerm]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (typeFilter !== "all") {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  const formatPrice = (price: number, type: string | null) => {
    const formatted = `₦${price.toLocaleString()}`;
    if (type === "rent") return `${formatted} / year`;
    return formatted;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-estate-luxury">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-estate-gold/30 border-t-estate-gold animate-spin mx-auto mb-4"></div>
          <p className="text-estate-gold/70 font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden bg-estate-luxury">
      {/* Luxury Mansion Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 800 600" className="w-full h-full max-w-[1200px] opacity-[0.03]">
          {/* Main Building */}
          <rect x="200" y="180" width="400" height="250" fill="none" stroke="hsl(var(--estate-gold))" strokeWidth="1.5"/>
          {/* Grand Roof */}
          <polygon points="150,180 400,50 650,180" fill="none" stroke="hsl(var(--estate-gold))" strokeWidth="1.5"/>
          {/* Roof Detail */}
          <polygon points="350,50 400,20 450,50" fill="none" stroke="hsl(var(--estate-gold)/0.6)" strokeWidth="1"/>
          {/* Grand Entrance */}
          <rect x="350" y="300" width="100" height="130" fill="none" stroke="hsl(var(--estate-gold)/0.6)" strokeWidth="1"/>
          <path d="M350 300 Q400 260 450 300" fill="none" stroke="hsl(var(--estate-gold)/0.6)" strokeWidth="1"/>
          {/* Columns */}
          <rect x="320" y="280" width="15" height="150" fill="none" stroke="hsl(var(--estate-gold)/0.4)" strokeWidth="1"/>
          <rect x="465" y="280" width="15" height="150" fill="none" stroke="hsl(var(--estate-gold)/0.4)" strokeWidth="1"/>
          {/* Windows - Left Wing */}
          <rect x="220" y="210" width="60" height="80" fill="hsl(var(--estate-gold)/0.02)" stroke="hsl(var(--estate-gold)/0.3)" strokeWidth="1"/>
          <rect x="220" y="320" width="60" height="60" fill="hsl(var(--estate-gold)/0.02)" stroke="hsl(var(--estate-gold)/0.3)" strokeWidth="1"/>
          {/* Windows - Right Wing */}
          <rect x="520" y="210" width="60" height="80" fill="hsl(var(--estate-gold)/0.02)" stroke="hsl(var(--estate-gold)/0.3)" strokeWidth="1"/>
          <rect x="520" y="320" width="60" height="60" fill="hsl(var(--estate-gold)/0.02)" stroke="hsl(var(--estate-gold)/0.3)" strokeWidth="1"/>
          {/* Balcony */}
          <line x1="300" y1="280" x2="500" y2="280" stroke="hsl(var(--estate-gold)/0.4)" strokeWidth="1"/>
          {/* Steps */}
          <line x1="320" y1="440" x2="480" y2="440" stroke="hsl(var(--estate-gold)/0.5)" strokeWidth="1"/>
          <line x1="300" y1="455" x2="500" y2="455" stroke="hsl(var(--estate-gold)/0.4)" strokeWidth="1"/>
          <line x1="280" y1="470" x2="520" y2="470" stroke="hsl(var(--estate-gold)/0.3)" strokeWidth="1"/>
          {/* Side Wings */}
          <rect x="100" y="250" width="100" height="180" fill="none" stroke="hsl(var(--estate-gold)/0.4)" strokeWidth="1"/>
          <rect x="600" y="250" width="100" height="180" fill="none" stroke="hsl(var(--estate-gold)/0.4)" strokeWidth="1"/>
        </svg>
      </div>
      
      {/* Luxury Pattern Background */}
      <div className="absolute inset-0 luxury-pattern"></div>
      
      {/* Subtle Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-estate-luxury via-transparent to-estate-luxury"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--estate-gold)/0.08)_0%,transparent_60%)]"></div>
      
      {/* Gold Glow Orbs */}
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-estate-gold/8 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-estate-warm/10 rounded-full blur-[100px]"></div>
      
      {/* Gold Edge Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-estate-gold/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-estate-warm/20 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge className="mb-6 glass border-estate-gold/30 text-estate-gold px-6 py-2 text-xs tracking-[0.2em] uppercase font-medium">
            Real Estate Division
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient-estate">
            Luxury Properties
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Discover exceptional properties in prime locations across Nigeria
          </p>
          
          {/* Architectural Accent */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-estate-gold"></div>
            <Crown className="w-5 h-5 text-estate-gold/60" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-estate-warm"></div>
          </div>
        </div>

        {/* Filters - Glassmorphic with Gold Accent */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-estate-gold/50" size={20} />
            <Input
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 glass border-estate-gold/20 focus:border-estate-gold/50 focus:ring-estate-gold/20 rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-14 glass border-estate-gold/20 focus:border-estate-gold/50 focus:ring-estate-gold/20 rounded-xl">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-estate-gold/20 rounded-xl">
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Listings */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-24">
            <Building2 className="w-16 h-16 text-estate-gold/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <Card 
                key={property.id} 
                className="overflow-hidden glass-strong hover:shadow-estate-hover transition-all duration-500 flex flex-col group border-estate-gold/10 rounded-2xl relative animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Gold Top Border on Hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-estate-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-estate-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-estate-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted/20 to-estate-luxury">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-20 h-20 text-estate-gold/20" />
                      </div>
                    )}
                    {property.featured && (
                      <Badge className="absolute top-4 right-4 bg-estate-gold/90 text-estate-luxury border-0 backdrop-blur-sm shadow-gold">
                        <Crown className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"></div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 flex-grow">
                  <Badge variant="secondary" className="mb-3 capitalize text-[10px] px-3 py-1 bg-estate-gold/10 text-estate-gold border-estate-gold/20 tracking-wider">
                    {property.type || "For Sale"}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-estate-gold transition-colors leading-tight">
                    {property.title}
                  </h3>
                  {property.location && (
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-estate-green" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  )}
                  {property.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-3 border-t border-estate-gold/10">
                      {property.description}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter className="p-6 pt-0 mt-auto">
                  <div className="w-full">
                    <p className="text-2xl font-bold mb-4 text-gradient-estate">
                      {formatPrice(property.price, property.type)}
                    </p>
                    <Button 
                      asChild 
                      className="w-full h-11 bg-gradient-to-r from-estate-gold/20 to-estate-warm/20 hover:from-estate-gold hover:to-estate-warm text-foreground hover:text-estate-luxury border border-estate-gold/30 hover:border-transparent rounded-xl font-medium transition-all duration-300"
                    >
                      <Link to="#">
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

export default PropertiesPage;