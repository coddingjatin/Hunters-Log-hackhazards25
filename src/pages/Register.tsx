import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [characterClass, setCharacterClass] = useState("Rookie Hunter");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(username, email, password, characterClass);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('public/regiss.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="w-full max-w-md p-8 solo-card animate-fade-in z-10 relative backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center mb-4 solo-glow-text tracking-wider">
          Become A Hunter
        </h1>
        <p className="text-center mb-8 text-slate-300">
          Register to begin your leveling journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter Hunter Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="solo-input w-full bg-black/70"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter System ID (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="solo-input w-full bg-black/70"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Create Access Code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="solo-input w-full bg-black/70"
            />
          </div>

          <div className="space-y-2">
            <Select value={characterClass} onValueChange={setCharacterClass}>
              <SelectTrigger className="solo-input w-full bg-black/70">
                <SelectValue placeholder="Select Hunter Type" />
              </SelectTrigger>
              <SelectContent className="bg-solo-dark border-solo-blue">
                <SelectItem value="Rookie Hunter">Rookie Hunter</SelectItem>
                <SelectItem value="Mage Hunter">Mage Hunter</SelectItem>
                <SelectItem value="Assassin Hunter">Assassin Hunter</SelectItem>
                <SelectItem value="Shadow Monarch">Shadow Monarch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full solo-button"
          >
            {isLoading ? "Processing..." : "Arise as Hunter"}
          </Button>

          <p className="text-xs text-center text-slate-400">
            By registering, you agree to the Hunter Association terms.
          </p>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Already a registered Hunter? </span>
          <Link
            to="/login"
            className="text-solo-cyan hover:text-solo-blue transition-colors"
          >
            Login to System
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
