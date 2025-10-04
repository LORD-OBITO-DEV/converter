import React, { useEffect, useState } from "react";
import api, { setAuth } from "../../api";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(token);
    api.get("/api/admin/tickets").then(r => setTickets(r.data.tickets));
  }, []);

  async function sendReply(id) {
    await api.post(`/api/admin/tickets/${id}/reply`, { message: reply });
    setReply("");
    alert("Réponse envoyée !");
  }

  return (
    <div>
      <h3 className="text-xl mb-3">Tickets support</h3>
      {tickets.map(t => (
        <div key={t._id} className="bg-white p-3 rounded shadow mb-3">
          <div className="font-semibold">{t.subject} — {t.user?.email}</div>
          <div>{t.message}</div>
          <textarea
            className="w-full border rounded mt-2 p-2"
            placeholder="Réponse admin..."
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <button onClick={() => sendReply(t._id)} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Répondre</button>
        </div>
      ))}
    </div>
  );
      }
