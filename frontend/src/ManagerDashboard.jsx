import React, { useEffect, useState } from 'react';
import API from './api';
import socket from './socket';


export default function ManagerDashboard(){
const [defects, setDefects] = useState([]);
const [q, setQ] = useState('');


const load = async () => { const r = await API.get('/defects', { params:{ q } }); setDefects(r.data); };
useEffect(()=>{ load(); socket.on('defect_created', d => setDefects(prev => [d,...prev])); socket.on('defect_updated', d => setDefects(prev => prev.map(x=>x.id===d.id?d:x))); return ()=>{ socket.off('defect_created'); socket.off('defect_updated'); } }, []);


const updateStatus = async (id, status) => { const r = await API.patch(`/defects/${id}/status`, { status }); /* state updated by socket too */ };


return (
<div style={{padding:20, fontFamily:'Inter, system-ui'}}>
<h2>Manager — Dashboard</h2>
<div style={{marginBottom:12}}>
<input placeholder="search vehicle or text" value={q} onChange={e=>setQ(e.target.value)} style={{padding:8, width:320}} />
<button onClick={load} style={{marginLeft:8}}>Search</button>
