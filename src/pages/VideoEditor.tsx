import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Video, Download, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function VideoEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [uploaderEmail, setUploaderEmail] = useState("");
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  
  // Transformation options
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [filter, setFilter] = useState("none");
  const [exportPreset, setExportPreset] = useState("youtube");
  const [watermarkText, setWatermarkText] = useState("Chibugo Computers");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      if (selectedFile.size > 500 * 1024 * 1024) { // 500MB limit
        toast.error("File size must be less than 500MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !uploaderName || !uploaderEmail || !permissionConfirmed) {
      toast.error("Please fill all required fields and confirm permission");
      return;
    }

    setIsUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error: dbError } = await supabase
        .from("video_uploads")
        .insert({
          original_filename: file.name,
          file_path: filePath,
          file_size: file.size,
          uploader_name: uploaderName,
          uploader_email: uploaderEmail,
          permission_confirmed: permissionConfirmed,
          status: "pending",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadedVideoId(data.id);
      toast.success("Video uploaded successfully! You can now apply transformations.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcessVideo = async () => {
    if (!uploadedVideoId) {
      toast.error("Please upload a video first");
      return;
    }

    const transformations = {
      trim: { start: trimStart, end: trimEnd },
      brightness,
      contrast,
      speed,
      filter,
      watermark: watermarkText,
      exportPreset,
    };

    toast.info("Processing video... This may take a few minutes.");

    try {
      const { error } = await supabase.functions.invoke("process-video", {
        body: {
          videoId: uploadedVideoId,
          transformations,
        },
      });

      if (error) throw error;

      toast.success("Video processing started! You'll be notified when it's ready.");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process video. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Professional Video Editor</h1>
            <p className="text-muted-foreground">
              Upload, transform, and export your videos with professional-grade tools
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Video
                </CardTitle>
                <CardDescription>Upload your video and confirm permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={uploaderEmail}
                    onChange={(e) => setUploaderEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="video">Select Video File *</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2 p-4 border rounded-lg bg-muted/50">
                  <Checkbox
                    id="permission"
                    checked={permissionConfirmed}
                    onCheckedChange={(checked) => setPermissionConfirmed(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="permission"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm I own or have rights to this video *
                    </label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you confirm that you have the legal right to upload,
                      modify, and distribute this video content.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !file || !uploaderName || !uploaderEmail || !permissionConfirmed}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : uploadedVideoId ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Video Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Transformations Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Transformations
                </CardTitle>
                <CardDescription>Apply professional effects to your video</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label>Trim Video (0-100%)</Label>
                      <div className="flex gap-4 items-center mt-2">
                        <div className="flex-1">
                          <Label className="text-xs">Start: {trimStart}%</Label>
                          <Slider
                            value={[trimStart]}
                            onValueChange={(value) => setTrimStart(value[0])}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">End: {trimEnd}%</Label>
                          <Slider
                            value={[trimEnd]}
                            onValueChange={(value) => setTrimEnd(value[0])}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Playback Speed: {speed}x</Label>
                      <Slider
                        value={[speed]}
                        onValueChange={(value) => setSpeed(value[0])}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="effects" className="space-y-4">
                    <div>
                      <Label>Brightness: {brightness > 0 ? `+${brightness}` : brightness}</Label>
                      <Slider
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                        min={-100}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Contrast: {contrast > 0 ? `+${contrast}` : contrast}</Label>
                      <Slider
                        value={[contrast]}
                        onValueChange={(value) => setContrast(value[0])}
                        min={-100}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Filter</Label>
                      <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="grayscale">Grayscale</SelectItem>
                          <SelectItem value="sepia">Sepia</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Watermark Text</Label>
                      <Input
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Enter watermark text"
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="export" className="space-y-4">
                    <div>
                      <Label>Export Preset</Label>
                      <Select value={exportPreset} onValueChange={setExportPreset}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube (1080p)</SelectItem>
                          <SelectItem value="instagram">Instagram (1080x1080)</SelectItem>
                          <SelectItem value="tiktok">TikTok (1080x1920)</SelectItem>
                          <SelectItem value="twitter">Twitter (720p)</SelectItem>
                          <SelectItem value="high">High Quality (4K)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Optimized settings for your target platform
                      </p>
                    </div>

                    <Button
                      onClick={handleProcessVideo}
                      disabled={!uploadedVideoId}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Process & Export Video
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Trim, crop, adjust brightness/contrast, apply filters, and add watermarks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimized settings for YouTube, Instagram, TikTok, and more
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secure & Ethical</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Permission tracking and audit logs ensure ethical video editing practices
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
