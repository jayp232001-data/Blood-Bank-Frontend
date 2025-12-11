import React, { useEffect, useState } from "react";
import { Plus, Mail, Phone, MapPin, Droplet, Search, Filter } from "lucide-react";

// ---------- USER MODEL ----------
interface AppUser {
  id: number;
  fullName: string;
  age: number;
  sex: string;
  bloodGroup: string;
  email: string;
  phoneNumber: string;
  fullAddress: string;
}

// ---------- BACKEND URL ----------
const API_BASE = "http://localhost:8080/api/users";

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    age: 18,
    sex: "Male",
    bloodGroup: "O+",
    email: "",
    phoneNumber: "",
    fullAddress: "",
  });

  // ⭐ FETCH USERS ON PAGE LOAD
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ⭐ CREATE USER
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");

      setIsModalOpen(false);
      await fetchUsers(); // refresh table
    } catch (err) {
      console.error("Create user error:", err);
    }
  };

  // ⭐ SEARCH FILTER
  const filteredUsers = users.filter((u) =>
    `${u.fullName} ${u.email} ${u.bloodGroup}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Directory</h2>
          <p className="text-slate-500">Manage registered users, donors, and recipients</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow"
        >
          <Plus className="w-5 h-5" /> Add New User
        </button>
      </div>

      {/* ---------- SEARCH BAR ---------- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or blood group..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* <div className="flex items-center gap-2 px-4 border rounded-lg bg-slate-50 text-slate-600">
          <Filter className="w-4 h-4" /> Filter
        </div> */}
      </div>

      {/* ---------- USER LIST TABLE ---------- */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-600 border-b">
              <th className="p-4 pl-6">User Details</th>
              <th className="p-4">Personal Info</th>
              <th className="p-4">Blood Group</th>
              <th className="p-4">Contact & Full Address</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.fullName}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div>{user.age} Years</div>
                  <div className="text-xs text-slate-500">{user.sex}</div>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm flex items-center gap-1">
                    <Droplet className="w-3 h-3" /> {user.bloodGroup}
                  </span>
                </td>

                <td className="p-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {user.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {user.fullAddress}
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- CREATE USER MODAL ---------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleCreateUser}
            className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4"
          >
            <h3 className="text-xl font-bold">Register New User</h3>

            <input
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Full Name"
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />

            <input
              required
              type="email"
              className="w-full p-3 border rounded-lg"
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Phone"
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />

            <input
              required
              type="number"
              className="w-full p-3 border rounded-lg"
              placeholder="Age"
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            />

            <select
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <select
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <textarea
              required
              rows={3}
              className="w-full p-3 border rounded-lg"
              placeholder="Address"
              onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
            ></textarea>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 p-3 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 p-3 bg-red-500 text-white rounded-lg"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
