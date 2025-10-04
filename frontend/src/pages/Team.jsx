import React from 'react'

export default function Team(){
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Notre équipe</h2>
      <div className="flex items-center gap-4">
        <img src="/placeholder-founder.jpg" alt="Fondateur" className="w-24 h-24 rounded-full object-cover"/>
        <div>
          <h3 className="font-bold">Ton Nom (Fondateur)</h3>
          <div className="text-sm">Email: <a href="mailto:ton.email@example.com" className="text-blue-600">ton.email@example.com</a></div>
          <div className="text-sm">Contact: +225 ... (optionnel)</div>
        </div>
      </div>
      <p className="mt-4">Présentation courte : fondateur & créateur du projet.</p>
    </div>
  )
}
