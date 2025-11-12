import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, Laptop, Smartphone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  type: string;
  brand: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  specs: any;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchPaymentOptions();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentOptions = async () => {
    try {
      const { data } = await supabase
        .from("payment_options")
        .select("*")
        .eq("product_id", id)
        .single();

      setPaymentOptions(data);
    } catch (error) {
      // Payment options may not exist
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/products">
            <ArrowLeft className="mr-2" size={20} />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                {product.type === "laptop" ? (
                  <Laptop className="w-32 h-32 text-muted-foreground" />
                ) : (
                  <Smartphone className="w-32 h-32 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge variant="secondary" className="mb-4">
              {product.type === "laptop" ? "Laptop" : "Phone"}
            </Badge>
            {product.brand && (
              <p className="text-muted-foreground mb-2">{product.brand}</p>
            )}
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">
              ₦{product.price.toLocaleString()}
            </p>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Options */}
            {paymentOptions && (
              <Card className="mb-6 bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Payment Options</h3>
                  <div className="space-y-2">
                    {paymentOptions.partial_payment_enabled && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Partial Payment: Pay {paymentOptions.partial_payment_percentage}% upfront, remaining on delivery
                        </span>
                      </div>
                    )}
                    {paymentOptions.delivery_before_full_payment && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Delivery Before Full Payment: {paymentOptions.deposit_percentage}% deposit required
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 5 ? (
                <p className="text-green-600 flex items-center gap-2">
                  <CheckCircle size={20} />
                  In Stock
                </p>
              ) : product.stock > 0 ? (
                <p className="text-amber-600 flex items-center gap-2">
                  Only {product.stock} left in stock
                </p>
              ) : (
                <p className="text-destructive">Out of Stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1">
                <Link to={`/contact?product=${product.id}`}>Contact Seller</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <a href={`tel:08161844109`}>Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;