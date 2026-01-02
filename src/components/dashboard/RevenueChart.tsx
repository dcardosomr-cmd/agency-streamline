import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "@/services/api";
import { DateRange } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportRevenueData, exportChartToPNG } from "@/lib/export";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface RevenueChartProps {
  dateRange: DateRange;
}

export function RevenueChart({ dateRange }: RevenueChartProps) {
  const [showComparison, setShowComparison] = useState(false);
  const queryClient = useQueryClient();

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenueData", dateRange],
    queryFn: () => api.getRevenueData(dateRange, false),
    staleTime: 60000,
  });

  const { data: comparisonData, isLoading: isLoadingComparison } = useQuery({
    queryKey: ["revenueDataWithComparison", dateRange],
    queryFn: () => api.getRevenueData(dateRange, true),
    enabled: showComparison,
    staleTime: 60000,
  });

  const handleExportCSV = () => {
    const dataToExport = showComparison && comparisonData ? comparisonData : revenueData;
    if (dataToExport) {
      exportRevenueData(dataToExport);
    }
  };

  const handleExportPNG = () => {
    exportChartToPNG("revenue-chart", `revenue-chart-${format(new Date(), "yyyy-MM-dd")}.png`);
  };

  const chartData = showComparison && comparisonData ? comparisonData : revenueData;
  const isLoadingChart = isLoading || (showComparison && isLoadingComparison);

  // Calculate overall change if comparison is shown
  const overallChange = chartData && showComparison && comparisonData
    ? comparisonData.reduce((acc, curr, index) => {
        const prev = revenueData?.[index];
        if (prev && curr.previousRevenue) {
          const change = ((curr.revenue - curr.previousRevenue) / curr.previousRevenue) * 100;
          return acc + change;
        }
        return acc;
      }, 0) / (comparisonData.length || 1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-card rounded-xl overflow-hidden h-full"
      id="revenue-chart"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(dateRange.start, "MMM d")} - {format(dateRange.end, "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="gap-2"
            >
              {showComparison ? (
                <>
                  <ToggleRight className="w-4 h-4" />
                  Comparison
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  Compare
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCSV}
              className="gap-2"
              disabled={!chartData}
            >
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportPNG}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              PNG
            </Button>
          </div>
        </div>
        {overallChange !== null && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium mt-2",
            overallChange >= 0 ? "text-success" : "text-destructive"
          )}>
            {overallChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {overallChange >= 0 ? "+" : ""}
            {overallChange.toFixed(1)}% vs previous period
          </div>
        )}
      </div>

      <div className="p-5 h-[280px]">
        {isLoadingChart ? (
          <Skeleton className="w-full h-full" />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                {showComparison && (
                  <linearGradient id="previousRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(215, 20%, 55%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(215, 20%, 55%)" stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 20%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)', fontWeight: 600 }}
                formatter={(value: number, name: string, props: any) => {
                  const formattedValue = `$${value.toLocaleString()}`;
                  if (showComparison && name === "Previous Period" && props.payload.previousRevenue !== undefined) {
                    const change = props.payload.previousRevenue > 0
                      ? ((value - props.payload.previousRevenue) / props.payload.previousRevenue * 100).toFixed(1)
                      : "0";
                    return [formattedValue, `${name} (${change >= "0" ? "+" : ""}${change}%)`];
                  }
                  return [formattedValue, name];
                }}
              />
              {showComparison && (
                <>
                  <Area
                    type="monotone"
                    dataKey="previousRevenue"
                    stroke="hsl(215, 20%, 55%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#previousRevenueGradient)"
                    name="Previous Period"
                  />
                  <Legend />
                </>
              )}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No revenue data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
