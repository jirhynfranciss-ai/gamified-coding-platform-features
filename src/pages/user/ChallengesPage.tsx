import { useState } from "react";
import { CHALLENGES, LANGUAGES } from "../../data/challenges";
import { useAuth } from "../../contexts/AuthContext";
import { Search, Filter, CheckCircle, Star, Code2, ChevronRight, Trophy } from "lucide-react";
import CodeEditorModal from "./CodeEditorModal";

interface Props {
  setCurrentPage?: (page: string) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

const categoryColors: Record<string, string> = {
  Basics: "bg-blue-500/10 text-blue-400",
  Math: "bg-purple-500/10 text-purple-400",
  Logic: "bg-orange-500/10 text-orange-400",
  Strings: "bg-pink-500/10 text-pink-400",
  Algorithms: "bg-cyan-500/10 text-cyan-400",
};

export default function ChallengesPage({ setCurrentPage: _setCurrentPage }: Props) {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);

  if (!currentUser) return null;

  const categories = ["All", ...Array.from(new Set(CHALLENGES.map((c) => c.category)))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filtered = CHALLENGES.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === "All" || c.difficulty === difficulty;
    const matchCat = category === "All" || c.category === category;
    return matchSearch && matchDiff && matchCat;
  });

  const selectedChallengeFull = selectedChallenge ? CHALLENGES.find((c) => c.id === selectedChallenge) : null;
  const currentLangObj = LANGUAGES.find((l) => l.id === selectedLang);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Challenges</h1>
            <p className="text-gray-500">{currentUser.completedChallenges.length}/{CHALLENGES.length} completed</p>
          </div>
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="flex items-center gap-2 bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-xl hover:border-violet-500/50 transition-colors"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">
                {currentLangObj?.icon}
              </div>
              <span className="font-medium">{currentLangObj?.label}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showLangPicker ? "rotate-90" : ""}`} />
            </button>
            {showLangPicker && (
              <div className="absolute right-0 top-12 z-50 bg-gray-900 border border-gray-700 rounded-2xl p-3 w-72 shadow-2xl grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => { setSelectedLang(lang.id); setShowLangPicker(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      selectedLang === lang.id ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${selectedLang === lang.id ? "bg-white/20" : "bg-gray-700"}`}>
                      {lang.icon}
                    </div>
                    <span className="text-xs">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                  difficulty === d ? "bg-violet-600 border-violet-600 text-white" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                  category === c ? "bg-indigo-600 border-indigo-600 text-white" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge) => {
            const isCompleted = currentUser.completedChallenges.includes(challenge.id);
            const langSupported = challenge.languages.includes(selectedLang);

            return (
              <div
                key={challenge.id}
                onClick={() => setSelectedChallenge(challenge.id)}
                className={`group relative bg-gray-900 border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-violet-500/10 ${
                  isCompleted ? "border-green-500/30 hover:border-green-500/50" : "border-gray-800 hover:border-violet-500/50"
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-xs px-2 py-1 rounded-full ${categoryColors[challenge.category] || "bg-gray-700 text-gray-300"}`}>
                    {challenge.category}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors">{challenge.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{challenge.points} pts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-gray-500 text-xs">{challenge.languages.length} langs</span>
                    {!langSupported && (
                      <span className="text-orange-400 text-xs">({currentLangObj?.label} N/A)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <Filter className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No challenges found</p>
              <p className="text-gray-600 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Score Summary */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Earned</p>
              <p className="text-white text-2xl font-bold">{currentUser.points.toLocaleString()} pts</p>
            </div>
          </div>
          <div className="flex gap-6">
            {["Easy", "Medium", "Hard"].map((d) => {
              const completed = CHALLENGES.filter((c) => c.difficulty === d && currentUser.completedChallenges.includes(c.id)).length;
              const total = CHALLENGES.filter((c) => c.difficulty === d).length;
              return (
                <div key={d} className="text-center">
                  <p className={`text-lg font-bold ${d === "Easy" ? "text-green-400" : d === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{completed}/{total}</p>
                  <p className="text-gray-500 text-xs">{d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedChallengeFull && (
        <CodeEditorModal
          challenge={selectedChallengeFull}
          initialLanguage={selectedChallengeFull.languages.includes(selectedLang) ? selectedLang : selectedChallengeFull.languages[0]}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}
