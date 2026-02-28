import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Code2, LogOut, Menu, X, Trophy, LayoutDashboard, BookOpen, Users, Settings, Star } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "challenges", label: "Challenges", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const adminLinks = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-users", label: "Users", icon: Users },
    { id: "admin-challenges", label: "Challenges", icon: BookOpen },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const links = currentUser?.role === "admin" ? adminLinks : userLinks;

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage(currentUser?.role === "admin" ? "admin-dashboard" : "dashboard")}>
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-1.5 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Code<span className="text-violet-400">Quest</span>
            </span>
            {currentUser?.role === "admin" && (
              <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === id
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser?.role === "user" && (
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">{currentUser.points.toLocaleString()}</span>
                <span className="text-gray-500 text-xs">pts</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.avatar}
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium leading-none">{currentUser?.name}</p>
                <p className="text-gray-500 text-xs capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors px-2 py-2 rounded-lg hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700 px-4 py-3 space-y-1">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setCurrentPage(id); setMobileOpen(false); }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === id ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
          <div className="border-t border-gray-700 pt-3 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.avatar}
              </div>
              <span className="text-white text-sm">{currentUser?.name}</span>
            </div>
            <button onClick={logout} className="text-red-400 text-sm flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
