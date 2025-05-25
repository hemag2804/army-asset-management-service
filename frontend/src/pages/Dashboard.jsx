import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Welcome to the Dashboard</h1>
      <p className="text-gray-700">
        Logged in as <span className="font-medium">{user?.role}</span>
      </p>

      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Quick Access</h3>
          <p className="text-lg font-semibold text-blue-700">Assets & Bases</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Your Role</h3>
          <p className="text-lg font-semibold capitalize">{user?.role}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">JWT Stored</h3>
          <p className="text-xs text-gray-600 break-all">{user?.token.slice(0, 40)}...</p>
        </div>
      </div>
    </div>
  );
}
