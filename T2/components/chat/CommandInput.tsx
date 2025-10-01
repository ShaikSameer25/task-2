"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type CommandInputProps = {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
};

export function CommandInput({ onSendMessage, isLoading }: CommandInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a command..."
        className="pr-20 h-12 text-base"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-16"
        disabled={isLoading}
        aria-label="Send command"
      >
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-background/50 border-t-background rounded-full animate-spin" />
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </>
        )}
      </Button>
    </form>
  );
}
