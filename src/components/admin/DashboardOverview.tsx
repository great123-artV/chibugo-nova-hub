import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Home, Video, Mail } from "lucide-react";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    properties: 0,
    videos: 0,
    inquiries: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [products, properties, videos, inquiries] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("video_uploads").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      products: products.count || 0,
      properties: properties.count || 0,
      videos: videos.count || 0,
      inquiries: inquiries.count || 0,
    });
  };

  const cards = [
    { title: "Products", value: stats.products, icon: Package },
    { title: "Properties", value: stats.properties, icon: Home },
    { title: "Videos", value: stats.videos, icon: Video },
    { title: "Inquiries", value: stats.inquiries, icon: Mail },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
