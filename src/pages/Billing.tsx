import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";
import { 
  Plus, 
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Send,
  MoreHorizontal,
  ExternalLink,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const invoices = [
  {
    id: "INV-2026-001",
    client: "TechCorp Industries",
    amount: 12500,
    status: "paid",
    dueDate: "Jan 15, 2026",
    paidDate: "Jan 12, 2026",
    items: 3,
  },
  {
    id: "INV-2026-002",
    client: "Green Solutions Ltd",
    amount: 8200,
    status: "pending",
    dueDate: "Jan 20, 2026",
    paidDate: null,
    items: 2,
  },
  {
    id: "INV-2025-089",
    client: "Nova Ventures",
    amount: 4500,
    status: "overdue",
    dueDate: "Dec 28, 2025",
    paidDate: null,
    items: 1,
  },
  {
    id: "INV-2025-088",
    client: "Atlas Media Group",
    amount: 18750,
    status: "paid",
    dueDate: "Dec 20, 2025",
    paidDate: "Dec 18, 2025",
    items: 5,
  },
  {
    id: "INV-2026-003",
    client: "Urban Development Co",
    amount: 15600,
    status: "draft",
    dueDate: "Jan 25, 2026",
    paidDate: null,
    items: 4,
  },
  {
    id: "INV-2025-087",
    client: "TechCorp Industries",
    amount: 9800,
    status: "paid",
    dueDate: "Dec 10, 2025",
    paidDate: "Dec 8, 2025",
    items: 2,
  },
];

const statusConfig = {
  draft: { icon: FileText, color: "text-muted-foreground", bg: "bg-muted", label: "Draft" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  paid: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Paid" },
  overdue: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Overdue" },
};

const Billing = () => {
  const [filter, setFilter] = useState<string>("all");
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);

  const filteredInvoices = filter === "all" 
    ? invoices 
    : invoices.filter(i => i.status === filter);

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  const handleSendInvoice = useCallback((invoice: typeof invoices[0]) => {
    console.log(`Sending invoice ${invoice.id}`);
    alert(`Send invoice functionality will be implemented for ${invoice.id}`);
  }, []);

  const handleViewInvoice = useCallback((invoice: typeof invoices[0]) => {
    console.log(`Viewing invoice ${invoice.id}`);
    alert(`View invoice functionality will be implemented for ${invoice.id}`);
  }, []);

  const handleMoreOptions = useCallback((invoice: typeof invoices[0]) => {
    console.log(`More options for invoice ${invoice.id}`);
    alert(`More options functionality will be implemented for ${invoice.id}`);
  }, []);

  const handleDownloadInvoice = (invoice: typeof invoices[0]) => {
    // Generate invoice HTML content
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      color: #333;
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .info-section {
      flex: 1;
    }
    .info-section h3 {
      margin-top: 0;
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .total {
      text-align: right;
      margin-top: 20px;
    }
    .total-row {
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #000;
      padding-top: 10px;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-paid { background-color: #d4edda; color: #155724; }
    .status-pending { background-color: #fff3cd; color: #856404; }
    .status-overdue { background-color: #f8d7da; color: #721c24; }
    .status-draft { background-color: #e2e3e5; color: #383d41; }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <p style="font-size: 24px; font-weight: bold; margin: 0;">${invoice.id}</p>
  </div>
  
  <div class="invoice-info">
    <div class="info-section">
      <h3>Bill To:</h3>
      <p style="font-weight: bold; margin: 5px 0;">${invoice.client}</p>
    </div>
    <div class="info-section" style="text-align: right;">
      <h3>Invoice Details:</h3>
      <p style="margin: 5px 0;"><strong>Due Date:</strong> ${invoice.dueDate}</p>
      ${invoice.paidDate ? `<p style="margin: 5px 0;"><strong>Paid Date:</strong> ${invoice.paidDate}</p>` : ''}
      <p style="margin: 5px 0;">
        <strong>Status:</strong> 
        <span class="status status-${invoice.status}">${statusConfig[invoice.status as keyof typeof statusConfig]?.label || invoice.status}</span>
      </p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Invoice Items (${invoice.items} items)</td>
        <td style="text-align: right;">$${invoice.amount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="total">
    <div class="total-row">
      <span>Total Amount: $${invoice.amount.toLocaleString()}</span>
    </div>
  </div>
  
  <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
    <p>Thank you for your business!</p>
  </div>
</body>
</html>
    `;

    // Create a blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoice.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing & Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage invoices and track payments</p>
          </div>
          <Button 
            onClick={() => setIsCreateInvoiceModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Revenue (This Month)</span>
            </div>
            <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Pending Payments</span>
            </div>
            <p className="text-2xl font-bold text-foreground">${pendingAmount.toLocaleString()}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">${overdueAmount.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["all", "draft", "pending", "paid", "overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig]?.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-4 text-sm font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="text-right px-5 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => {
                  const status = statusConfig[invoice.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;

                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + index * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">{invoice.items} items</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-foreground">{invoice.client}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">${invoice.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.bg, status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-muted-foreground">{invoice.dueDate}</p>
                        {invoice.paidDate && (
                          <p className="text-xs text-success">Paid: {invoice.paidDate}</p>
                        )}
                      </td>
                      <td className="px-5 py-4" style={{ position: 'relative', zIndex: 10 }}>
                        <div className="flex items-center justify-end gap-1" style={{ position: 'relative', zIndex: 11 }}>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 cursor-pointer"
                            style={{ position: 'relative', zIndex: 12, pointerEvents: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDownloadInvoice(invoice);
                            }}
                            title="Download invoice"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status === "pending" && (
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 cursor-pointer"
                              style={{ position: 'relative', zIndex: 12, pointerEvents: 'auto' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleSendInvoice(invoice);
                              }}
                              title="Send invoice"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 cursor-pointer"
                            style={{ position: 'relative', zIndex: 12, pointerEvents: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleViewInvoice(invoice);
                            }}
                            title="View invoice"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 cursor-pointer"
                            style={{ position: 'relative', zIndex: 12, pointerEvents: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleMoreOptions(invoice);
                            }}
                            title="More options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal 
        isOpen={isCreateInvoiceModalOpen}
        onClose={() => setIsCreateInvoiceModalOpen(false)}
      />
    </AppLayout>
  );
};

export default Billing;
