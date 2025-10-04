import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAuth } from '../api'

export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function logout(){
    localStorage.removeItem('token'); setAuth(null); navigate('/login');
  }
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">Convertisseur</Link>
          <Link to="/team" className="text-sm">Notre équipe</Link>
          <Link to="/support" className="text-sm">Support</Link>
          <Link to="/legal" className="text-sm">Légales</Link>
        </div>
        <div>
          {token ? (
            <button onClick={logout} className="px-3 py-1 border rounded">Se déconnecter</button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 border rounded">Connexion</Link>
              <Link to="/signup" className="px-3 py-1 bg-black text-white rounded">Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
