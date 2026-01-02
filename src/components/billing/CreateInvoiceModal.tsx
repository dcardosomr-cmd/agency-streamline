import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Calendar,
  DollarSign,
  FileText,
  ChevronDown,
  Send,
  Plus,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const clients = [
  "TechCorp Industries",
  "Green Solutions Ltd",
  "Nova Ventures",
  "Atlas Media Group",
  "Urban Development Co",
];

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleSubmit = () => {
    // Here you would typically send the data to your API
    console.log({
      client: selectedClient,
      invoiceDate,
      dueDate,
      notes,
      items,
      subtotal,
      tax,
      total,
    });
    // Reset form and close modal
    setSelectedClient(clients[0]);
    setInvoiceDate("");
    setDueDate("");
    setNotes("");
    setItems([{ description: "", quantity: 1, rate: 0 }]);
    onClose();
  };

  const isFormValid = selectedClient && invoiceDate && dueDate && 
    items.every(item => item.description.trim() && item.quantity > 0 && item.rate >= 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container - Centers the modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Create New Invoice</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Client Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Client <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-lg bg-secondary border-0 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {clients.map(client => (
                        <option key={client} value={client}>{client}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Invoice Date and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Invoice Date <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Due Date <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">
                      Items <span className="text-destructive">*</span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addItem}
                      className="gap-1.5 h-8 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-12 gap-2">
                          <div className="col-span-12 md:col-span-6">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(index, "description", e.target.value)}
                              placeholder="Item description"
                              className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                              placeholder="Qty"
                              min="0"
                              step="1"
                              className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <div className="col-span-8 md:col-span-3">
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                                placeholder="Rate"
                                min="0"
                                step="0.01"
                                className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>
                          </div>
                          <div className="col-span-4 md:col-span-1 flex items-center justify-end">
                            <span className="text-sm font-medium text-foreground">
                              ${(item.quantity * item.rate).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="h-10 w-10 shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or terms..."
                    className="w-full h-24 p-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/50">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                  Create Invoice
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

