import React, { useState } from 'react'
import api, { setAuth } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(null); const navigate = useNavigate();
  async function submit(e){
    e.preventDefault(); setErr(null);
    try{
      const r = await api.post('/api/auth/login', { email, password });
      const token = r.data.token;
      localStorage.setItem('token', token); setAuth(token);
      navigate('/');
    }catch(e){ setErr(e.response?.data?.error || 'Erreur'); }
  }
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Connexion</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 bg-black text-white rounded">Se connecter</button>
      </form>
    </div>
  )
}
