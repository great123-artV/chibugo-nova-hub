import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Home, CheckCircle, TrendingUp, Shield } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-background/95">
        <div 
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] "
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
              Discover quality phones, laptops, accessories and properties at Chibugo Computer Tech / Real Estate. Your trusted partner in Onitsha - we manage everything 100%.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Chibugo Computer Tech?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer phones, laptops, accessories, landed properties, houses and contractor services with flexible payment options. We manage everything 100% for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Products & Properties</h3>
                <p className="text-muted-foreground">
                  Original phones, laptops, accessories from trusted brands plus quality properties - all with warranty and guaranteed satisfaction.
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
            {/* Tech Products - Cool Blue Theme */}
            <Card className="overflow-hidden group cursor-pointer shadow-tech hover:shadow-tech transition-all border-tech-border/30 bg-gradient-to-br from-tech-dark/20 to-background relative">
              <Link to="/products">
                {/* Tech Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-tech-glow/5 via-transparent to-tech-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Circuit Pattern Background */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,hsl(var(--tech-glow))_0%,transparent_70%)]"></div>
                </div>

                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Laptop className="w-8 h-8 text-tech-glow group-hover:scale-110 transition-transform" />
                    <Smartphone className="w-8 h-8 text-tech-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge className="mb-3 bg-tech-glow/20 text-tech-glow border-tech-glow/50">TECH</Badge>
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-tech-glow transition-colors">Tech Products</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Cutting-edge phones, laptops & accessories from all major brands
                  </p>
                  <Button className="bg-gradient-to-r from-tech-dark to-tech-border hover:from-tech-glow hover:to-tech-accent group-hover:shadow-tech-sm transition-all">
                    Browse Products
                    <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Button>
                </div>
              </Link>
            </Card>

            {/* Real Estate - Warm Gold Theme */}
            <Card className="overflow-hidden group cursor-pointer shadow-estate hover:shadow-estate-hover transition-all border-estate-gold/30 bg-gradient-to-br from-estate-cream/20 to-background relative">
              <Link to="/properties">
                {/* Luxury Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-estate-gold/5 via-transparent to-estate-warm/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Architectural Element */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Home className="w-full h-full text-estate-gold" />
                </div>

                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-8 h-8 text-estate-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge className="mb-3 bg-estate-gold/20 text-estate-earth border-estate-gold/50">REAL ESTATE</Badge>
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-estate-gold transition-colors">Properties</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Premium landed properties, houses & professional contractor services
                  </p>
                  <Button className="bg-gradient-to-r from-estate-earth to-estate-gold hover:from-estate-gold hover:to-estate-earth text-white border-0 group-hover:shadow-estate transition-all">
                    View Properties
                    <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Button>
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