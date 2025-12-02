import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Home, CheckCircle, TrendingUp, Shield } from "lucide-react";
import techHero from "@/assets/tech-hero.jpg";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-tech-dark via-background to-estate-earth/20"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--tech-border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--tech-border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tech-glow/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-estate-gold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-tech-glow/20 text-tech-glow border-tech-glow/50 px-4 py-2">
              CHIBUGO COMPUTER TECH / REAL ESTATE
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              Premium{" "}
              <span className="bg-gradient-to-r from-tech-glow to-tech-accent bg-clip-text text-transparent">Tech</span> &{" "}
              <span className="bg-gradient-to-r from-estate-gold to-estate-earth bg-clip-text text-transparent">Real Estate</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in max-w-2xl">
              Discover premium phones, laptops, accessories and quality properties across Nigeria. Trusted service, flexible payments, nationwide delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Button asChild size="lg" className="bg-gradient-to-r from-tech-glow to-tech-accent hover:opacity-90 text-white shadow-tech">
                <Link to="/products">Shop Products</Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-estate-gold to-estate-earth hover:opacity-90 text-white">
                <Link to="/properties">View Properties</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-foreground/30">
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
              Premium gadgets, landed properties, houses and contractor services with flexible payment options. We deliver nationwide across Nigeria.
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
                <h3 className="text-xl font-semibold mb-2">Nationwide Service</h3>
                <p className="text-muted-foreground">
                  Serving customers across all states in Nigeria with reliable delivery and support.
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
            {/* Tech Products - With Laptop Background */}
            <Card className="overflow-hidden group cursor-pointer shadow-tech hover:shadow-tech transition-all border-tech-border/30 relative min-h-[400px]">
              <Link to="/products" className="block h-full">
                {/* Laptop Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${techHero})` }}
                ></div>
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-tech-dark via-tech-dark/80 to-tech-dark/40 group-hover:from-tech-dark group-hover:via-tech-dark/70 group-hover:to-tech-dark/30 transition-all duration-500"></div>
                
                {/* Tech Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-tech-glow/10 via-transparent to-tech-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="p-8 relative z-10 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <Laptop className="w-8 h-8 text-tech-glow group-hover:scale-110 transition-transform" />
                    <Smartphone className="w-8 h-8 text-tech-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge className="mb-3 w-fit bg-tech-glow/30 text-tech-glow border-tech-glow/50 backdrop-blur-sm">GADGETS</Badge>
                  <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-tech-glow transition-colors">Tech Products</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Latest phones, laptops & accessories from top brands worldwide
                  </p>
                  <Button className="w-fit bg-tech-glow/20 backdrop-blur-sm border border-tech-glow/50 text-white hover:bg-tech-glow hover:text-white group-hover:shadow-tech-sm transition-all">
                    Browse Products
                    <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Button>
                </div>
              </Link>
            </Card>

            {/* Real Estate - Warm Gold Theme */}
            <Card className="overflow-hidden group cursor-pointer shadow-estate hover:shadow-estate-hover transition-all border-estate-gold/30 bg-gradient-to-br from-estate-cream/20 to-background relative min-h-[400px]">
              <Link to="/properties" className="block h-full">
                {/* Luxury Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-estate-gold/5 via-transparent to-estate-warm/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Architectural Element */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Home className="w-full h-full text-estate-gold" />
                </div>

                <div className="p-8 relative z-10 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-8 h-8 text-estate-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge className="mb-3 w-fit bg-estate-gold/20 text-estate-earth border-estate-gold/50">REAL ESTATE</Badge>
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-estate-gold transition-colors">Properties</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Premium landed properties, houses & professional contractor services
                  </p>
                  <Button className="w-fit bg-gradient-to-r from-estate-earth to-estate-gold hover:from-estate-gold hover:to-estate-earth text-white border-0 group-hover:shadow-estate transition-all">
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
            Contact us today to find the perfect product or property. We deliver anywhere in Nigeria.
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
