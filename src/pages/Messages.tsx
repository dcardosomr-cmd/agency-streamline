import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Conversation, Message } from "@/types/content";
import { contentService } from "@/services/contentService";
import { Paperclip, Send, Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const conversations = useMemo(() => contentService.getConversations(), []);
  const messages = useMemo(() => {
    if (!selectedConversation) return [];
    return contentService.getMessages(selectedConversation);
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    toast.success("Message sent");
    setMessageText("");
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-foreground">Conversations</h2>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-secondary/50 transition-colors",
                    selectedConversation === conv.id && "bg-secondary"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-foreground">{conv.clientName}</div>
                    {conv.unreadCount && conv.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {conv.lastMessageAt && (
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(conv.lastMessageAt), "MMM d, h:mm a")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-foreground">
                    {conversations.find(c => c.id === selectedConversation)?.clientName}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
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
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

