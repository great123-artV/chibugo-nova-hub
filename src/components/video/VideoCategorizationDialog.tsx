import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface VideoCategorizationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
}

export function VideoCategorizationDialog({ isOpen, onOpenChange, videoUrl }: VideoCategorizationDialogProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState<"product" | "property">("product");
  const [isSaving, setIsSaving] = useState(false);

  // Common Fields
  const [price, setPrice] = useState("");
  
  // Product Fields
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [productType, setProductType] = useState("laptop");

  // Property Fields
  const [propertyTitle, setPropertyTitle] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("rent");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (category === "product") {
        if (!productName || !price) {
          toast.error("Please fill in all required fields");
          return;
        }

        const { error } = await supabase.from("products").insert({
          name: productName,
          brand: brand,
          price: parseFloat(price),
          type: productType,
          images: [videoUrl], // Store video URL in images array
          stock: 1, // Default to 1
          specs: {},
        });

        if (error) throw error;
        toast.success("Product created successfully!");
        navigate("/products");
      } else {
        if (!propertyTitle || !price || !location) {
          toast.error("Please fill in all required fields");
          return;
        }

        const { error } = await supabase.from("properties").insert({
          title: propertyTitle,
          price: parseFloat(price),
          location: location,
          type: propertyType, // 'rent' or 'sale' usually, using type column
          property_type: "Residential", // Default
          images: [videoUrl], // Store video URL in images array
          featured: false,
        });

        if (error) throw error;
        toast.success("Property listed successfully!");
        navigate("/properties");
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving record:", error);
      toast.error(error.message || "Failed to save record");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-strong border-tech-border/30">
        <DialogHeader>
          <DialogTitle>Categorize Processed Video</DialogTitle>
          <DialogDescription>
            Choose where to list this video and provide details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <RadioGroup 
            defaultValue="product" 
            onValueChange={(v) => setCategory(v as "product" | "property")} 
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="product" id="product" className="peer sr-only" />
              <Label
                htmlFor="product"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Products
              </Label>
            </div>
            <div>
              <RadioGroupItem value="property" id="property" className="peer sr-only" />
              <Label
                htmlFor="property"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Properties
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-4">
            {category === "product" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. MacBook Pro M3" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="productType">Type</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="accessory">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="propertyTitle">Property Title</Label>
                  <Input id="propertyTitle" value={propertyTitle} onChange={(e) => setPropertyTitle(e.target.value)} placeholder="e.g. Luxury Duplex in Lekki" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lekki Phase 1, Lagos" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="propertyType">Listing Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input 
                id="price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
