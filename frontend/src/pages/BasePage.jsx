import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function BasePage() {
  const [bases, setBases] = useState([]);
  const [form, setForm] = useState({ name: '', location: '' });

  const fetchBases = async () => {
    const res = await axios.get('/bases');
    setBases(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/bases', form);
    setForm({ name: '', location: '' });
    fetchBases();
  };

  useEffect(() => {
    fetchBases();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Bases</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <input
          className="input"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Base Name"
          required
        />
        <input
          className="input"
          name="location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Base</button>
      </form>

      <table className="mt-6 w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {bases.map((b) => (
            <tr key={b._id}>
              <td className="border p-2">{b.name}</td>
              <td className="border p-2">{b.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
