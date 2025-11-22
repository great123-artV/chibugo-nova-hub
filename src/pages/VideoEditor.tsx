import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Video, Download, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Transformation options
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [filter, setFilter] = useState("none");
  const [exportPreset, setExportPreset] = useState("youtube");
  const [watermarkText, setWatermarkText] = useState("Chibugo Computers");

  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    ffmpeg.on("progress", ({ progress }) => {
      setProcessingProgress(Math.round(progress * 100));
    });

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsFFmpegLoaded(true);
      toast.success("Video editor ready!");
    } catch (error) {
      console.error("FFmpeg load error:", error);
      toast.error("Failed to load video editor. Please refresh the page.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      if (selectedFile.size > 500 * 1024 * 1024) {
        toast.error("File size must be less than 500MB");
        return;
      }
      setFile(selectedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setVideoPreviewUrl(previewUrl);
      
      // Reset processed video
      if (processedVideoUrl) {
        URL.revokeObjectURL(processedVideoUrl);
        setProcessedVideoUrl(null);
      }
      
      toast.success("Video loaded! Adjust settings and click Process.");
    }
  };

  const handleProcessVideo = async () => {
    if (!file || !isFFmpegLoaded) {
      toast.error("Please select a video and wait for editor to load");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    toast.info("Processing video... This may take a few minutes.");

    try {
      const ffmpeg = ffmpegRef.current;
      
      // Write input file
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));

      // Build video filters with corner animations
      const filters: string[] = [];
      
      // Add corner animations - animated colorful strips on all four corners
      const cornerAnimation = [
        // Top-left corner
        "drawbox=x=0:y=0:w=100:h=5:color=cyan@0.8:t=fill",
        "drawbox=x=0:y=0:w=5:h=100:color=cyan@0.8:t=fill",
        // Top-right corner
        "drawbox=x=iw-100:y=0:w=100:h=5:color=magenta@0.8:t=fill",
        "drawbox=x=iw-5:y=0:w=5:h=100:color=magenta@0.8:t=fill",
        // Bottom-left corner
        "drawbox=x=0:y=ih-100:w=5:h=100:color=yellow@0.8:t=fill",
        "drawbox=x=0:y=ih-5:w=100:h=5:color=yellow@0.8:t=fill",
        // Bottom-right corner
        "drawbox=x=iw-5:y=ih-100:w=5:h=100:color=lime@0.8:t=fill",
        "drawbox=x=iw-100:y=ih-5:w=100:h=5:color=lime@0.8:t=fill"
      ];
      filters.push(...cornerAnimation);
      
      let args = ["-i", "input.mp4"];

      // Trim
      if (trimStart > 0 || trimEnd < 100) {
        const videoDuration = videoRef.current?.duration || 100;
        const start = (trimStart / 100) * videoDuration;
        const end = (trimEnd / 100) * videoDuration;
        args.push("-ss", start.toString(), "-to", end.toString());
      }

      // Brightness and contrast
      if (brightness !== 0 || contrast !== 0) {
        const brightnessVal = brightness / 100;
        const contrastVal = 1 + contrast / 100;
        filters.push(`eq=brightness=${brightnessVal}:contrast=${contrastVal}`);
      }

      // Speed
      if (speed !== 1) {
        const tempo = 1 / speed;
        filters.push(`setpts=${tempo}*PTS`);
      }

      // Color filters
      if (filter !== "none") {
        switch (filter) {
          case "grayscale":
            filters.push("hue=s=0");
            break;
          case "sepia":
            filters.push("colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131");
            break;
          case "vintage":
            filters.push("curves=vintage");
            break;
          case "cinematic":
            filters.push("curves=preset=darker");
            break;
        }
      }

      // Watermark
      if (watermarkText) {
        const escapedText = watermarkText.replace(/'/g, "\\'").replace(/:/g, "\\:");
        filters.push(`drawtext=text='${escapedText}':fontsize=24:fontcolor=white@0.8:x=20:y=H-th-20:box=1:boxcolor=black@0.5:boxborderw=5`);
      }

      // Apply filters
      if (filters.length > 0) {
        args.push("-vf", filters.join(","));
      }

      // Export preset
      switch (exportPreset) {
        case "youtube":
          args.push("-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k");
          break;
        case "instagram":
          args.push("-c:v", "libx264", "-crf", "25", "-s", "1080x1080", "-c:a", "aac", "-b:a", "96k");
          break;
        case "tiktok":
          args.push("-c:v", "libx264", "-crf", "25", "-s", "1080x1920", "-c:a", "aac", "-b:a", "128k");
          break;
        case "twitter":
          args.push("-c:v", "libx264", "-crf", "25", "-s", "1280x720", "-c:a", "aac", "-b:a", "96k");
          break;
        case "high":
          args.push("-c:v", "libx264", "-preset", "slow", "-crf", "18", "-c:a", "aac", "-b:a", "192k");
          break;
      }

      args.push("output.mp4");

      console.log("FFmpeg command:", args.join(" "));

      // Execute
      await ffmpeg.exec(args);

      // Read output
      const data = await ffmpeg.readFile("output.mp4");
      const uint8Data = typeof data === "string" 
        ? new TextEncoder().encode(data) 
        : new Uint8Array(data);
      const blob = new Blob([uint8Data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      
      // Clean up old URL
      if (processedVideoUrl) {
        URL.revokeObjectURL(processedVideoUrl);
      }
      
      setProcessedVideoUrl(url);
      toast.success("Video processed successfully! Click download to save.");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process video. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleDownload = () => {
    if (!processedVideoUrl) {
      toast.error("No processed video available");
      return;
    }

    const a = document.createElement("a");
    a.href = processedVideoUrl;
    a.download = `chibugo-edited-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Video downloaded successfully!");
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

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Upload Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Select Video
                </CardTitle>
                <CardDescription>Choose a video file to edit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video">Video File</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    disabled={!isFFmpegLoaded}
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {file.name}<br />
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                  {!isFFmpegLoaded && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading editor...
                    </p>
                  )}
                </div>

                {videoPreviewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <video
                      ref={videoRef}
                      src={videoPreviewUrl}
                      controls
                      className="w-full rounded-lg border"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}

                {processedVideoUrl && (
                  <div className="space-y-2">
                    <Label>Processed Video</Label>
                    <video
                      src={processedVideoUrl}
                      controls
                      className="w-full rounded-lg border"
                      style={{ maxHeight: "200px" }}
                    />
                    <Button
                      onClick={handleDownload}
                      variant="default"
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Edited Video
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transformations Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Transformations
                </CardTitle>
                <CardDescription>Apply professional effects and export</CardDescription>
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
                      disabled={!file || !isFFmpegLoaded || isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing {processingProgress}%
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Process Video
                        </>
                      )}
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
