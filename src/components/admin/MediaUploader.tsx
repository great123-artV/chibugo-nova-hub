import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Video, Loader2 } from "lucide-react";

interface MediaUploaderProps {
  existingMedia: string[];
  onMediaChange: (media: string[]) => void;
  bucketName: string;
  folderPath?: string;
}

const MediaUploader = ({ 
  existingMedia, 
  onMediaChange, 
  bucketName, 
  folderPath = "" 
}: MediaUploaderProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = "image/*,video/*";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newMediaUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isVideo && !isImage) {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description: `${file.name} is not a valid image or video file.`,
          });
          continue;
        }

        // Max 100MB for videos, 10MB for images
        const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            variant: "destructive",
            title: "File too large",
            description: `${file.name} exceeds ${isVideo ? "100MB" : "10MB"} limit.`,
          });
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${uploadError.message}`,
          });
          continue;
        }

        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        newMediaUrls.push(urlData.publicUrl);
      }

      if (newMediaUrls.length > 0) {
        onMediaChange([...existingMedia, ...newMediaUrls]);
        toast({
          title: "Upload successful",
          description: `${newMediaUrls.length} file(s) uploaded.`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload error",
        description: error.message,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeMedia = (index: number) => {
    const updated = existingMedia.filter((_, i) => i !== index);
    onMediaChange(updated);
  };

  const isVideo = (url: string) => {
    const videoExtensions = [".mp4", ".mov", ".webm", ".mkv", ".avi", ".wmv", ".flv"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Images & Videos</Label>
        <span className="text-xs text-muted-foreground">
          (Images: max 10MB, Videos: max 100MB)
        </span>
      </div>

      {/* Upload Button */}
      <div className="flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images or Videos
            </>
          )}
        </Button>
      </div>

      {/* Media Preview Grid */}
      {existingMedia.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {existingMedia.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              {isVideo(url) ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-1 left-1 p-1 bg-black/50 rounded text-xs text-white">
                {isVideo(url) ? <Video className="h-3 w-3" /> : <Image className="h-3 w-3" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
