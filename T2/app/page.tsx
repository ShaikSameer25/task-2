import { BotMessageSquare } from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8 bg-muted/40">
      <Card className="w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col shadow-2xl rounded-2xl">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-3 text-primary">
            <BotMessageSquare className="h-8 w-8" />
            <span className="font-headline text-2xl font-bold">DriveChat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <ChatInterface />
        </CardContent>
      </Card>
    </main>
  );
}
