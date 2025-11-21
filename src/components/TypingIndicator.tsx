export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 animate-glow rounded-full bg-primary" />
      <div
        className="h-2 w-2 animate-glow rounded-full bg-primary"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="h-2 w-2 animate-glow rounded-full bg-primary"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}
