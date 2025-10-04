import React, { useState } from 'react'
import api from '../api'

export default function Support(){
  const [subject,setSubject]=useState(''); const [message,setMessage]=useState(''); const [ok,setOk]=useState(null);
  async function submit(e){
    e.preventDefault(); try{ await api.post('/api/tickets', { subject, message }); setOk(true); }catch(e){ setOk(false); }
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Support</h2>
      {ok===true && <div className="text-green-600 mb-2">Ticket créé</div>}
      {ok===false && <div className="text-red-600 mb-2">Erreur</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Sujet" value={subject} onChange={e=>setSubject(e.target.value)} />
        <textarea className="w-full p-2 border rounded" placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} />
        <button className="px-4 py-2 bg-black text-white rounded">Envoyer</button>
      </form>
    </div>
  )
}
