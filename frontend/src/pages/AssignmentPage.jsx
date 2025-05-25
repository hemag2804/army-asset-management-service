import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function AssignmentPage() {
  const [form, setForm] = useState({
    assetId: '',
    baseId: '',
    assignedTo: '',
    quantity: '',
  });

  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const fetchData = async () => {
    const [assetRes, baseRes, userRes, assignRes] = await Promise.all([
      axios.get('/assets'),
      axios.get('/bases'),
      axios.get('/users'), // Create API if not existing
      axios.get('/assignments'),
    ]);
    setAssets(assetRes.data);
    setBases(baseRes.data);
    setUsers(userRes.data);
    setAssignments(assignRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/assignments', form);
    setForm({ assetId: '', baseId: '', assignedTo: '', quantity: '' });
    fetchData();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <select className="input" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} required>
          <option value="">Select Asset</option>
          {assets.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
        <select className="input" value={form.baseId} onChange={(e) => setForm({ ...form, baseId: e.target.value })} required>
          <option value="">Select Base</option>
          {bases.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required>
          <option value="">Assign To</option>
          {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
        </select>
        <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Assign</button>
      </form>

      <h3 className="mt-8 mb-2 font-semibold text-lg">Assignment History</h3>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Asset</th>
              <th className="border p-2">Base</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id}>
                <td className="border p-2">{a.assetId?.name}</td>
                <td className="border p-2">{a.baseId?.name}</td>
                <td className="border p-2">{a.assignedTo?.name}</td>
                <td className="border p-2">{a.quantity}</td>
                <td className="border p-2">{new Date(a.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
