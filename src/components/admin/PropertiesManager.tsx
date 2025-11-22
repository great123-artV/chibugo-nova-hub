import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Property {
  id: string;
  title: string;
  type: string | null;
  property_type: string | null;
  price: number;
  location: string | null;
  description: string | null;
  featured: boolean | null;
}

const PropertiesManager = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "sale",
    property_type: "land",
    price: "",
    location: "",
    description: "",
    featured: false,
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Error loading properties", description: error.message });
    } else {
      setProperties(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title: formData.title,
      type: formData.type,
      property_type: formData.property_type,
      price: parseFloat(formData.price),
      location: formData.location,
      description: formData.description,
      featured: formData.featured,
    };

    if (editingProperty) {
      const { error } = await supabase.from("properties").update(propertyData).eq("id", editingProperty.id);
      if (error) {
        toast({ variant: "destructive", title: "Error updating property", description: error.message });
      } else {
        toast({ title: "Property updated successfully" });
        loadProperties();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("properties").insert(propertyData);
      if (error) {
        toast({ variant: "destructive", title: "Error creating property", description: error.message });
      } else {
        toast({ title: "Property created successfully" });
        loadProperties();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error deleting property", description: error.message });
    } else {
      toast({ title: "Property deleted successfully" });
      loadProperties();
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      type: property.type || "sale",
      property_type: property.property_type || "land",
      price: property.price.toString(),
      location: property.location || "",
      description: property.description || "",
      featured: property.featured || false,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "sale",
      property_type: "land",
      price: "",
      location: "",
      description: "",
      featured: false,
    });
    setEditingProperty(null);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProperty ? 'Edit Property' : 'Add Property'}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Add landed properties, houses, or contractor services to your listings
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Listing Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for-sale">For Sale</SelectItem>
                      <SelectItem value="for-rent">For Rent</SelectItem>
                      <SelectItem value="contractor">Contractor Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select value={formData.property_type} onValueChange={(value) => setFormData({ ...formData, property_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land">Landed Property</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="contractor">Contractor Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex items-center col-span-2">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingProperty ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-start">
                <span>{property.title}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(property)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(property.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{property.property_type} - {property.type}</p>
              <p className="text-lg font-semibold mt-2">₦{property.price.toLocaleString()}</p>
              {property.location && (
                <p className="text-sm mt-1">{property.location}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertiesManager;
