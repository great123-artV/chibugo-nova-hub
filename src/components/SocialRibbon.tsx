import { Facebook, Instagram, Youtube } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialRibbonProps {
  variant?: "tech" | "estate";
}

const SocialRibbon = ({ variant = "tech" }: SocialRibbonProps) => {
  const socialLinks = [
    { icon: TikTokIcon, href: "https://tiktok.com/@chibugorealestate", label: "TikTok", isCustom: true },
    { icon: Instagram, href: "https://www.instagram.com/chibugo_reale_state?igsh=MWJwbWxqdmQ4d3Zy", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/share/1AhEuGWCjc/", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com/@chibugorealestate", label: "YouTube" },
  ];

  const glowColor = variant === "tech" ? "tech-glow" : "estate-gold";
  const gradientFrom = variant === "tech" ? "from-tech-glow/10" : "from-estate-gold/10";
  const gradientTo = variant === "tech" ? "to-tech-accent/5" : "to-estate-warm/5";
  const borderColor = variant === "tech" ? "border-tech-border/30" : "border-estate-gold/20";
  const hoverColor = variant === "tech" ? "hover:text-tech-glow" : "hover:text-estate-gold";

  return (
    <div className={`relative overflow-hidden py-4 border-y ${borderColor} bg-gradient-to-r ${gradientFrom} via-transparent ${gradientTo}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${glowColor}/5 to-transparent animate-shimmer`} 
             style={{ backgroundSize: '200% 100%' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
          <span className={`text-sm font-medium ${variant === "tech" ? "text-tech-silver" : "text-estate-cream"}`}>
            Follow Chibugo {variant === "estate" ? "Real Estate" : "Tech"}
          </span>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-2 text-muted-foreground ${hoverColor} transition-all duration-300`}
                aria-label={social.label}
              >
                <span className="relative">
                  {social.isCustom ? (
                    <TikTokIcon />
                  ) : (
                    <social.icon className="w-4 h-4" />
                  )}
                  <span className={`absolute inset-0 bg-${glowColor}/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity`} />
                </span>
                <span className="text-sm hidden md:inline">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialRibbon;
