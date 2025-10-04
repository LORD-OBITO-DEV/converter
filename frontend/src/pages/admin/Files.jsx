import React, { useEffect, useState } from "react";
import api, { setAuth } from "../../api";

export default function Files() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(token);
    api.get("/api/admin/files").then(r => setFiles(r.data.files));
  }, []);

  async function removeFile(id) {
    await api.delete(`/api/admin/files/${id}`);
    setFiles(files.filter(f => f._id !== id));
  }

  return (
    <div>
      <h3 className="text-xl mb-3">Fichiers stockés</h3>
      <ul className="space-y-2">
        {files.map(f => (
          <li key={f._id} className="flex justify-between bg-white p-2 rounded shadow">
            <div>{f.filename} — {Math.round(f.size / 1024)} KB</div>
            <button onClick={() => removeFile(f._id)} className="px-2 py-1 bg-red-500 text-white rounded">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
