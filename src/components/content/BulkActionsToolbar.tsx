import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trash2, Download, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  className?: string;
}

export function BulkActionsToolbar({
  selectedCount,
  onSelectAll,
  onApprove,
  onReject,
  onDelete,
  onExport,
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg",
      className
    )}>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="text-sm"
        >
          Select All
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {onApprove && (
          <Button
            variant="outline"
            size="sm"
            onClick={onApprove}
            className="gap-2 text-success hover:text-success"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Selected
          </Button>
        )}
        {onReject && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <XCircle className="w-4 h-4" />
            Reject Selected
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Selected
          </Button>
        )}
      </div>
    </div>
  );
}

