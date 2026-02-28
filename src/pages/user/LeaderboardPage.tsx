import { useAuth } from "../../contexts/AuthContext";
import { Trophy, Medal, Star, Zap, Crown, TrendingUp } from "lucide-react";
import { CHALLENGES } from "../../data/challenges";

export default function LeaderboardPage() {
  const { currentUser, allUsers } = useAuth();

  const users = [...allUsers]
    .filter((u) => u.role === "user")
    .sort((a, b) => b.points - a.points);

  const myRank = users.findIndex((u) => u.id === currentUser?.id) + 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return <span className="text-gray-500 font-bold text-sm w-5 text-center">#{rank}</span>;
  };

  const getRankBg = (rank: number, isCurrent: boolean) => {
    if (isCurrent && rank <= 3) return "";
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/10 to-gray-500/5 border-gray-400/30";
    if (rank === 3) return "bg-gradient-to-r from-orange-500/10 to-orange-600/5 border-orange-500/30";
    if (isCurrent) return "bg-violet-500/10 border-violet-500/30";
    return "bg-gray-900 border-gray-800 hover:border-gray-700";
  };

  const maxPoints = users[0]?.points || 1;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-500">The top coders of CodeQuest</p>
        </div>

        {/* My Rank Banner */}
        {currentUser && myRank > 3 && (
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">Your Rank: <span className="text-violet-400">#{myRank}</span></p>
              <p className="text-gray-500 text-sm">{currentUser.points.toLocaleString()} points</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Points to #{myRank - 1}</p>
              <p className="text-violet-400 font-bold">{myRank > 1 ? (users[myRank - 2].points - currentUser.points).toLocaleString() : "0"} pts</p>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[users[1], users[0], users[2]].map((user, podiumIdx) => {
              const ranks = [2, 1, 3];
              const rank = ranks[podiumIdx];
              const heights = ["h-28", "h-36", "h-24"];
              const golds = [
                "from-gray-400/20 to-gray-500/10 border-gray-400/30",
                "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
                "from-orange-500/20 to-orange-600/10 border-orange-500/30",
              ];
              const isMe = user?.id === currentUser?.id;
              return (
                <div key={user?.id} className="flex flex-col items-center">
                  <div className="text-center mb-3">
                    <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-1 ${isMe ? "ring-2 ring-violet-400" : ""}`}>
                      {user?.avatar}
                      {rank === 1 && <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-400 fill-yellow-400" />}
                    </div>
                    <p className={`text-sm font-bold truncate ${isMe ? "text-violet-300" : "text-white"}`}>{user?.name}</p>
                    <p className="text-yellow-400 font-bold text-sm">{user?.points.toLocaleString()}</p>
                  </div>
                  <div className={`w-full ${heights[podiumIdx]} bg-gradient-to-b ${golds[podiumIdx]} border rounded-t-xl flex items-start justify-center pt-3`}>
                    <span className="text-3xl font-black text-white/30">#{rank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full List */}
        <div className="space-y-2">
          {users.map((user, idx) => {
            const rank = idx + 1;
            const isCurrent = user.id === currentUser?.id;
            const completedCount = user.completedChallenges.length;
            const barWidth = (user.points / maxPoints) * 100;

            return (
              <div
                key={user.id}
                className={`border rounded-2xl p-4 transition-all ${getRankBg(rank, isCurrent)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">{getRankIcon(rank)}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold text-sm truncate ${isCurrent ? "text-violet-300" : "text-white"}`}>{user.name}</p>
                      {isCurrent && <span className="text-violet-400 text-xs border border-violet-400/30 px-1.5 py-0.5 rounded-full">You</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-violet-400 font-bold text-sm">Lv.{user.level}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 font-bold text-sm">{completedCount}</span>
                      </div>
                      <p className="text-gray-600 text-xs">solved</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold">{user.points.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-600 text-xs">points</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total Players", value: users.length, icon: Trophy },
            { label: "Challenges Available", value: CHALLENGES.length, icon: Star },
            { label: "Your Rank", value: `#${myRank}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
              <Icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className="text-white text-2xl font-bold">{value}</p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
