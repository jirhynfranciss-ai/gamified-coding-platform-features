import { useAuth } from "../../contexts/AuthContext";
import { CHALLENGES } from "../../data/challenges";
import { Trophy, Star, Zap, Target, TrendingUp, CheckCircle, Lock, ArrowRight } from "lucide-react";

interface Props {
  setCurrentPage: (page: string) => void;
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

export default function UserDashboard({ setCurrentPage }: Props) {
  const { currentUser, allUsers } = useAuth();
  if (!currentUser) return null;

  const sorted = [...allUsers].filter((u) => u.role === "user").sort((a, b) => b.points - a.points);
  const rank = sorted.findIndex((u) => u.id === currentUser.id) + 1;

  const nextLevelPoints = LEVEL_THRESHOLDS[Math.min(currentUser.level, LEVEL_THRESHOLDS.length - 1)] || 5500;
  const prevLevelPoints = LEVEL_THRESHOLDS[Math.min(currentUser.level - 1, LEVEL_THRESHOLDS.length - 1)] || 0;
  const progress = Math.min(100, ((currentUser.points - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100);

  const recentChallenges = CHALLENGES.filter((c) => currentUser.completedChallenges.includes(c.id)).slice(0, 3);
  const availableChallenges = CHALLENGES.filter((c) => !currentUser.completedChallenges.includes(c.id)).slice(0, 3);

  const difficultyColors: Record<string, string> = {
    Easy: "text-green-400 bg-green-400/10 border-green-400/20",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Hard: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="text-violet-400">{currentUser.name.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-gray-500">Here's your progress at a glance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Points", value: currentUser.points.toLocaleString(), icon: Star, color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/20", iconColor: "text-yellow-400" },
            { label: "Current Level", value: `Level ${currentUser.level}`, icon: Zap, color: "from-violet-500/20 to-violet-600/10 border-violet-500/20", iconColor: "text-violet-400" },
            { label: "Completed", value: `${currentUser.completedChallenges.length} / ${CHALLENGES.length}`, icon: CheckCircle, color: "from-green-500/20 to-green-600/10 border-green-500/20", iconColor: "text-green-400" },
            { label: "Rank", value: `#${rank}`, icon: Trophy, color: "from-orange-500/20 to-orange-600/10 border-orange-500/20", iconColor: "text-orange-400" },
          ].map(({ label, value, icon: Icon, color, iconColor }) => (
            <div key={label} className={`bg-gradient-to-br ${color} border rounded-2xl p-5`}>
              <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className="text-white text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Level Progress */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Level Progress
                </h2>
                <p className="text-gray-500 text-sm">Level {currentUser.level} → Level {currentUser.level + 1}</p>
              </div>
              <div className="text-right">
                <p className="text-violet-400 font-bold">{currentUser.points.toLocaleString()} pts</p>
                <p className="text-gray-500 text-xs">Next: {nextLevelPoints.toLocaleString()} pts</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-full h-4 mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{prevLevelPoints.toLocaleString()} pts</span>
              <span>{Math.round(progress)}% complete</span>
              <span>{nextLevelPoints.toLocaleString()} pts</span>
            </div>

            {/* Completion bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Challenge Completion</span>
                <span className="text-green-400">{currentUser.completedChallenges.length}/{CHALLENGES.length}</span>
              </div>
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${(currentUser.completedChallenges.length / CHALLENGES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Leaderboard Peek */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-orange-400" />
              Top Players
            </h2>
            <div className="space-y-3">
              {sorted.slice(0, 4).map((u, i) => (
                <div key={u.id} className={`flex items-center gap-3 p-2 rounded-xl ${u.id === currentUser.id ? "bg-violet-500/10 border border-violet-500/20" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-yellow-400 text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-orange-500 text-black" : "bg-gray-700 text-gray-300"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${u.id === currentUser.id ? "text-violet-300" : "text-white"}`}>{u.name}</p>
                    <p className="text-gray-500 text-xs">Lv.{u.level}</p>
                  </div>
                  <p className="text-yellow-400 font-bold text-sm">{u.points.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrentPage("leaderboard")} className="w-full mt-4 text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors flex items-center justify-center gap-1">
              View Full Leaderboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Challenges */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Completed */}
          {recentChallenges.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Recently Completed
              </h2>
              <div className="space-y-3">
                {recentChallenges.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/15 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{c.title}</p>
                      <p className="text-gray-500 text-xs">{c.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[c.difficulty]}`}>{c.difficulty}</span>
                    <span className="text-yellow-400 text-xs font-bold">+{c.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-violet-400" />
              Up Next
            </h2>
            <div className="space-y-3">
              {availableChallenges.length > 0 ? availableChallenges.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors" onClick={() => setCurrentPage("challenges")}>
                  <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{c.title}</p>
                    <p className="text-gray-500 text-xs">{c.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[c.difficulty]}`}>{c.difficulty}</span>
                  <span className="text-yellow-400 text-xs font-bold">+{c.points}</span>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-bold">All challenges completed!</p>
                  <p className="text-gray-500 text-sm">You're a CodeQuest master!</p>
                </div>
              )}
            </div>
            <button onClick={() => setCurrentPage("challenges")} className="w-full mt-4 text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors flex items-center justify-center gap-1">
              See All Challenges <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
