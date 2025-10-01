import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Loader2 } from "lucide-react";
import { CommandHelp } from "./CommandHelp";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (message.role === "loading") {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
          <AvatarFallback>
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"></span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
          <AvatarFallback>
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-sm rounded-xl px-4 py-3 whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        {message.content}
        {message.type === "command-help" && <CommandHelp />}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 bg-accent/20 text-accent-foreground">
          <AvatarFallback>
            <User className="h-5 w-5 text-accent" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
