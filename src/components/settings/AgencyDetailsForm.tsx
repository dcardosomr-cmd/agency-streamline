import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Building2, Mail, Phone, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

export interface AgencyDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  logo?: string;
}

export interface AgencyDetailsFormRef {
  getFormData: () => AgencyDetails;
  validate: () => boolean;
  submit: () => void;
}

interface AgencyDetailsFormProps {
  initialData?: Partial<AgencyDetails>;
  onSave?: (data: AgencyDetails) => void;
  onCancel?: () => void;
  showActions?: boolean;
}

const STORAGE_KEY = "agency_details";

// Load agency details from localStorage
export const loadAgencyDetails = (): AgencyDetails | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load agency details from localStorage:", error);
  }
  return null;
};

// Save agency details to localStorage
export const saveAgencyDetails = (details: AgencyDetails) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  } catch (error) {
    console.error("Failed to save agency details to localStorage:", error);
  }
};

export const AgencyDetailsForm = forwardRef<AgencyDetailsFormRef, AgencyDetailsFormProps>(({ 
  initialData, 
  onSave, 
  onCancel,
  showActions = true 
}, ref) => {
  const [formData, setFormData] = useState<AgencyDetails>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    address: initialData?.address || "",
    description: initialData?.description || "",
    logo: initialData?.logo || "",
  });

  // Load from localStorage if no initial data provided
  useEffect(() => {
    if (!initialData) {
      const saved = loadAgencyDetails();
      if (saved) {
        setFormData(saved);
      }
    }
  }, [initialData]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    validate: () => {
      if (!formData.name || !formData.email) {
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(formData.email);
    },
    submit: () => {
      if (!formData.name || !formData.email) {
        toast.error("Please fill in required fields", {
          description: "Agency name and email are required.",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email address", {
          description: "Please enter a valid email address.",
        });
        return;
      }

      saveAgencyDetails(formData);
      
      if (onSave) {
        onSave(formData);
      } else {
        toast.success("Agency details saved", {
          description: "Your agency information has been updated.",
        });
      }
    },
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill in required fields", {
        description: "Agency name and email are required.",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email address", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    saveAgencyDetails(formData);
    
    if (onSave) {
      onSave(formData);
    } else {
      toast.success("Agency details saved", {
        description: "Your agency information has been updated.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Agency Name */}
        <div className="space-y-2">
          <Label htmlFor="agency-name">
            Agency Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="agency-name"
              placeholder="Your Agency Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="agency-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="agency-email"
              type="email"
              placeholder="contact@agency.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="agency-phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="agency-phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="agency-website">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="agency-website"
              type="url"
              placeholder="https://www.agency.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="agency-address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              id="agency-address"
              placeholder="123 Main St, City, State, ZIP"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="pl-10 min-h-[80px]"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="agency-description">Description</Label>
          <Textarea
            id="agency-description"
            placeholder="Tell us about your agency..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" onClick={(e) => {
            e.preventDefault();
            handleSubmit(e as any);
          }}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
});

AgencyDetailsForm.displayName = "AgencyDetailsForm";

