import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem("soloLevelingRememberEmail", email);
      } else {
        localStorage.removeItem("soloLevelingRememberEmail");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("soloLevelingRememberEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('public/loginn.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="w-full max-w-md p-8 solo-card animate-fade-in z-10 relative backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center mb-8 solo-glow-text tracking-wider">
          HUNTER'S LOG
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your System ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="solo-input w-full bg-black/70"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Access Code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="solo-input w-full bg-black/70"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="rememberMe" className="text-sm text-slate-300">
              Remember my System ID
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full solo-button"
          >
            {isLoading ? "Authenticating..." : "Login to System"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-solo-cyan hover:text-solo-blue transition-colors"
          >
            Forgot access code?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          <span className="text-slate-400">Not registered in the system? </span>
          <Link
            to="/register"
            className="text-solo-cyan hover:text-solo-blue transition-colors"
          >
            Register as Hunter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
