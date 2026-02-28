import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Users, Search, Trash2, Edit2, Save, X, Shield, Star, CheckCircle, UserPlus } from "lucide-react";

export default function ManageUsers() {
  const { allUsers, setAllUsers } = useAuth();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "user" | "admin">("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPoints, setEditPoints] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const startEdit = (userId: string) => {
    const u = allUsers.find((u) => u.id === userId)!;
    setEditId(userId);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPoints(u.points);
  };

  const saveEdit = () => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === editId
          ? { ...u, name: editName, email: editEmail, points: editPoints, avatar: editName.charAt(0).toUpperCase() }
          : u
      )
    );
    setEditId(null);
  };

  const deleteUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDelete(null);
  };

  const addUser = () => {
    if (!newName || !newEmail) return;
    const newUser = {
      id: `user-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      points: 0,
      level: 1,
      avatar: newName.charAt(0).toUpperCase(),
      completedChallenges: [],
      joinDate: new Date().toISOString().split("T")[0],
    };
    setAllUsers((prev) => [...prev, newUser]);
    setNewName("");
    setNewEmail("");
    setNewRole("user");
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              Manage Users
            </h1>
            <p className="text-gray-500 mt-1">{allUsers.length} total accounts</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "All Users", value: allUsers.filter((u) => u.role === "user").length, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Admins", value: allUsers.filter((u) => u.role === "admin").length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Total Accounts", value: allUsers.length, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border rounded-2xl p-4 text-center`}>
              <p className={`${color} text-2xl font-bold`}>{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "user", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                  filterRole === r ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">User</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Role</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Points</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Level</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Completed</th>
                  <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Joined</th>
                  <th className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      {editId === user.id ? (
                        <div className="flex flex-col gap-1">
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500 w-36" />
                          <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-500 w-36" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                        user.role === "admin"
                          ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                          : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                      }`}>
                        {user.role === "admin" ? <Shield className="w-3 h-3 inline mr-1" /> : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {editId === user.id ? (
                        <input type="number" value={editPoints} onChange={(e) => setEditPoints(Number(e.target.value))} className="bg-gray-800 border border-gray-700 text-yellow-400 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500 w-24" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">{user.points.toLocaleString()}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-violet-400 font-bold text-sm">Lv.{user.level}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 font-bold text-sm">{user.completedChallenges.length}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-500 text-sm">{user.joinDate}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {editId === user.id ? (
                          <>
                            <button onClick={saveEdit} className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors">
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditId(null)} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(user.id)} className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirmDelete(user.id)} className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-white font-bold text-lg mb-2">Delete User?</h3>
              <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The user will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={() => deleteUser(confirmDelete)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-500 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">Add New User</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Full Name</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Doe" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
                  <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Role</label>
                  <div className="flex gap-2">
                    {(["user", "admin"] as const).map((r) => (
                      <button key={r} onClick={() => setNewRole(r)} className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${newRole === r ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-800 border-gray-700 text-gray-400"}`}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={addUser} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-500 transition-colors">Add User</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
