import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Users from "./Users";
import Tickets from "./Tickets";
import Files from "./Files";
import Stats from "./Stats";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panneau d’Administration</h2>
      <nav className="flex gap-4 mb-6">
        <Link to="stats" className="text-blue-600">📊 Stats</Link>
        <Link to="users" className="text-blue-600">👤 Utilisateurs</Link>
        <Link to="tickets" className="text-blue-600">🎫 Tickets</Link>
        <Link to="files" className="text-blue-600">📂 Fichiers</Link>
      </nav>

      <Routes>
        <Route path="stats" element={<Stats />} />
        <Route path="users" element={<Users />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="files" element={<Files />} />
      </Routes>
    </div>
  );
          }
