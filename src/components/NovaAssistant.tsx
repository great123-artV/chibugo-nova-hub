import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, X, Send, Loader2, Mic, MicOff, Volume2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TypingIndicator } from "./TypingIndicator";
import { Link } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function NovaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Nova, your AI assistant for Chibugo Computers and Real Estate. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition error. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        toast.error("Voice recognition not supported in this browser");
        return;
      }
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthRef.current.getVoices();
    const professionalVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Google UK English Female')
    ) || voices[0];
    
    utterance.voice = professionalVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check if user is authenticated
    if (!session) {
      toast.error("Please sign in to use the AI assistant");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("nova-chat", {
        body: { messages: [...messages, { role: "user", content: userMessage }] },
      });

      if (error) {
        if (error.message?.includes("401") || error.message?.includes("auth")) {
          toast.error("Session expired. Please sign in again.");
          return;
        }
        throw error;
      }

      const assistantMessage = data.message.replace(/\*/g, "");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
      
      speakText(assistantMessage);
    } catch (error) {
      console.error("Nova chat error:", error);
      toast.error("Failed to get response from Nova. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-tech-glow to-tech-accent hover:opacity-90 transition-all duration-300 hover:scale-110"
        >
          <Sparkles className="h-6 w-6 text-white animate-pulse" />
        </Button>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <Card 
            className="w-full max-w-[600px] h-[90vh] mx-4 flex flex-col shadow-2xl border-2 rounded-lg animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Nova AI Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopSpeaking}
                    className="hover:bg-primary-foreground/20 text-primary-foreground"
                  >
                    <Volume2 className="h-4 w-4 animate-pulse" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-primary-foreground/20 text-primary-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                if (message.role === "user") {
                  return (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[85%] rounded-lg p-3 break-words bg-primary text-primary-foreground">
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="flex items-start gap-2 ml-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        AI
                      </div>
                      <div className="w-fit max-w-[85%] rounded-lg p-3 break-words bg-muted text-foreground">
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </div>
                  );
                }
              })}
              {isLoading && (
                <div className="flex items-end gap-2 ml-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    AI
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {!session ? (
              <div className="p-4 border-t">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign in to chat with Nova AI Assistant
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In to Continue
                    </Link>
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    <p>Or contact us directly:</p>
                    <p>Gadgets: <a href="tel:08161844109" className="text-primary">08161844109</a></p>
                    <p>Real Estate: <a href="tel:07045024855" className="text-primary">07045024855</a></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading || isListening}
                    className="flex-1 pl-4"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={toggleVoiceInput}
                    disabled={isLoading}
                    variant={isListening ? "destructive" : "outline"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                {isListening && (
                  <p className="text-xs text-center text-muted-foreground animate-pulse">
                    Listening... Speak now
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
