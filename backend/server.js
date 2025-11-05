const express = require('express');


// notify manager via email
const link = `${process.env.FRONTEND_URL}/#/defect/${defect.id}`;
const mail = {
from: process.env.SMTP_USER,
to: process.env.MANAGER_EMAIL,
subject: `New defect: Vehicle ${vehicle_id}`,
text: `Vehicle: ${vehicle_id}\nDescription: ${description}\nLink: ${link}`,
html: `<p><b>Vehicle:</b> ${vehicle_id}</p><p><b>Description:</b> ${description}</p><p><a href="${link}">Open defect</a></p>`
};
transport.sendMail(mail).catch(err => console.error('Mail err', err));


// send real-time update
io.emit('defect_created', defect);
res.json(defect);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'server error' });
}
});


// List defects + basic filter
app.get('/api/defects', async (req, res) => {
try {
const { status, q } = req.query;
let base = 'SELECT * FROM defects';
const params = [];
const conditions = [];
if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
if (q) { params.push('%' + q + '%'); conditions.push(`(vehicle_id ILIKE $${params.length} OR description ILIKE $${params.length})`); }
if (conditions.length) base += ' WHERE ' + conditions.join(' AND ');
base += ' ORDER BY created_at DESC LIMIT 200';
const r = await pool.query(base, params);
res.json(r.rows);
} catch (err) { console.error(err); res.status(500).json({ error: 'server error' }); }
});


// Update status
app.patch('/api/defects/:id/status', async (req, res) => {
try {
const { id } = req.params;
const { status } = req.body;
const r = await pool.query('UPDATE defects SET status=$1, updated_at=now() WHERE id=$2 RETURNING *', [status, id]);
const updated = r.rows[0];
io.emit('defect_updated', updated);
res.json(updated);
} catch (err) { console.error(err); res.status(500).json({ error: 'server error' }); }
});


// basic manager "login" (demo: check email + password)
app.post('/api/manager/login', async (req, res) => {
// For production: replace with JWT or real auth.
const { email, password } = req.body;
if (email === process.env.MANAGER_EMAIL && password === process.env.MANAGER_PASSWORD) {
return res.json({ token: 'demo-token' });
}
return res.status(401).json({ error: 'unauthorized' });
});


io.on('connection', (socket) => {
console.log('socket connected', socket.id);
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Server running on', PORT));
