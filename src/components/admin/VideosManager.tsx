import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface VideoUpload {
  id: string;
  original_filename: string;
  status: string;
  uploader_name: string | null;
  uploader_email: string | null;
  created_at: string;
  file_size: number;
}

const VideosManager = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoUpload[]>([]);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const { data, error } = await supabase
      .from("video_uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error loading videos", description: error.message });
    } else {
      setVideos(data || []);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Video Uploads</h2>

      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{video.original_filename}</span>
                <Badge className={getStatusColor(video.status)}>{video.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {video.uploader_name && <p>Uploader: {video.uploader_name}</p>}
                {video.uploader_email && <p>Email: {video.uploader_email}</p>}
                <p>Size: {formatFileSize(video.file_size)}</p>
                <p>Uploaded: {new Date(video.created_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideosManager;
