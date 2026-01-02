import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { UserRole } from "@/types/auth";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("agency_users") || "[]");
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);

      if (!user) {
        toast.error("Invalid credentials", {
          description: "Please check your email and password.",
        });
        setIsLoading(false);
        return;
      }

      // Set user and check if onboarding is needed
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clientId: user.clientId,
        initials: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        hasCompletedOnboarding: user.hasCompletedOnboarding || false,
      };

      setUser(userData);

      // Redirect based on onboarding status
      if (!userData.hasCompletedOnboarding) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords match.",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get existing users
      const users = JSON.parse(localStorage.getItem("agency_users") || "[]");
      
      // Check if email already exists
      if (users.some((u: any) => u.email === formData.email)) {
        toast.error("Email already registered", {
          description: "Please use a different email or login.",
        });
        setIsLoading(false);
        return;
      }

      // Create new user - default to Agency Admin for new signups
      const newUser = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password, // In production, this would be hashed
        role: UserRole.AGENCY_ADMIN, // All new signups are Agency Admins
        companyName: formData.companyName,
        hasCompletedOnboarding: false,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem("agency_users", JSON.stringify(users));

      // Set user and redirect to onboarding
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        initials: newUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        hasCompletedOnboarding: false,
      };

      setUser(userData);
      toast.success("Account created successfully", {
        description: "Welcome! Let's get you started.",
      });
      navigate("/onboarding");
    } catch (error) {
      toast.error("Sign up failed", {
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AgencyHub</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-8"
        >
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Your Agency Name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Please wait..."
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  companyName: "",
                });
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-primary font-medium">Sign in</span></>
              ) : (
                <>Don't have an account? <span className="text-primary font-medium">Sign up</span></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

