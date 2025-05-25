import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function PurchasePage() {
  const [form, setForm] = useState({ assetId: '', baseId: '', quantity: '' });
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const fetchData = async () => {
    const [assetRes, baseRes, purchaseRes] = await Promise.all([
      axios.get('/assets'),
      axios.get('/bases'),
      axios.get('/purchases'),
    ]);
    setAssets(assetRes.data);
    setBases(baseRes.data);
    setPurchases(purchaseRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/purchases', form);
      setForm({ assetId: '', baseId: '', quantity: '' });
      fetchData();
    } catch (err) {
      alert('Failed to record purchase');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Record Purchase</h2>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <select
          className="input"
          value={form.assetId}
          onChange={(e) => setForm({ ...form, assetId: e.target.value })}
          required
        >
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a._id} value={a._id}>{a.name} ({a.type})</option>
          ))}
        </select>

        <select
          className="input"
          value={form.baseId}
          onChange={(e) => setForm({ ...form, baseId: e.target.value })}
          required
        >
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        <input
          className="input"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Purchase
        </button>
      </form>

      <h3 className="mt-8 mb-2 font-semibold text-lg">Purchase History</h3>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Asset</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Base</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">{p.assetId?.name || '-'}</td>
                <td className="border p-2">{p.assetId?.type || '-'}</td>
                <td className="border p-2">{p.baseId?.name || '-'}</td>
                <td className="border p-2">{p.quantity}</td>
                <td className="border p-2">{new Date(p.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
