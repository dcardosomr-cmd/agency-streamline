/**
 * Export utilities for dashboard data
 */

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string = "export.csv") {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    )
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export chart to PNG
 * @param chartId - The ID of the chart container element
 * @param filename - The filename for the exported image
 */
export async function exportChartToPNG(chartId: string, filename: string = "chart.png") {
  const element = document.getElementById(chartId);
  if (!element) {
    console.warn(`Element with id "${chartId}" not found`);
    return;
  }

  try {
    // Use html2canvas if available, otherwise fallback to basic canvas
    const html2canvas = (window as any).html2canvas;
    
    if (html2canvas) {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      });
      
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    } else {
      // Fallback: try to get SVG and convert
      const svg = element.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename.replace(".png", ".svg"));
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.warn("html2canvas not available and no SVG found");
      }
    }
  } catch (error) {
    console.error("Error exporting chart:", error);
  }
}

/**
 * Export revenue data to CSV
 */
export function exportRevenueData(data: { month: string; revenue: number; previousRevenue?: number }[]) {
  const csvData = data.map(item => ({
    Month: item.month,
    Revenue: `$${item.revenue.toLocaleString()}`,
    ...(item.previousRevenue !== undefined && {
      "Previous Period": `$${item.previousRevenue.toLocaleString()}`,
      "Change": `${((item.revenue - item.previousRevenue) / item.previousRevenue * 100).toFixed(1)}%`,
    }),
  }));
  
  exportToCSV(csvData, `revenue-export-${new Date().toISOString().split("T")[0]}.csv`);
}

