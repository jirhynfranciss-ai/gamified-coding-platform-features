import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Settings, Shield, Save, Bell, Globe, Database, Key, Eye, EyeOff } from "lucide-react";

export default function AdminSettings() {
  const { currentUser } = useAuth();
  const [platformName, setPlatformName] = useState("CodeQuest");
  const [emailNotif, setEmailNotif] = useState(true);
  const [leaderboardPublic, setLeaderboardPublic] = useState(true);
  const [autoLevel, setAutoLevel] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-amber-400" />
            Platform Settings
          </h1>
          <p className="text-gray-500 mt-1">Configure the CodeQuest platform</p>
        </div>

        {/* Admin Profile */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-amber-400" />
            Admin Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl">
              {currentUser?.avatar}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{currentUser?.name}</p>
              <p className="text-gray-500">{currentUser?.email}</p>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2 py-1 rounded-full mt-1 inline-block">Admin</span>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-blue-400" />
            General Settings
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Platform Name</label>
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
              <div>
                <p className="text-white font-medium text-sm">Public Leaderboard</p>
                <p className="text-gray-500 text-xs">Allow all users to view the leaderboard</p>
              </div>
              <button
                onClick={() => setLeaderboardPublic(!leaderboardPublic)}
                className={`w-12 h-6 rounded-full transition-all ${leaderboardPublic ? "bg-green-500" : "bg-gray-600"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${leaderboardPublic ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
              <div>
                <p className="text-white font-medium text-sm">Auto Level Up</p>
                <p className="text-gray-500 text-xs">Automatically level up users based on points</p>
              </div>
              <button
                onClick={() => setAutoLevel(!autoLevel)}
                className={`w-12 h-6 rounded-full transition-all ${autoLevel ? "bg-green-500" : "bg-gray-600"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${autoLevel ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-violet-400" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: "New User Registration", sub: "Get notified when a user signs up" },
              { label: "Challenge Completion", sub: "Alert on every challenge completed" },
              { label: "Weekly Summary Report", sub: "Receive weekly platform summary" },
            ].map(({ label, sub }, i) => (
              <div key={label} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div>
                  <p className="text-white font-medium text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
                <button
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-12 h-6 rounded-full transition-all ${i === 0 && emailNotif ? "bg-violet-500" : i !== 0 ? "bg-gray-600" : "bg-gray-600"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${i === 0 && emailNotif ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-green-400" />
            API Configuration
          </h2>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value="cq_live_sk_1234567890abcdef"
                readOnly
                className="w-full bg-gray-800 border border-gray-700 text-gray-400 rounded-xl px-4 py-3 text-sm outline-none font-mono pr-12"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-2">Used for external integrations. Keep this secure.</p>
          </div>
        </div>

        {/* Data */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-cyan-400" />
            Data Management
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors">Export Users CSV</button>
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors">Export Analytics</button>
            <button className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-medium transition-colors">Reset Leaderboard</button>
            <button className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-medium transition-colors">Clear All Progress</button>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            saved ? "bg-green-600" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? "Settings Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
