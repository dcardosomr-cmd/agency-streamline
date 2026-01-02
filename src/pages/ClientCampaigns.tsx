import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types/content";
import { contentService } from "@/services/contentService";
import { CampaignStatusConfig } from "@/lib/lifecycle";
import { Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientCampaigns() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const campaigns = useMemo(() => {
    const all = contentService.getCampaigns();
    if (user?.role === "CLIENT_ADMIN" && user.clientId) {
      return all.filter(c => c.clientId === user.clientId);
    }
    return all;
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">View your company's marketing campaigns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    CampaignStatusConfig[campaign.status]?.bg,
                    CampaignStatusConfig[campaign.status]?.color
                  )}>
                    {CampaignStatusConfig[campaign.status]?.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaign.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                )}
                {campaign.metrics && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Opened</div>
                      <div className="font-semibold">{campaign.metrics.opened?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Clicked</div>
                      <div className="font-semibold">{campaign.metrics.clicked?.toLocaleString()}</div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/campaigns/campaign/${campaign.id}/client`)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

