import { useAuth } from "../../contexts/AuthContext";
import { CHALLENGES } from "../../data/challenges";
import { Users, BookOpen, Star, TrendingUp, Activity, Shield, CheckCircle, Clock } from "lucide-react";

interface Props {
  setCurrentPage: (page: string) => void;
}

export default function AdminDashboard({ setCurrentPage }: Props) {
  const { allUsers } = useAuth();

  const userList = allUsers.filter((u) => u.role === "user");
  const adminList = allUsers.filter((u) => u.role === "admin");
  const totalPoints = userList.reduce((sum, u) => sum + u.points, 0);
  const totalCompleted = userList.reduce((sum, u) => sum + u.completedChallenges.length, 0);
    const difficultyCount = {
    Easy: CHALLENGES.filter((c) => c.difficulty === "Easy").length,
    Medium: CHALLENGES.filter((c) => c.difficulty === "Medium").length,
    Hard: CHALLENGES.filter((c) => c.difficulty === "Hard").length,
  };

  const recentUsers = [...userList].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Platform overview and management</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl">
            <p className="text-amber-400 font-semibold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" /> Platform Active
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: userList.length, icon: Users, color: "from-blue-500/20 to-blue-600/10 border-blue-500/20", iconColor: "text-blue-400", sub: `${adminList.length} admins` },
            { label: "Total Challenges", value: CHALLENGES.length, icon: BookOpen, color: "from-violet-500/20 to-violet-600/10 border-violet-500/20", iconColor: "text-violet-400", sub: "Active" },
            { label: "Points Distributed", value: totalPoints.toLocaleString(), icon: Star, color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/20", iconColor: "text-yellow-400", sub: "All time" },
            { label: "Completions", value: totalCompleted, icon: CheckCircle, color: "from-green-500/20 to-green-600/10 border-green-500/20", iconColor: "text-green-400", sub: "Total submissions" },
          ].map(({ label, value, icon: Icon, color, iconColor, sub }) => (
            <div key={label} className={`bg-gradient-to-br ${color} border rounded-2xl p-5`}>
              <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
              <p className="text-gray-400 text-xs mb-0.5">{label}</p>
              <p className="text-white text-2xl font-bold">{value}</p>
              <p className="text-gray-600 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Challenge Distribution */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Challenges by Difficulty
            </h2>
            <div className="space-y-4">
              {(["Easy", "Medium", "Hard"] as const).map((d) => {
                const count = difficultyCount[d];
                const pct = (count / CHALLENGES.length) * 100;
                const colors = { Easy: "bg-green-500", Medium: "bg-yellow-500", Hard: "bg-red-500" };
                const textColors = { Easy: "text-green-400", Medium: "text-yellow-400", Hard: "text-red-400" };
                return (
                  <div key={d}>
                    <div className="flex justify-between mb-1.5">
                      <span className={`${textColors[d]} text-sm font-medium`}>{d}</span>
                      <span className="text-gray-400 text-sm">{count} challenges</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-full ${colors[d]} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <h3 className="text-gray-400 text-sm mb-3">By Category</h3>
              {Array.from(new Set(CHALLENGES.map((c) => c.category))).map((cat) => {
                const count = CHALLENGES.filter((c) => c.category === cat).length;
                return (
                  <div key={cat} className="flex justify-between py-1.5 border-b border-gray-800/50">
                    <span className="text-gray-300 text-sm">{cat}</span>
                    <span className="text-violet-400 font-bold text-sm">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performer */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Top Performers
            </h2>
            <div className="space-y-3">
              {[...userList].sort((a, b) => b.points - a.points).slice(0, 5).map((user, i) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-yellow-400 text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-orange-500 text-black" : "bg-gray-700 text-gray-300"
                  }`}>{i + 1}</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.completedChallenges.length} completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-sm">{user.points.toLocaleString()}</p>
                    <p className="text-gray-600 text-xs">pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Registrations
            </h2>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                  <p className="text-gray-500 text-xs flex-shrink-0">{user.joinDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Manage Users", desc: "View & edit accounts", page: "admin-users", icon: Users, color: "from-blue-600 to-blue-700" },
            { label: "Manage Challenges", desc: "Edit challenges", page: "admin-challenges", icon: BookOpen, color: "from-violet-600 to-indigo-700" },
            { label: "Settings", desc: "Platform config", page: "admin-settings", icon: Shield, color: "from-amber-600 to-orange-700" },
            { label: "Analytics", desc: "View platform stats", page: "admin-dashboard", icon: TrendingUp, color: "from-green-600 to-emerald-700" },
          ].map(({ label, desc, page, icon: Icon, color }) => (
            <button
              key={label}
              onClick={() => setCurrentPage(page)}
              className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-5 text-left hover:opacity-90 transition-opacity`}
            >
              <Icon className="w-6 h-6 text-white mb-3" />
              <p className="text-white font-bold">{label}</p>
              <p className="text-white/60 text-xs">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
