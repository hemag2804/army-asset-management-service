import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="font-bold text-lg">Military Asset System</h1>
      {user && (
        <div className="flex gap-4 items-center">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          {user.role === 'admin' && (
            <>
              <Link to="/bases" className="hover:underline">Bases</Link>
              <Link to="/assets" className="hover:underline">Assets</Link>
              <Link to="/purchases" className="hover:underline">Purchases</Link>
            </>
          )}
          {['admin', 'commander'].includes(user.role) && (
            <>
              <Link to="/transfers" className="hover:underline">Transfers</Link>
              <Link to="/assignments" className="hover:underline">Assignments</Link>
              <Link to="/expenditures" className="hover:underline">Expenditures</Link>
            </>
          )}
          <button onClick={handleLogout} className="ml-4 bg-white text-blue-700 font-semibold px-3 py-1 rounded hover:bg-gray-100">Logout</button>
        </div>
      )}
    </nav>
  );
}
