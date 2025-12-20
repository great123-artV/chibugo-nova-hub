import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inquiries</h2>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardHeader>
              <CardTitle className="text-lg">{inquiry.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {inquiry.email}</p>
                {inquiry.phone && <p><strong>Phone:</strong> {inquiry.phone}</p>}
                <p><strong>Message:</strong> {inquiry.message}</p>
                {inquiry.created_at && (
                  <p className="text-muted-foreground">
                    Received: {new Date(inquiry.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InquiriesManager;
