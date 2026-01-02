import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Media",
  "Real Estate",
  "Sustainability",
  "Retail",
  "Manufacturing",
  "Education",
  "Other"
];

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    industry: string;
  }) => void;
}

export function CreateClientModal({ isOpen, onClose, onAddClient }: CreateClientModalProps) {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState(industries[0]);

  const handleSubmit = () => {
    if (!clientName.trim() || !email.trim()) {
      return;
    }
    
    // Call the onAddClient callback with the new client data
    onAddClient({
      name: clientName,
      email,
      phone,
      address,
      industry,
    });
    
    // Reset form and close modal
    setClientName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setIndustry(industries[0]);
    onClose();
  };

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
              className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Add New Client</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Client Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Client Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Industry
                </label>
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-secondary border-0 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter client address..."
                    className="w-full h-24 p-3 pl-10 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/50">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!clientName.trim() || !email.trim()}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4" />
                Add Client
              </Button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

