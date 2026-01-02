import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Building2, 
  Plus, 
  X, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { UserRole, ROLE_DISPLAY_NAMES } from "@/types/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgencyDetailsForm, AgencyDetails, saveAgencyDetails, AgencyDetailsFormRef } from "@/components/settings/AgencyDetailsForm";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agencyDetails, setAgencyDetails] = useState<AgencyDetails | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    role: UserRole.AGENCY_STAFF,
  });
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "",
  });
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const agencyFormRef = useRef<AgencyDetailsFormRef>(null);

  const handleAddTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.email) {
      toast.error("Please fill in all fields");
      return;
    }

    const member: TeamMember = {
      id: `member-${Date.now()}`,
      ...newTeamMember,
    };

    setTeamMembers([...teamMembers, member]);
    setNewTeamMember({ name: "", email: "", role: UserRole.AGENCY_STAFF });
    toast.success("Team member added");
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast.success("Team member removed");
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const client: Client = {
      id: `client-${Date.now()}`,
      ...newClient,
    };

    setClients([...clients, client]);
    setNewClient({ name: "", email: "", phone: "", industry: "" });
    toast.success("Client added");
  };

  const handleRemoveClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    toast.success("Client removed");
  };

  const handleAgencyDetailsSave = (data: AgencyDetails) => {
    setAgencyDetails(data);
    saveAgencyDetails(data);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Step 1: Agency Details - handled by form submit
      return;
    } else if (currentStep === 2) {
      // Step 2: Add team members (optional, can skip)
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Step 3: Add clients (optional, can skip)
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep === 1) {
      // Can't skip agency details - required
      return;
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    // Agency details should already be saved, but ensure it's saved
    if (agencyDetails) {
      saveAgencyDetails(agencyDetails);
    }

    // Save team members and clients to localStorage
    if (teamMembers.length > 0) {
      localStorage.setItem(`team_members_${user?.id}`, JSON.stringify(teamMembers));
    }
    if (clients.length > 0) {
      localStorage.setItem(`clients_${user?.id}`, JSON.stringify(clients));
    }

    // Update user to mark onboarding as complete
    const users = JSON.parse(localStorage.getItem("agency_users") || "[]");
    const updatedUsers = users.map((u: any) => 
      u.id === user?.id 
        ? { ...u, hasCompletedOnboarding: true }
        : u
    );
    localStorage.setItem("agency_users", JSON.stringify(updatedUsers));

    if (user) {
      setUser({
        ...user,
        hasCompletedOnboarding: true,
      });
    }

    toast.success("Onboarding completed!", {
      description: "Welcome to AgencyHub!",
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className="font-medium hidden sm:inline">Agency Details</span>
            </div>
            <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span className="font-medium hidden sm:inline">Team</span>
            </div>
            <div className={`w-12 h-1 ${currentStep >= 3 ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                3
              </div>
              <span className="font-medium hidden sm:inline">Clients</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-xl p-8"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Agency Details</h2>
                  <p className="text-muted-foreground">
                    Let's start by setting up your agency information. This will help personalize your experience.
                  </p>
                </div>

                <AgencyDetailsForm
                  ref={agencyFormRef}
                  initialData={agencyDetails || undefined}
                  onSave={handleAgencyDetailsSave}
                  showActions={false}
                />

                {/* Navigation */}
                <div className="flex items-center justify-end pt-4 border-t border-border">
                  <Button 
                    onClick={() => {
                      if (agencyFormRef.current) {
                        agencyFormRef.current.submit();
                      }
                    }}
                    className="gap-2"
                  >
                    Next: Add Team
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Add Team Members</h2>
                  <p className="text-muted-foreground">
                    Invite your team members to collaborate. You can skip this step and add them later.
                  </p>
                </div>

                {/* Add Team Member Form */}
                <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-dashed">
                  <h3 className="font-semibold text-foreground">Add New Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Name</Label>
                      <Input
                        id="member-name"
                        placeholder="John Doe"
                        value={newTeamMember.name}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email</Label>
                      <Input
                        id="member-email"
                        type="email"
                        placeholder="john@example.com"
                        value={newTeamMember.email}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-role">Role</Label>
                      <Select
                        value={newTeamMember.role}
                        onValueChange={(value) => setNewTeamMember({ ...newTeamMember, role: value as UserRole })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.AGENCY_STAFF}>
                            {ROLE_DISPLAY_NAMES[UserRole.AGENCY_STAFF]}
                          </SelectItem>
                          <SelectItem value={UserRole.AGENCY_ADMIN}>
                            {ROLE_DISPLAY_NAMES[UserRole.AGENCY_ADMIN]}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="gap-2"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                    Add Team Member
                  </Button>
                </div>

                {/* Team Members List */}
                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Team Members ({teamMembers.length})</h3>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{ROLE_DISPLAY_NAMES[member.role]}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip
                    </Button>
                    <Button onClick={handleNext} className="gap-2">
                      Next: Add Clients
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Add Clients</h2>
                  <p className="text-muted-foreground">
                    Add your clients to get started. You can skip this step and add them later.
                  </p>
                </div>

                {/* Add Client Form */}
                <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-dashed">
                  <h3 className="font-semibold text-foreground">Add New Client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client-name"
                          placeholder="TechCorp Industries"
                          value={newClient.name}
                          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client-email"
                          type="email"
                          placeholder="contact@company.com"
                          value={newClient.email}
                          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Phone (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client-phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-industry">Industry (Optional)</Label>
                      <Input
                        id="client-industry"
                        placeholder="Technology"
                        value={newClient.industry}
                        onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddClient}
                    className="gap-2"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                    Add Client
                  </Button>
                </div>

                {/* Clients List */}
                {clients.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Clients ({clients.length})</h3>
                    <div className="space-y-2">
                      {clients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveClient(client.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip
                    </Button>
                    <Button onClick={handleComplete} className="gap-2">
                      Complete Setup
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Onboarding;

