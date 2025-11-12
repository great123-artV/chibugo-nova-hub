import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Smartphone, Home, CheckCircle, TrendingUp, Shield } from "lucide-react";
import heroTech from "@/assets/hero-tech.jpg";
import heroRealEstate from "@/assets/hero-realestate.jpg";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: `url(${heroTech})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Premium Tech &{" "}
              <span className="text-primary">Real Estate</span> Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Discover quality laptops, smartphones, and properties at Chibugo Computers and Real Estate. Your trusted partner in Onitsha.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Button asChild size="lg" className="shadow-soft">
                <Link to="/products">Shop Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Chibugo?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive solutions with flexible payment options and reliable service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-muted-foreground">
                  Original laptops and phones from trusted brands with warranty.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Payments</h3>
                <p className="text-muted-foreground">
                  Pay in installments or minimal deposit before delivery options available.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trusted Service</h3>
                <p className="text-muted-foreground">
                  Years of experience serving customers in Onitsha and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tech Products */}
            <Card className="overflow-hidden group cursor-pointer shadow-soft hover:shadow-medium transition-all">
              <Link to="/products">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={heroTech} 
                    alt="Tech Products" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Laptop className="w-6 h-6 text-primary" />
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Tech Products</h3>
                    <p className="text-muted-foreground mb-4">
                      Latest laptops and smartphones
                    </p>
                    <Button>Browse Products</Button>
                  </div>
                </div>
              </Link>
            </Card>

            {/* Real Estate */}
            <Card className="overflow-hidden group cursor-pointer shadow-soft hover:shadow-medium transition-all">
              <Link to="/properties">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={heroRealEstate} 
                    alt="Real Estate" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Real Estate</h3>
                    <p className="text-muted-foreground mb-4">
                      Quality properties for rent and sale
                    </p>
                    <Button variant="outline">View Properties</Button>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Visit our shop or contact us today to find the perfect product or property for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;