import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Plus, CheckCircle2, AlertCircle, Info, Users, FolderKanban, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// Search data - matching the data from pages
const searchClients = [
  { id: 1, name: "TechCorp Industries", type: "client", route: "/clients" },
  { id: 2, name: "Green Solutions Ltd", type: "client", route: "/clients" },
  { id: 3, name: "Nova Ventures", type: "client", route: "/clients" },
  { id: 4, name: "Atlas Media Group", type: "client", route: "/clients" },
  { id: 5, name: "Pinnacle Health", type: "client", route: "/clients" },
  { id: 6, name: "Urban Development Co", type: "client", route: "/clients" },
];

const searchProjects = [
  { id: 1, name: "Q1 Brand Campaign", client: "TechCorp Industries", type: "project", route: "/projects" },
  { id: 2, name: "Social Media Strategy", client: "Green Solutions Ltd", type: "project", route: "/projects" },
  { id: 3, name: "Website Redesign", client: "Nova Ventures", type: "project", route: "/projects" },
  { id: 4, name: "Email Marketing Series", client: "Atlas Media Group", type: "project", route: "/projects" },
  { id: 5, name: "Product Launch Campaign", client: "TechCorp Industries", type: "project", route: "/projects" },
  { id: 6, name: "Annual Report Design", client: "Urban Development Co", type: "project", route: "/projects" },
];

const searchCampaigns = [
  { id: 1, name: "Q1 product launch", client: "TechCorp Industries", type: "campaign", route: "/campaigns" },
  { id: 2, name: "Sustainability tip", client: "Green Solutions Ltd", type: "campaign", route: "/campaigns" },
  { id: 3, name: "Campaign shoot", client: "Atlas Media Group", type: "campaign", route: "/campaigns" },
  { id: 4, name: "Future of Fintech", client: "Nova Ventures", type: "campaign", route: "/campaigns" },
];

type SearchResult = {
  id: number;
  name: string;
  client?: string;
  type: "client" | "project" | "campaign";
  route: string;
};

export function Header() {
  const navigate = useNavigate();
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Filter search results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Filter clients
    searchClients.forEach(client => {
      if (client.name.toLowerCase().includes(query)) {
        results.push(client);
      }
    });

    // Filter projects
    searchProjects.forEach(project => {
      if (
        project.name.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query)
      ) {
        results.push(project);
      }
    });

    // Filter campaigns
    searchCampaigns.forEach(campaign => {
      if (
        campaign.name.toLowerCase().includes(query) ||
        campaign.client.toLowerCase().includes(query)
      ) {
        results.push(campaign);
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(e.target.value.length > 0);
    setSelectedIndex(0);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Cmd+K or Ctrl+K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    if (!isSearchOpen || filteredResults.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.route);
    setIsSearchOpen(false);
    setSearchQuery("");
    searchInputRef.current?.blur();
  };

  const handleFocus = () => {
    if (searchQuery.length > 0) {
      setIsSearchOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow click events to fire
    setTimeout(() => {
      if (!searchResultsRef.current?.contains(document.activeElement)) {
        setIsSearchOpen(false);
      }
    }, 200);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "client":
        return Users;
      case "project":
        return FolderKanban;
      case "campaign":
        return Megaphone;
      default:
        return Search;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "client":
        return "Client";
      case "project":
        return "Project";
      case "campaign":
        return "Campaign";
      default:
        return "";
    }
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="h-full flex items-center justify-between px-6">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search clients, projects, campaigns..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full h-10 pl-10 pr-20 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground font-mono pointer-events-none">
              ⌘K
            </kbd>

            {/* Search Results Dropdown */}
            {isSearchOpen && filteredResults.length > 0 && (
              <div
                ref={searchResultsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto"
              >
                <div className="p-2">
                  {filteredResults.map((result, index) => {
                    const Icon = getTypeIcon(result.type);
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-foreground truncate">
                              {result.name}
                            </span>
                            <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-muted-foreground shrink-0">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          {result.client && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {result.client}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {isSearchOpen && searchQuery.length > 0 && filteredResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Project Approved</p>
                    <p className="text-xs text-muted-foreground mt-1">TechCorp Industries project has been approved</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Campaign Review Needed</p>
                    <p className="text-xs text-muted-foreground mt-1">New campaign requires your review</p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                  <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">New Client Added</p>
                    <p className="text-xs text-muted-foreground mt-1">Green Solutions Ltd has been added</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="justify-center cursor-pointer"
                  onSelect={() => {
                    navigate('/notifications');
                  }}
                >
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen} 
        onClose={() => setIsCreateProjectModalOpen(false)} 
      />
    </>
  );
}
