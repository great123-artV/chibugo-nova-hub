import { useState } from "react";
import { Phone, Mail, MessageCircle, Instagram, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FloatingContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const contactItems = [
    { 
      icon: Phone, 
      href: "tel:08161844109", 
      label: "Call Us",
      color: "tech-glow"
    },
    { 
      icon: Mail, 
      href: "mailto:info@chibugo.com", 
      label: "Email",
      color: "primary"
    },
    { 
      icon: WhatsAppIcon, 
      href: "https://wa.me/2348161844109", 
      label: "WhatsApp",
      color: "green-500",
      isCustom: true
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/chibugo_reale_state?igsh=MWJwbWxqdmQ4d3Zy", 
      label: "Instagram",
      color: "pink-500"
    },
  ];

  return (
    <>
      {/* Floating WhatsApp Button - Main */}
      <a
        href="https://wa.me/2348161844109"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Contact us on WhatsApp"
      >
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping" />
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
          
          {/* Button */}
          <div className="relative w-14 h-14 glass-strong rounded-full flex items-center justify-center border border-green-500/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full" />
            <WhatsAppIcon />
          </div>
        </div>
      </a>

      {/* Quick Contact Dock - Right Side */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className={cn(
          "flex flex-col gap-2 p-2 glass-strong rounded-l-2xl border border-r-0 border-border/50 transition-all duration-300",
          isExpanded ? "translate-x-0" : "translate-x-12"
        )}>
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center border border-border/50 hover:border-primary/50 transition-all duration-300 group absolute -left-12 top-1/2 -translate-y-1/2"
            aria-label={isExpanded ? "Close contact dock" : "Open contact dock"}
          >
            {isExpanded ? (
              <X className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors -rotate-90" />
            )}
          </button>
          
          {/* Contact Items */}
          {contactItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative w-10 h-10 glass rounded-xl flex items-center justify-center border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-tech-sm"
              aria-label={item.label}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              {item.isCustom ? (
                <WhatsAppIcon />
              ) : (
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative z-10" />
              )}
              
              {/* Tooltip */}
              <span className="absolute right-14 px-3 py-1.5 glass rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border/50">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <div className="flex gap-3 p-3 glass-strong rounded-2xl border border-border/50">
          {contactItems.slice(0, 3).map((item, index) => (
            <a
              key={index}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-border/50 active:scale-95 transition-transform"
              aria-label={item.label}
            >
              {item.isCustom ? (
                <WhatsAppIcon />
              ) : (
                <item.icon className="w-5 h-5 text-foreground" />
              )}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default FloatingContact;
