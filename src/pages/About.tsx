import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Award, TrendingUp } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Chibugo Computers and Real Estate
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner for quality tech products and real estate solutions in Onitsha, Nigeria.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At Chibugo Computers and Real Estate, we're committed to providing our customers with 
              high-quality laptops, smartphones, and real estate services that meet their needs and exceed their expectations.
            </p>
            <p className="text-muted-foreground mb-4">
              Located in the heart of Onitsha at Digital World Plaza, we've built a reputation for 
              reliability, quality, and exceptional customer service. Our flexible payment options make 
              it easier for you to get the products you need.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>

          <Card className="shadow-medium">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Original Products</h4>
                    <p className="text-sm text-muted-foreground">
                      All our laptops and phones are 100% original with warranty
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Flexible Payment</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay in installments or with minimal deposit before delivery
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Expert Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team is always ready to help you make the right choice
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Convenient Location</h4>
                    <p className="text-sm text-muted-foreground">
                      Easy to find at Digital World Plaza, opposite GTBank
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="pt-8 pb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">1000+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="pt-8 pb-8">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">5+ Years</h3>
              <p className="text-muted-foreground">In Business</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="pt-8 pb-8">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">100%</h3>
              <p className="text-muted-foreground">Original Products</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-medium">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Visit our store or contact us today to explore our products and services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;