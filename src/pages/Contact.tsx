import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SocialRibbon from "@/components/SocialRibbon";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("inquiries")
        .insert([formData]);

      if (error) throw error;

      // Send email notification to admins
      console.log("Invoking 'send-contact-email' with:", formData);
      const { data, error: functionError } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (functionError || (data && !data.id && !data.message?.includes("received"))) {
        console.error("Edge Function Error:", functionError || data);
        toast({
          title: "Message Saved",
          description: "Note: Admin notification email could not be sent. Please check logs.",
          variant: "destructive", // Warning style
        });
      } else {
        console.log("Edge Function Response:", data);
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1AhEuGWCjc/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/chibugo_reale_state?igsh=MWJwbWxqdmQ4d3Zy", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@chibugorealestate", label: "YouTube" },
    { icon: TikTokIcon, href: "https://tiktok.com/@chibugorealestate", label: "TikTok", isCustom: true },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 futuristic-grid opacity-20" />
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-tech-glow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-estate-gold/10 rounded-full blur-3xl" />
      
      {/* Mansion Silhouette - Faint Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg viewBox="0 0 800 400" className="w-full max-w-4xl" fill="currentColor">
          <path d="M400 50 L600 150 L600 350 L200 350 L200 150 Z M300 350 L300 250 L350 250 L350 350 M450 350 L450 250 L500 250 L500 350 M250 200 L250 280 L330 280 L330 200 Z M470 200 L470 280 L550 280 L550 200 Z M400 50 L700 200 L700 350 L600 350 L600 150 M400 50 L100 200 L100 350 L200 350 L200 150" />
        </svg>
      </div>

      {/* Social Ribbon */}
      <SocialRibbon variant="estate" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-gradient-tech">Get in</span>{" "}
            <span className="text-gradient-estate">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our premium tech gadgets or luxury properties? 
            We're here to help you find exactly what you're looking for.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Location Card */}
          <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mb-4 border border-tech-border/30 group-hover:shadow-tech-sm transition-shadow">
                <MapPin className="w-6 h-6 text-tech-glow" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Visit Our Store</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                16 New Market Road, Digital World Plaza, opposite GTBank, Shop A118, Onitsha, Anambra State
              </p>
            </CardContent>
          </Card>

          {/* Tech Phone Card */}
          <Card className="glass border-border/50 hover:border-tech-glow/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mb-4 border border-tech-border/30 group-hover:shadow-tech-sm transition-shadow">
                <Phone className="w-6 h-6 text-tech-glow" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Tech Gadgets</h3>
              <a href="tel:08161844109" className="text-lg font-medium text-tech-glow hover:underline">
                08161844109
              </a>
              <p className="text-sm text-muted-foreground mt-1">Call for gadget inquiries</p>
            </CardContent>
          </Card>

          {/* Estate Phone Card */}
          <Card className="glass border-border/50 hover:border-estate-gold/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mb-4 border border-estate-gold/30 group-hover:shadow-gold transition-shadow">
                <Phone className="w-6 h-6 text-estate-gold" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Real Estate</h3>
              <a href="tel:07045024855" className="text-lg font-medium text-estate-gold hover:underline">
                07045024855
              </a>
              <p className="text-sm text-muted-foreground mt-1">Call for property inquiries</p>
            </CardContent>
          </Card>

          {/* Hours Card */}
          <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mb-4 border border-border/30 group-hover:shadow-tech-sm transition-shadow">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Business Hours</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="text-foreground">Mon-Fri:</span> 8AM - 5PM</p>
                <p><span className="text-foreground">Sat:</span> 8AM - 5PM</p>
                <p><span className="text-foreground">Sun:</span> Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="glass-strong border-border/50 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tech-glow via-primary to-estate-gold" />
            <CardHeader>
              <CardTitle className="font-display text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="glass border-border/50 focus:border-primary/50 bg-background/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="glass border-border/50 focus:border-primary/50 bg-background/50"
                    />
                  </div>
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass border-border/50 focus:border-primary/50 bg-background/50"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="glass border-border/50 focus:border-primary/50 bg-background/50 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-tech-glow to-primary hover:opacity-90 transition-opacity" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social & Connect Section */}
          <div className="space-y-6">
            {/* Social Media Card */}
            <Card className="glass-strong border-border/50 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-estate-gold via-estate-warm to-estate-earth" />
              <CardHeader>
                <CardTitle className="font-display text-2xl">Connect With Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Follow us on social media for the latest tech deals, property listings, and exclusive offers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-4 glass rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-tech-sm"
                    >
                      <div className="w-10 h-10 glass rounded-lg flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
                        {social.isCustom ? (
                          <TikTokIcon />
                        ) : (
                          <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{social.label}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Info */}
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border border-border/50">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Us</p>
                    <a href="mailto:info@chibugo.com" className="font-medium text-foreground hover:text-primary transition-colors">
                      info@chibugo.com
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;