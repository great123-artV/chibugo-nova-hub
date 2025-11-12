import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Construction } from "lucide-react";
import heroRealEstate from "@/assets/hero-realestate.jpg";

const PropertiesPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with Image */}
        <div 
          className="relative h-[300px] rounded-xl mb-8 overflow-hidden"
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

        {/* Coming Soon Section */}
        <Card className="max-w-3xl mx-auto shadow-medium">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-6">
              <Construction className="w-24 h-24 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Phase 2: Coming Soon</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We're expanding our services to include comprehensive real estate solutions. 
                Our property listings will feature residential and commercial properties for rent and sale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4">
                <Home className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Residential</h3>
                <p className="text-sm text-muted-foreground">
                  Houses, apartments, and land
                </p>
              </div>
              <div className="p-4">
                <Home className="w-12 h-12 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Commercial</h3>
                <p className="text-sm text-muted-foreground">
                  Office spaces and shops
                </p>
              </div>
              <div className="p-4">
                <Home className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Investment</h3>
                <p className="text-sm text-muted-foreground">
                  Prime investment properties
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Interested in real estate? Contact us to discuss your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Contact Real Estate Team</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="tel:07045024855">Call: 07045024855</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertiesPage;