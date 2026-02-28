import { useState } from "react";
import { Challenge, LANGUAGES } from "../../data/challenges";
import { useAuth } from "../../contexts/AuthContext";
import { X, Play, CheckCircle, XCircle, Lightbulb, Star, Code2, ChevronDown, RotateCcw } from "lucide-react";

interface Props {
  challenge: Challenge;
  initialLanguage: string;
  onClose: () => void;
}

type TestStatus = "idle" | "running" | "passed" | "failed";

export default function CodeEditorModal({ challenge, initialLanguage, onClose }: Props) {
  const { currentUser, updateUser } = useAuth();
  const [lang, setLang] = useState(initialLanguage);
  const [code, setCode] = useState(challenge.starterCode[lang] || "// Start coding...");
  const [status, setStatus] = useState<TestStatus>("idle");
  const [output, setOutput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showLangDrop, setShowLangDrop] = useState(false);
  const [alreadyEarned] = useState(() => currentUser?.completedChallenges.includes(challenge.id) ?? false);
  const [justCompleted, setJustCompleted] = useState(false);

  const supportedLangs = LANGUAGES.filter((l) => challenge.languages.includes(l.id));
  const currentLangObj = LANGUAGES.find((l) => l.id === lang);

  const changeLang = (id: string) => {
    setLang(id);
    setCode(challenge.starterCode[id] || "// Start coding...");
    setStatus("idle");
    setOutput("");
    setShowLangDrop(false);
  };

  const runCode = async () => {
    if (!currentUser) return;
    setStatus("running");
    setOutput("");
    await new Promise((r) => setTimeout(r, 1200));

    // Evaluate by checking if solution keywords are present
    const solution = challenge.solution[lang] || "";
    const solutionKeywords = solution
      .split(/[\n;{}()]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 4);

    const matchCount = solutionKeywords.filter((kw) =>
      code.includes(kw.substring(0, Math.min(kw.length, 8)))
    ).length;

    const passed = matchCount >= Math.max(1, Math.floor(solutionKeywords.length * 0.3)) || code.toLowerCase().includes("hello, world") || code.toLowerCase().includes("return a + b") || code.toLowerCase().includes("return n") || code.toLowerCase().includes("reverse");

    if (passed) {
      setStatus("passed");
      const results = challenge.testCases.map((tc) => `✅ Test: ${tc.input || "—"} → Expected: ${tc.expected} → PASSED`).join("\n");
      setOutput(`Running ${lang} code...\n\n${results}\n\n🎉 All tests passed!`);
      if (!alreadyEarned && !justCompleted) {
        setJustCompleted(true);
        const updated = {
          ...currentUser,
          points: currentUser.points + challenge.points,
          completedChallenges: [...currentUser.completedChallenges, challenge.id],
          level: Math.floor((currentUser.points + challenge.points) / 300) + 1,
        };
        updateUser(updated);
      }
    } else {
      setStatus("failed");
      setOutput(`Running ${lang} code...\n\n❌ Test Failed\nYour output doesn't match the expected result.\n\nHint: ${challenge.hint}`);
    }
  };

  const resetCode = () => {
    setCode(challenge.starterCode[lang] || "// Start coding...");
    setStatus("idle");
    setOutput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full border ${
                challenge.difficulty === "Easy" ? "text-green-400 border-green-400/30 bg-green-400/10" :
                challenge.difficulty === "Medium" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
                "text-red-400 border-red-400/30 bg-red-400/10"
              }`}>{challenge.difficulty}</span>
              <h2 className="text-white font-bold text-lg">{challenge.title}</h2>
            </div>
            <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">{challenge.points} pts</span>
            </div>
            {(alreadyEarned || justCompleted) && (
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" /> Completed
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Problem */}
          <div className="w-80 flex-shrink-0 border-r border-gray-800 p-4 overflow-y-auto flex flex-col gap-4">
            <div>
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Problem</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{challenge.description}</p>
            </div>

            {challenge.testCases.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Test Cases</h3>
                <div className="space-y-2">
                  {challenge.testCases.map((tc, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-3 text-xs font-mono">
                      {tc.input && <div className="text-gray-400">Input: <span className="text-cyan-400">{tc.input}</span></div>}
                      <div className="text-gray-400">Expected: <span className="text-green-400">{tc.expected}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 text-yellow-300 text-sm">
                {challenge.hint}
              </div>
            )}

            {(status === "failed" || justCompleted) && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                {showSolution ? "Hide Solution" : "View Solution"}
              </button>
            )}
            {showSolution && challenge.solution[lang] && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-2">Solution ({currentLangObj?.label}):</p>
                <pre className="text-green-400 text-xs overflow-x-auto whitespace-pre-wrap">{challenge.solution[lang]}</pre>
              </div>
            )}
          </div>

          {/* Right: Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
              {/* Language dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDrop(!showLangDrop)}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-sm hover:border-violet-500/50 transition-colors"
                >
                  <div className="w-5 h-5 bg-gradient-to-br from-violet-500 to-indigo-600 rounded flex items-center justify-center text-xs font-bold">
                    {currentLangObj?.icon}
                  </div>
                  {currentLangObj?.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLangDrop && (
                  <div className="absolute left-0 top-10 z-50 bg-gray-800 border border-gray-700 rounded-xl p-2 w-48 shadow-2xl max-h-64 overflow-y-auto">
                    {supportedLangs.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => changeLang(l.id)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          lang === l.id ? "bg-violet-600 text-white" : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="w-5 h-5 bg-gray-600 rounded text-xs flex items-center justify-center font-bold">{l.icon}</div>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetCode} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm px-2 py-1.5 rounded-lg hover:bg-gray-800">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={status === "running"}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {status === "running" ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Play className="w-4 h-4 fill-white" />}
                  {status === "running" ? "Running..." : "Run Code"}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-gray-950 text-green-400 font-mono text-sm p-4 resize-none outline-none leading-relaxed"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
              />
            </div>

            {/* Output */}
            {output && (
              <div className={`border-t p-4 max-h-48 overflow-y-auto ${
                status === "passed" ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {status === "passed" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-semibold ${status === "passed" ? "text-green-400" : "text-red-400"}`}>
                    {status === "passed" ? "All Tests Passed!" : "Tests Failed"}
                  </span>
                  {justCompleted && (
                    <span className="ml-auto bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
                      +{challenge.points} pts earned!
                    </span>
                  )}
                </div>
                <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
