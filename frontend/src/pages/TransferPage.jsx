import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function TransferPage() {
  const [form, setForm] = useState({
    assetId: '',
    fromBaseId: '',
    toBaseId: '',
    quantity: '',
  });

  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const fetchData = async () => {
    const [assetRes, baseRes, transferRes] = await Promise.all([
      axios.get('/assets'),
      axios.get('/bases'),
      axios.get('/transfers'),
    ]);
    setAssets(assetRes.data);
    setBases(baseRes.data);
    setTransfers(transferRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/transfers', form);
      setForm({ assetId: '', fromBaseId: '', toBaseId: '', quantity: '' });
      fetchData();
    } catch (err) {
      alert('Transfer failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Transfer Asset</h2>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <select
          className="input"
          value={form.assetId}
          onChange={(e) => setForm({ ...form, assetId: e.target.value })}
          required
        >
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} ({a.type})
            </option>
          ))}
        </select>

        <select
          className="input"
          value={form.fromBaseId}
          onChange={(e) => setForm({ ...form, fromBaseId: e.target.value })}
          required
        >
          <option value="">From Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={form.toBaseId}
          onChange={(e) => setForm({ ...form, toBaseId: e.target.value })}
          required
        >
          <option value="">To Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="input"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Transfer
        </button>
      </form>

      <h3 className="mt-8 mb-2 font-semibold text-lg">Transfer History</h3>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Asset</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr key={t._id}>
                <td className="border p-2">{t.assetId?.name}</td>
                <td className="border p-2">{t.fromBaseId?.name}</td>
                <td className="border p-2">{t.toBaseId?.name}</td>
                <td className="border p-2">{t.quantity}</td>
                <td className="border p-2">{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
