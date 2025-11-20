import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Car, ArrowRight } from "lucide-react";
import heroRealEstate from "@/assets/hero-realestate.jpg";

// Mock Data for Properties
const properties = [
  {
    id: "prop1",
    title: "Luxury Villa in Lekki Phase 1",
    price: "₦350,000,000",
    location: "Lekki, Lagos",
    bedrooms: 5,
    bathrooms: 5,
    parking: 3,
    type: "sale",
    imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Available"
  },
  {
    id: "prop2",
    title: "Modern 2-Bedroom Apartment",
    price: "₦5,000,000 / year",
    location: "Ikeja GRA, Lagos",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    type: "rent",
    imageUrl: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "New"
  },
  {
    id: "prop3",
    title: "Spacious Office Space",
    price: "₦15,000,000 / year",
    location: "Victoria Island, Lagos",
    bedrooms: 0,
    bathrooms: 2,
    parking: 5,
    type: "commercial",
    imageUrl: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Available"
  },
  {
    id: "prop4",
    title: "Cozy Family Duplex",
    price: "₦180,000,000",
    location: "Surulere, Lagos",
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    type: "sale",
    imageUrl: "https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Hot Deal"
  },
  // Add more properties as needed
];

const PropertiesPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with Image */}
        <div 
          className="relative h-[300px] rounded-xl mb-12 overflow-hidden"
          style={{
            backgroundImage: `url(${heroRealEstate})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end">
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-2">Real Estate</h1>
              <p className="text-muted-foreground text-lg">
                Quality properties for rent and sale in prime locations
              </p>
            </div>
          </div>
        </div>

        {/* Property Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <CardHeader className="p-0 relative">
                <div className="aspect-w-16 aspect-h-9" style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="object-cover w-full h-full"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                </div>
                <Badge
                  className="absolute top-3 right-3 capitalize"
                  variant={property.status === "Hot Deal" ? "destructive" : "default"}
                >
                  {property.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <Badge variant="secondary" className="mb-2 capitalize">{property.type}</Badge>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{property.title}</h3>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  {property.type !== 'commercial' && (
                    <div className="flex items-center gap-4">
                      <span className="flex items-center"><Bed className="w-4 h-4 mr-1" /> {property.bedrooms}</span>
                      <span className="flex items-center"><Bath className="w-4 h-4 mr-1" /> {property.bathrooms}</span>
                      <span className="flex items-center"><Car className="w-4 h-4 mr-1" /> {property.parking}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                 <div className="w-full">
                    <p className="text-2xl font-bold text-primary mb-4">{property.price}</p>
                    <Button asChild className="w-full">
                      <Link to="#">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
