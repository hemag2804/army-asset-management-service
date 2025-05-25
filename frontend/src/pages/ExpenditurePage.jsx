import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function ExpenditurePage() {
  const [form, setForm] = useState({
    assetId: '',
    baseId: '',
    quantity: '',
    reason: ''
  });

  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [expenditures, setExpenditures] = useState([]);

  const fetchData = async () => {
    const [assetRes, baseRes, expendRes] = await Promise.all([
      axios.get('/assets'),
      axios.get('/bases'),
      axios.get('/expenditures')
    ]);
    setAssets(assetRes.data);
    setBases(baseRes.data);
    setExpenditures(expendRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/expenditures', form);
    setForm({ assetId: '', baseId: '', quantity: '', reason: '' });
    fetchData();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Log Expenditure</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <select className="input" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} required>
          <option value="">Select Asset</option>
          {assets.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
        <select className="input" value={form.baseId} onChange={(e) => setForm({ ...form, baseId: e.target.value })} required>
          <option value="">Select Base</option>
          {bases.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input className="input" placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Mark Expended</button>
      </form>

      <h3 className="mt-8 mb-2 font-semibold text-lg">Expenditure History</h3>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Asset</th>
              <th className="border p-2">Base</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenditures.map((e) => (
              <tr key={e._id}>
                <td className="border p-2">{e.assetId?.name}</td>
                <td className="border p-2">{e.baseId?.name}</td>
                <td className="border p-2">{e.quantity}</td>
                <td className="border p-2">{e.reason}</td>
                <td className="border p-2">{new Date(e.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
