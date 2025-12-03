import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1AhEuGWCjc/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/chibugo_reale_state?igsh=MWJwbWxqdmQ4d3Zy", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@chibugorealestate", label: "YouTube" },
    { icon: TikTokIcon, href: "https://tiktok.com/@chibugorealestate", label: "TikTok", isCustom: true },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-card to-background border-t border-border/50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 futuristic-grid opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-tech-glow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-estate-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold">
              <span className="text-gradient-tech">Chibugo</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Premium tech gadgets and luxury real estate solutions across Nigeria.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative w-10 h-10 glass rounded-xl flex items-center justify-center border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-tech-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  {social.isCustom ? (
                    <TikTokIcon />
                  ) : (
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative z-10" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: "/products", label: "Tech Products" },
                { to: "/properties", label: "Properties" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-border/50 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  16 New Market Road, Digital World Plaza, opposite GTBank, Shop A118, Onitsha, Anambra State
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-border/50 flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <a href="tel:08161844109" className="block hover:text-tech-glow transition-colors">
                    <span className="text-tech-glow">Gadgets:</span> 08161844109
                  </a>
                  <a href="tel:07045024855" className="block hover:text-estate-gold transition-colors">
                    <span className="text-estate-gold">Real Estate:</span> 07045024855
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-border/50 flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <a href="mailto:info@chibugo.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@chibugo.com
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Business Hours</h4>
            <div className="glass rounded-xl p-4 border border-border/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mon - Fri</span>
                <span className="text-foreground font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saturday</span>
                <span className="text-foreground font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sunday</span>
                <span className="text-foreground font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Chibugo Computers and Real Estate. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
