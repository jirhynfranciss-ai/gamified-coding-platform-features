import { useState } from "react";
import { CHALLENGES, LANGUAGES } from "../../data/challenges";
import { BookOpen, Star, Code2, Search, Eye, Edit2, Trash2, Plus, X, CheckCircle, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function ManageChallenges() {
  const { allUsers } = useAuth();
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState("All");
  const [viewChallenge, setViewChallenge] = useState<string | null>(null);
  const [showAddNotice, setShowAddNotice] = useState(false);

  const filtered = CHALLENGES.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === "All" || c.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  const viewFull = CHALLENGES.find((c) => c.id === viewChallenge);
  const userList = allUsers.filter((u) => u.role === "user");

  const getCompletionCount = (challengeId: string) =>
    userList.filter((u) => u.completedChallenges.includes(challengeId)).length;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-violet-400" />
              Manage Challenges
            </h1>
            <p className="text-gray-500 mt-1">{CHALLENGES.length} challenges available</p>
          </div>
          <button
            onClick={() => setShowAddNotice(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            New Challenge
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: CHALLENGES.length, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            { label: "Easy", value: CHALLENGES.filter((c) => c.difficulty === "Easy").length, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { label: "Medium", value: CHALLENGES.filter((c) => c.difficulty === "Medium").length, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            { label: "Hard", value: CHALLENGES.filter((c) => c.difficulty === "Hard").length, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border rounded-2xl p-4 text-center`}>
              <p className={`${color} text-2xl font-bold`}>{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-violet-500 outline-none transition-colors"
            />
          </div>
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDiff(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                filterDiff === d ? "bg-violet-600 border-violet-600 text-white" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Challenge</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Difficulty</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Category</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Points</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Languages</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Completions</th>
                  <th className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((challenge) => {
                  const completions = getCompletionCount(challenge.id);
                  return (
                    <tr key={challenge.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{challenge.title}</p>
                        <p className="text-gray-600 text-xs truncate max-w-xs">{challenge.description.substring(0, 60)}...</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-gray-400 text-sm">{challenge.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">{challenge.points}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-gray-400 text-sm">{challenge.languages.length}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-400 font-bold text-sm">{completions}</span>
                          <span className="text-gray-600 text-xs">/{userList.length}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setViewChallenge(challenge.id)}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-violet-600 text-gray-400 hover:text-white transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Challenge Modal */}
        {viewFull && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-bold text-xl">{viewFull.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[viewFull.difficulty]}`}>{viewFull.difficulty}</span>
                    <span className="text-gray-500 text-xs">{viewFull.category}</span>
                  </div>
                </div>
                <button onClick={() => setViewChallenge(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-gray-300 text-sm">{viewFull.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-800 rounded-xl p-3 text-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
                    <p className="text-yellow-400 font-bold">{viewFull.points}</p>
                    <p className="text-gray-500 text-xs">Points</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3 text-center">
                    <Code2 className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                    <p className="text-violet-400 font-bold">{viewFull.languages.length}</p>
                    <p className="text-gray-500 text-xs">Languages</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-green-400 font-bold">{getCompletionCount(viewFull.id)}</p>
                    <p className="text-gray-500 text-xs">Completions</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Supported Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewFull.languages.map((lid) => {
                      const l = LANGUAGES.find((l) => l.id === lid);
                      return (
                        <span key={lid} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                          <span className="w-4 h-4 bg-gray-700 rounded text-xs flex items-center justify-center font-bold">{l?.icon}</span>
                          {l?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Hint</h4>
                  <p className="text-yellow-300 text-sm bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3">{viewFull.hint}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Test Cases</h4>
                  <div className="space-y-2">
                    {viewFull.testCases.map((tc, i) => (
                      <div key={i} className="bg-gray-800 rounded-xl p-3 text-xs font-mono">
                        {tc.input && <div className="text-gray-400">Input: <span className="text-cyan-400">{tc.input}</span></div>}
                        <div className="text-gray-400">Expected: <span className="text-green-400">{tc.expected}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Notice */}
        {showAddNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm text-center">
              <Plus className="w-12 h-12 text-violet-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Add Challenge</h3>
              <p className="text-gray-400 text-sm mb-6">Challenge creation would connect to a backend API. This is a frontend demo — challenges are pre-loaded from the data store.</p>
              <button onClick={() => setShowAddNotice(false)} className="w-full bg-violet-600 text-white py-2.5 rounded-xl font-medium hover:bg-violet-500 transition-colors">Got it</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
