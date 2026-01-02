import { useState } from "react";
import { ContentComment } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface CommentsSectionProps {
  comments: ContentComment[];
  onAddComment: (content: string) => void;
  className?: string;
}

export function CommentsSection({ comments, onAddComment, className }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    onAddComment(newComment);
    setNewComment("");
    toast.success("Comment added");
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Comments ({comments.length})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-medium text-foreground">{comment.author}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {format(new Date(comment.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              {comment.editedAt && (
                <span className="text-xs text-muted-foreground">Edited</span>
              )}
            </div>
            <p className="text-sm text-foreground">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" className="gap-2" disabled={!user}>
          <Send className="w-4 h-4" />
          Add Comment
        </Button>
      </form>
    </div>
  );
}

