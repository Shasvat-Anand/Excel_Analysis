import { getDatabase, ref, get, remove, update } from "firebase/database";
import { FileText, Shield, Trash2, Users, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const snapshot = await get(ref(db, `users/${user.uid}`));
      if (!snapshot.exists() || snapshot.val().role !== "admin") {
        navigate("/");
        return;
      }

      await fetchData();
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersSnap, uploadsSnap] = await Promise.all([
        get(ref(db, "users")),
        get(ref(db, "uploads")),
      ]);

      const usersData = usersSnap.exists()
        ? Object.keys(usersSnap.val()).map((key) => ({ id: key, ...usersSnap.val()[key] }))
        : [];
      setUsers(usersData);

      const uploadsData = uploadsSnap.exists()
        ? Object.keys(uploadsSnap.val()).map((key) => ({ id: key, ...uploadsSnap.val()[key] }))
        : [];
      setUploads(uploadsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await remove(ref(db, `users/${id}`));
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await update(ref(db, `users/${id}`), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Failed to update role.");
      console.error(err);
    }
  };

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) : "N/A";

  // Stats cards
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users className="text-cyan-400" />,
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/50",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: <Shield className="text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/50",
    },
    {
      label: "Total Uploads",
      value: uploads.length,
      icon: <FileText className="text-green-400" />,
      color: "from-green-500/20 to-emerald-500/20 border-green-500/50",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen  justify-center items-center  md:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8  text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        🚀 Admin Control Center
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-white/5 backdrop-blur-lg shadow-lg border hover:scale-[1.02] transition-all duration-300 flex items-center justify-between ${stat.color}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">{stat.icon}</div>
              <div>
                <p className="text-xs md:text-sm text-gray-300">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <Users size={20} /> Registered Users
          </h2>
          <button
            onClick={fetchData}
            disabled={loading}
            className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-1"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Refresh"}
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-2" />
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <AlertCircle size={32} className="mb-2" />
              <p>No users found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="hidden sm:table-header-group bg-gradient-to-r from-cyan-700/30 to-purple-700/30">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="block sm:table-row border-b border-white/5 last:border-none bg-gray-900/20 sm:bg-transparent hover:bg-white/5 transition-colors"
                  >
                    {/* Mobile: Stacked Layout */}
                    <td className="block sm:table-cell p-3 sm:py-4">
                      <div className="font-medium">{u.email}</div>
                      <div className="sm:hidden text-xs text-gray-400 mt-1">
                        <span className="mr-2">Role: {u.role}</span>
                        <span>Created: {formatDate(u.createdAt)}</span>
                      </div>
                    </td>

                    {/* Desktop: Role Dropdown */}
                    <td className="hidden sm:table-cell p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="w-full sm:w-auto bg-gray-800/70 border border-white/20 px-2 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="hidden sm:table-cell p-3 text-gray-300">{formatDate(u.createdAt)}</td>

                    <td className="block sm:table-cell p-3 text-center">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Uploads Summary (Optional: Add if needed) */}
      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg">
        <h3 className="text-lg font-semibold mb-2 text-green-400 flex items-center gap-2">
          <FileText size={18} /> Recent Uploads
        </h3>
        {uploads.length === 0 ? (
          <p className="text-gray-400 text-sm">No uploads yet.</p>
        ) : (
          <div className="text-sm text-gray-300">
            {uploads.slice(-3).reverse().map((file) => (
              <div key={file.id} className="py-2 border-b border-white/5 last:border-none">
                <span className="font-medium">{file.filename}</span> by{" "}
                <span className="text-cyan-400">{file.email}</span> •{" "}
                {formatDate(file.uploadedAt)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}