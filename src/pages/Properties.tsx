import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Home, Building2, TreePine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import estateBackground from "@/assets/estate-background.jpg";

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
  const [loading, setLoading] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center bg-estate-cream/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-estate-gold mx-auto mb-4"></div>
          <p className="text-estate-earth">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Real Estate Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${estateBackground})` }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-estate-gold/10 via-estate-cream/5 to-estate-earth/10"></div>
      </div>

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--estate-gold))_0%,transparent_50%)] opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <Badge className="bg-estate-gold/20 text-estate-earth border-estate-gold/50 px-4 py-1 text-sm font-semibold">
              REAL ESTATE DIVISION
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-estate-earth via-estate-gold to-estate-green bg-clip-text text-transparent tracking-tight">
            Premium Properties
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover exceptional properties in prime locations
          </p>
          
          {/* Architectural Accent */}
          <div className="mt-6 flex justify-center items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-estate-gold to-estate-gold"></div>
            <div className="w-2 h-2 bg-estate-gold rotate-45"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-estate-gold to-estate-gold"></div>
          </div>
        </div>

        {/* Filters with Estate Style */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-estate-earth" size={20} />
            <Input
              placeholder="Search properties by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-estate-gold/30 focus:border-estate-gold focus:ring-estate-gold/30 bg-estate-cream/30 backdrop-blur-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px] border-estate-gold/30 focus:border-estate-gold focus:ring-estate-gold/30 bg-estate-cream/30 backdrop-blur-sm">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Listings */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Card 
                key={property.id} 
                className="overflow-hidden hover:shadow-estate-hover transition-all duration-500 flex flex-col group border-estate-gold/20 bg-card/90 backdrop-blur-sm relative"
              >
                {/* Luxury Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-estate-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-estate-cream/30 to-estate-warm/20">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-estate-warm/20">
                        <Home className="w-20 h-20 text-estate-gold/60" />
                      </div>
                    )}
                    {property.featured && (
                      <Badge className="absolute top-3 right-3 capitalize bg-estate-gold/90 text-estate-earth shadow-estate backdrop-blur-sm border-0" variant="default">
                        Featured
                      </Badge>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow bg-gradient-to-b from-estate-cream/5 to-transparent">
                  <Badge variant="secondary" className="mb-3 capitalize text-xs px-3 py-1 bg-estate-warm/20 text-estate-earth border-estate-gold/30">
                    {property.type || "For Sale"}
                  </Badge>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-estate-gold transition-colors leading-tight">
                    {property.title}
                  </h3>
                  {property.location && (
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-estate-green" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  )}
                  {property.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 pt-3 border-t border-estate-gold/10">
                      {property.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto bg-gradient-to-b from-transparent to-estate-cream/5">
                  <div className="w-full">
                    <p className="text-3xl font-bold mb-4 bg-gradient-to-r from-estate-earth to-estate-gold bg-clip-text text-transparent">
                      {formatPrice(property.price, property.type)}
                    </p>
                    <Button 
                      asChild 
                      className="w-full group-hover:shadow-estate transition-all bg-gradient-to-r from-estate-earth to-estate-gold hover:from-estate-gold hover:to-estate-earth text-white border-0"
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
