import React, { useEffect, useState } from "react";
import api, { setAuth } from "../../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(token);
    api.get("/api/admin/users").then(r => setUsers(r.data.users));
  }, []);

  async function removeUser(id) {
    await api.delete(`/api/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  }

  return (
    <div>
      <h3 className="text-xl mb-3">Liste des utilisateurs</h3>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u._id} className="flex justify-between bg-white p-2 rounded shadow">
            <div>
              {u.name} — {u.email} {u.isAdmin && <span className="text-xs text-red-500">(Admin)</span>}
            </div>
            <button onClick={() => removeUser(u._id)} className="px-2 py-1 bg-red-500 text-white rounded">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
