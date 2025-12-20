import { useState } from "react";
import { Play } from "lucide-react";

interface VideoThumbnailProps {
  src: string;
  alt?: string;
  className?: string;
}

export const VideoThumbnail = ({ src, alt, className = "" }: VideoThumbnailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className={`relative bg-black ${className}`}>
        <video
          src={src}
          className="w-full h-full object-cover"
          controls
          autoPlay
          playsInline
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative group overflow-hidden bg-black/10 cursor-pointer ${className}`}
      onClick={(e) => {
        e.preventDefault();
        setIsPlaying(true);
      }}
    >
      <video
        src={src}
        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        muted
        playsInline
        preload="metadata"
      />
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
    </div>
  );
};
