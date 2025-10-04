import React, {useState} from 'react';
export default function App(){
  const [url,setUrl] = useState('');
  const [format,setFormat] = useState('mp3');
  const [jobId,setJobId] = useState(null);
  const [status,setStatus] = useState(null);

  async function convert(){
    const r = await fetch('/api/convert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,format})});
    const j = await r.json();
    setJobId(j.jobId);
    setStatus('queued');
  }

  async function poll(){
    if(!jobId) return;
    const r = await fetch(`/api/jobs/${jobId}`);
    const j = await r.json();
    setStatus(j.state);
    if(j.result && j.result.file) window.open(j.result.file, '_blank');
  }

  return (
    <div style={{maxWidth:600,margin:'2rem auto',padding:20}}>
      <h1>Convertisseur vidéo → audio</h1>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="lien vidéo" style={{width:'100%',padding:8}}/>
      <select value={format} onChange={e=>setFormat(e.target.value)} style={{marginTop:8}}>
        <option value="mp3">MP3</option>
        <option value="wav">WAV</option>
        <option value="mp4">MP4</option>
      </select>
      <div style={{marginTop:12}}>
        <button onClick={convert}>Convertir</button>
        <button onClick={poll} style={{marginLeft:8}}>Vérifier</button>
      </div>
      <div style={{marginTop:12}}>Job: {jobId} — status: {status}</div>
    </div>
  );
                                 }
