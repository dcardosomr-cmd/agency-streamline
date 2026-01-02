import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/content/PerformanceChart";
import { Campaign } from "@/types/content";
import { contentService } from "@/services/contentService";
import { CampaignStatusConfig } from "@/lib/lifecycle";
import { ArrowLeft, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ClientCampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const campaigns = contentService.getCampaigns();
    const found = campaigns.find(c => c.id === parseInt(id || "0"));
    setCampaign(found || null);
  }, [id]);

  if (!campaign) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  const chartData = campaign.dailyMetrics || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/campaigns")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-sm text-muted-foreground mb-1">Sent</div>
                  <div className="text-2xl font-bold">{campaign.metrics.sent?.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-sm text-muted-foreground mb-1">Opened</div>
                  <div className="text-2xl font-bold">{campaign.metrics.opened?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {campaign.metrics.openRate?.toFixed(1)}% open rate
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-sm text-muted-foreground mb-1">Clicked</div>
                  <div className="text-2xl font-bold">{campaign.metrics.clicked?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {campaign.metrics.clickRate?.toFixed(1)}% CTR
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                  <div className="text-2xl font-bold">${campaign.metrics.revenue?.toLocaleString()}</div>
                </div>
              </div>
            )}

            {chartData.length > 0 && (
              <PerformanceChart
                data={chartData.map(dm => ({
                  date: dm.date,
                  opened: dm.opened || 0,
                  clicked: dm.clicked || 0,
                }))}
                metrics={["opened", "clicked"]}
                title="Campaign Performance"
                chartType="line"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

