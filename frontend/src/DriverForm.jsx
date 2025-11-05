import React, { useState } from 'react';
import API from './api';


export default function DriverForm(){
const [vehicle, setVehicle] = useState('');
const [desc, setDesc] = useState('');
const [ok, setOk] = useState(null);


async function submit(e){
e.preventDefault();
if(!vehicle || !desc) return setOk('fill both');
const start = performance.now();
const r = await API.post('/defects', { vehicle_id: vehicle, description: desc });
const dur = performance.now() - start;
setOk('submitted in ' + Math.round(dur) + 'ms');
setVehicle(''); setDesc('');
}


return (
<div style={{maxWidth:700, margin:'40px auto', fontFamily:'Inter, system-ui'}}>
<h2>Driver — Lodge defect</h2>
<form onSubmit={submit}>
<div style={{marginBottom:12}}>
<label>Vehicle ID</label><br/>
<input value={vehicle} onChange={e=>setVehicle(e.target.value)} style={{width:'100%', padding:8}} />
</div>
<div style={{marginBottom:12}}>
<label>Short defect description</label><br/>
<textarea value={desc} onChange={e=>setDesc(e.target.value)} maxLength={300} rows={4} style={{width:'100%', padding:8}} />
</div>
<button type="submit" style={{padding:'10px 18px'}}>Submit</button>
{ok && <div style={{marginTop:12}}>{ok}</div>}
</form>
</div>
);
}
