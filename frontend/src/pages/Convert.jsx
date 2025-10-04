import React, { useState } from 'react'
import api, { setAuth } from '../api'

export default function Convert(){
  const [url,setUrl]=useState('');
  const [format,setFormat]=useState('mp3');
  const [jobId,setJobId]=useState(null);
  const [status,setStatus]=useState(null);

  async function convert(){
    setStatus(null);
    const token = localStorage.getItem('token'); if(token) setAuth(token);
    const r = await api.post('/api/convert', { url, format, public: true });
    setJobId(r.data.jobId); setStatus('queued');
  }

  async function check(){
    if(!jobId) return; const r = await api.get(`/api/jobs/${jobId}`); setStatus(r.data.state);
    if(r.data.result?.file) window.open(r.data.result.file, '_blank');
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Convertisseur</h2>
      <input className="w-full p-2 border rounded mb-2" placeholder="Lien vidéo" value={url} onChange={e=>setUrl(e.target.value)} />
      <select className="w-full p-2 border rounded mb-4" value={format} onChange={e=>setFormat(e.target.value)}>
        <option value="mp3">MP3 (audio)</option>
        <option value="wav">WAV (audio)</option>
        <option value="mp4">MP4 (video)</option>
      </select>
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-black text-white rounded">Convertir</button>
        <button onClick={check} className="px-4 py-2 border rounded">Vérifier</button>
      </div>
      <div className="mt-4">Job: {jobId || '-'} — Status: {status || '-'}</div>
    </div>
  )
}
