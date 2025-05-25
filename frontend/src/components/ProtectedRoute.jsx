import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  console.log("User: ", user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
