import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Bed, Bath, Car, ArrowRight, Search, Home } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with Image */}
        <div 
          className="relative h-[400px] rounded-2xl mb-12 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent flex items-end">
            <div className="p-8 w-full">
              <h1 className="text-5xl font-bold mb-3">Premium Real Estate</h1>
              <p className="text-muted-foreground text-xl mb-6">
                Quality properties for rent and sale in prime locations
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search properties by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
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
              <Card key={property.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group border-border/50">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                        <Home className="w-20 h-20 text-muted-foreground/60" />
                      </div>
                    )}
                    {property.featured && (
                      <Badge className="absolute top-3 right-3 capitalize bg-primary shadow-lg" variant="default">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow">
                  <Badge variant="secondary" className="mb-3 capitalize text-xs px-3 py-1">
                    {property.type || "For Sale"}
                  </Badge>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  {property.location && (
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  )}
                  {property.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 border-t pt-3">
                      {property.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-5 pt-0 mt-auto">
                  <div className="w-full">
                    <p className="text-3xl font-bold text-primary mb-4">
                      {formatPrice(property.price, property.type)}
                    </p>
                    <Button asChild className="w-full group-hover:shadow-lg transition-shadow">
                      <Link to="#">
                        View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
