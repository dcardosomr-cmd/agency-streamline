import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types/content";
import { contentService } from "@/services/contentService";
import { Paperclip, Send, Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

export default function ClientMessages() {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  
  // Get agency conversation (simplified - in real app would filter by client)
  const agencyConversationId = "conv-1";
  const messages = useMemo(() => {
    return contentService.getMessages(agencyConversationId);
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    toast.success("Message sent");
    setMessageText("");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="flex flex-col h-[calc(100vh-200px)]">
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-foreground">Messages with Agency Team</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isOwn = msg.senderRole === "client";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      isOwn && "flex-row-reverse"
                    )}
                  >
                    <div className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      isOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    )}>
                      <div className="text-sm mb-1">{msg.content}</div>
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <span>{format(new Date(msg.sentAt || new Date()), "h:mm a")}</span>
                        {isOwn && (
                          <span>
                            {msg.readAt ? (
                              <CheckCheck className="w-3 h-3 inline" />
                            ) : (
                              <Check className="w-3 h-3 inline" />
                            )}
                          </span>
                        )}
                      </div>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((att) => (
                            <a
                              key={att.id}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline block"
                            >
                              {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

