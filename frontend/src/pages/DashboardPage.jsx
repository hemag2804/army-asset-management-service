import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [bases, setBases] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    axios.get('/bases').then(res => setBases(res.data));
  }, []);

  const fetchMetrics = async () => {
    if (!baseId || !date) return;
    const res = await axios.get(`/dashboard/metrics?baseId=${baseId}&date=${date}`);
    setMetrics(res.data);
  };

  useEffect(() => {
    if (baseId) fetchMetrics();
  }, [baseId, date]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-blue-700 mb-4">Base Metrics Dashboard</h1>

      <div className="flex gap-4 mb-6 max-w-xl">
        <select className="input" value={baseId} onChange={(e) => setBaseId(e.target.value)}>
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        <button
          onClick={fetchMetrics}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Opening Balance" value={metrics.openingBalance} color="gray" />
          <MetricCard label="Closing Balance" value={metrics.closingBalance} color="blue" />
          <MetricCard label="Net Movement" value={metrics.netMovement} color="purple" />
          <MetricCard label="Purchases" value={metrics.purchases} color="green" />
          <MetricCard label="Transfer In" value={metrics.transferIn} color="emerald" />
          <MetricCard label="Transfer Out" value={metrics.transferOut} color="yellow" />
          <MetricCard label="Assigned" value={metrics.assigned} color="orange" />
          <MetricCard label="Expended" value={metrics.expended} color="red" />
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className={`bg-white border-l-4 border-${color}-500 p-4 rounded-xl shadow-sm`}>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className={`text-xl font-bold text-${color}-600`}>{value}</h3>
    </div>
  );
}
