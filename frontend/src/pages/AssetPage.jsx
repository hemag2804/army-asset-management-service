import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: '',
    serialNumber: '',
    quantity: '',
    baseId: ''
  });

  useEffect(() => {
    axios.get('/assets').then((res) => setAssets(res.data));
    axios.get('/bases').then((res) => setBases(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/assets', form);
    setForm({ name: '', type: '', serialNumber: '', quantity: '', baseId: '' });
    const res = await axios.get('/assets');
    setAssets(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Assets</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <input className="input" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
        <input className="input" name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type" required />
        <input className="input" name="serialNumber" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} placeholder="Serial Number" required />
        <input className="input" name="quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Quantity" required />
        <select className="input" name="baseId" value={form.baseId} onChange={(e) => setForm({ ...form, baseId: e.target.value })} required>
          <option value="">Select Base</option>
          {bases.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Asset</button>
      </form>

      <table className="mt-6 w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Serial</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Base</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a._id}>
              <td className="border p-2">{a.name}</td>
              <td className="border p-2">{a.type}</td>
              <td className="border p-2">{a.serialNumber}</td>
              <td className="border p-2">{a.quantity}</td>
              <td className="border p-2">{a.baseId?.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
