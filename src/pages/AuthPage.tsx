import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Code2, Eye, EyeOff, Zap, Trophy, Star, BookOpen } from "lucide-react";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    let result;
    if (mode === "signin") {
      result = login(email, password);
    } else {
      if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
      result = signup(name, email, password);
    }
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  const demoAccounts = [
    { label: "User Demo", email: "alice@example.com", pass: "user123", color: "from-violet-500 to-indigo-600" },
    { label: "Admin Demo", email: "admin@codequest.com", pass: "admin123", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-violet-600 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 rounded-xl">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Code<span className="text-violet-400">Quest</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Level Up Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Coding Skills
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Solve challenges, earn points, climb the leaderboard, and become a master programmer.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: Zap, label: "8 Challenges", sub: "Across all levels", color: "text-yellow-400" },
            { icon: Trophy, label: "Leaderboard", sub: "Compete globally", color: "text-orange-400" },
            { icon: Star, label: "Points System", sub: "Earn & level up", color: "text-violet-400" },
            { icon: BookOpen, label: "15 Languages", sub: "Choose your stack", color: "text-green-400" },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Icon className={`w-6 h-6 ${color} mb-2`} />
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-1.5 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Code<span className="text-violet-400">Quest</span></span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            {/* Tabs */}
            <div className="flex bg-gray-800 rounded-xl p-1 mb-8">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === m ? "bg-violet-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <h2 className="text-white text-2xl font-bold mb-1">
              {mode === "signin" ? "Welcome back!" : "Join CodeQuest"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {mode === "signin" ? "Sign in to continue your journey." : "Create an account and start coding."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-gray-600 text-xs text-center mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map(({ label, email: e, pass, color }) => (
                  <button
                    key={label}
                    onClick={() => { setEmail(e); setPassword(pass); setMode("signin"); setError(""); }}
                    className={`bg-gradient-to-r ${color} bg-opacity-10 border border-white/10 text-white text-xs font-medium py-2 px-3 rounded-lg hover:opacity-80 transition-opacity`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
