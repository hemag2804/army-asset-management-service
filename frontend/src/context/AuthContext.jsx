import '../index.css';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    return token ? { token, email, role } : null;
  });

  const login = (token, email, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    setUser({ token, email, role });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
