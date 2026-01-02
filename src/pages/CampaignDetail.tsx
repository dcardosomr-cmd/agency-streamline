import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/content/PerformanceChart";
import { TimelineActivity } from "@/components/content/TimelineActivity";
import { CommentsSection } from "@/components/content/CommentsSection";
import { Campaign, ContentComment } from "@/types/content";
import { contentService } from "@/services/contentService";
import { CampaignStatusConfig } from "@/lib/lifecycle";
import { ArrowLeft, Edit, Trash2, Download, Pause, Play, FileText, ExternalLink, Copy } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const campaigns = contentService.getCampaigns();
    const foundCampaign = campaigns.find(c => c.id === parseInt(id || "0"));
    setCampaign(foundCampaign || null);
    setIsLoading(false);
  }, [id]);

  const handleAddComment = (content: string) => {
    if (!campaign) return;
    const newComment: ContentComment = {
      id: `comment-${Date.now()}`,
      author: "Current User",
      authorId: "current-user",
      content,
      timestamp: new Date().toISOString(),
    };
    setCampaign({
      ...campaign,
      comments: [...(campaign.comments || []), newComment],
    });
  };

  if (isLoading || !campaign) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  const metrics = campaign.metrics;
  const dailyMetrics = campaign.dailyMetrics || [];

  // Prepare chart data
  const chartData = dailyMetrics.map(dm => ({
    date: dm.date,
    opened: dm.opened || 0,
    clicked: dm.clicked || 0,
    revenue: dm.revenue || 0,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/campaigns")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {can(Permission.CREATE_CONTENT) && (
              <>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                {campaign.status === "active" && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                )}
                {campaign.status === "scheduled" && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="w-4 h-4" />
                    Resume
                  </Button>
                )}
                <Button variant="outline" size="sm" className="gap-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Type</div>
                    <div className="font-medium text-foreground capitalize">{campaign.type || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <span className={cn(
                      "px-2 py-1 rounded text-sm font-medium",
                      CampaignStatusConfig[campaign.status]?.bg,
                      CampaignStatusConfig[campaign.status]?.color
                    )}>
                      {CampaignStatusConfig[campaign.status]?.label}
                    </span>
                  </div>
                  {campaign.emailDetails && (
                    <>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Subject</div>
                        <div className="font-medium text-foreground">{campaign.emailDetails.subject}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">From</div>
                        <div className="font-medium text-foreground">
                          {campaign.emailDetails.fromName} &lt;{campaign.emailDetails.fromEmail}&gt;
                        </div>
                      </div>
                    </>
                  )}
                  {campaign.scheduledSendDate && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Scheduled</div>
                      <div className="font-medium text-foreground">
                        {format(new Date(campaign.scheduledSendDate), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  )}
                  {campaign.sentAt && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Sent</div>
                      <div className="font-medium text-foreground">
                        {format(new Date(campaign.sentAt), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  )}
                </div>

                {campaign.emailDetails && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Preview Email
                    </Button>
                    {campaign.emailDetails.attachments && campaign.emailDetails.attachments.length > 0 && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        View PDF
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Copy Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Dashboard */}
            {metrics && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Sent</div>
                        <div className="text-2xl font-bold">{metrics.sent?.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Opened</div>
                        <div className="text-2xl font-bold">{metrics.opened?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {metrics.openRate?.toFixed(1)}% open rate
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Clicked</div>
                        <div className="text-2xl font-bold">{metrics.clicked?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {metrics.clickRate?.toFixed(1)}% CTR
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                        <div className="text-2xl font-bold">${metrics.revenue?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {metrics.conversionRate?.toFixed(1)}% conversion
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Delivered</div>
                        <div className="text-xl font-bold">{metrics.delivered?.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Bounce Rate</div>
                        <div className="text-xl font-bold">{metrics.bounceRate?.toFixed(1)}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Unsubscribed</div>
                        <div className="text-xl font-bold">{metrics.unsubscribed}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">ROI</div>
                        <div className="text-xl font-bold">{metrics.roi?.toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Chart */}
                {chartData.length > 0 && (
                  <PerformanceChart
                    data={chartData}
                    metrics={["opened", "clicked", "revenue"]}
                    title="Performance Over Time"
                    chartType="line"
                  />
                )}

                {/* Daily Metrics Table */}
                {dailyMetrics.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead>Opened</TableHead>
                            <TableHead>Clicked</TableHead>
                            <TableHead>Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dailyMetrics.map((dm, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{format(new Date(dm.date), "MMM d, yyyy")}</TableCell>
                              <TableCell>{dm.sent?.toLocaleString() || 0}</TableCell>
                              <TableCell>{dm.opened?.toLocaleString() || 0}</TableCell>
                              <TableCell>{dm.clicked?.toLocaleString() || 0}</TableCell>
                              <TableCell>${dm.revenue?.toLocaleString() || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Timeline */}
            {campaign.timeline && campaign.timeline.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <TimelineActivity timeline={campaign.timeline} />
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            {campaign.comments !== undefined && (
              <Card>
                <CardContent className="pt-6">
                  <CommentsSection
                    comments={campaign.comments}
                    onAddComment={handleAddComment}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Client</div>
                  <div className="font-medium text-foreground">{campaign.client}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Progress</div>
                  <div className="font-medium text-foreground">{campaign.progress}%</div>
                </div>
                {campaign.budget && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Budget</div>
                    <div className="font-medium text-foreground">${campaign.budget.toLocaleString()}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                  <div className="font-medium text-foreground">
                    {format(new Date(campaign.dueDate), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

