import React, { useEffect, useState } from 'react'
import api, { setAuth } from '../api'

export default function Dashboard(){
  const token = localStorage.getItem('token'); if(token) setAuth(token);
  const [files, setFiles] = useState([]);

  useEffect(()=>{ if(!token) return; api.get('/api/convert/files').then(r=>setFiles(r.data.files)).catch(()=>{}); },[]);

  return (
    <div>
      <h2 className="text-xl mb-4">Dashboard</h2>
      <section className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Mes fichiers récents</h3>
        {files.length===0 ? <div>Aucun fichier</div> : (
          <ul className="space-y-2">
            {files.map(f=> (
              <li key={f._id} className="flex justify-between items-center">
                <div>{f.filename} — {Math.round(f.size/1024)} KB</div>
                <a href={`/files/${f.filename}`} className="text-sm text-blue-600">Télécharger</a>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Administration</h3>
        <div>Plus tard : gestion utilisateurs, tickets, quotas.</div>
      </section>
    </div>
  )
}
