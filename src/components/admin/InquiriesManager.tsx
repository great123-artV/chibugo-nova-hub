import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string | null;
  product_id: string | null;
  property_id: string | null;
}

const InquiriesManager = () => {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error loading inquiries", description: error.message });
    } else {
      setInquiries(data || []);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error deleting inquiry", description: error.message });
    } else {
      toast({ title: "Inquiry deleted" });
      setInquiries(inquiries.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inquiries</h2>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{inquiry.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(inquiry.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mt-3">
                <p><strong>Email:</strong> {inquiry.email}</p>
                {inquiry.phone && <p><strong>Phone:</strong> {inquiry.phone}</p>}
                <p className="whitespace-pre-wrap"><strong>Message:</strong> {inquiry.message}</p>
                {inquiry.created_at && (
                  <p className="text-muted-foreground pt-2 text-xs">
                    Received: {new Date(inquiry.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {inquiries.length === 0 && (
          <p className="text-muted-foreground">No inquiries found.</p>
        )}
      </div>
    </div>
  );
};

export default InquiriesManager;
