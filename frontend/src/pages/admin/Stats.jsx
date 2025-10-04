import React, { useEffect, useState } from "react";
import api, { setAuth } from "../../api";

export default function Stats() {
  const [stats, setStats] = useState({ users: 0, tickets: 0, files: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(token);
    Promise.all([
      api.get("/api/admin/users"),
      api.get("/api/admin/tickets"),
      api.get("/api/admin/files"),
    ]).then(([u, t, f]) => {
      setStats({ users: u.data.users.length, tickets: t.data.tickets.length, files: f.data.files.length });
    });
  }, []);

  return (
    <div>
      <h3 className="text-xl mb-3">Statistiques</h3>
      <ul className="space-y-2 bg-white p-4 rounded shadow">
        <li>👤 Utilisateurs : {stats.users}</li>
        <li>🎫 Tickets : {stats.tickets}</li>
        <li>📂 Fichiers : {stats.files}</li>
      </ul>
    </div>
  );
}
