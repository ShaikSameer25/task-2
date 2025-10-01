"use client";

import { useState, useEffect, useRef, useId } from "react";
import type { Message } from "@/lib/types";
import { handleCommand } from "@/app/actions";
import { ChatMessage } from "./ChatMessage";
import { CommandInput } from "./CommandInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandHelp } from "./CommandHelp";

export function ChatInterface() {
  const id = useId();
  const messageIdCounter = useRef(0);
  const getUniqueMessageId = () => `${id}-${messageIdCounter.current++}`;
  
  const initialMessage: Message = {
    id: getUniqueMessageId(),
    role: "system",
    content: "Welcome to DriveChat! You can manage your Google Drive with commands.",
    type: "command-help",
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: Message = {
      id: getUniqueMessageId(),
      role: "user",
      content: text,
    };

    const loadingMessage: Message = {
      id: getUniqueMessageId(),
      role: "loading",
      content: "...",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await handleCommand(text);
      const systemMessage: Message = {
        id: getUniqueMessageId(),
        role: "system",
        content: response.message,
      };

      setMessages((prev) => [
        ...prev.filter((msg) => msg.role !== "loading"),
        systemMessage,
      ]);
    } catch (error) {
      const errorMessage: Message = {
        id: getUniqueMessageId(),
        role: "system",
        content: "An error occurred while processing your command.",
      };
      setMessages((prev) => [
        ...prev.filter((msg) => msg.role !== "loading"),
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <CommandInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
