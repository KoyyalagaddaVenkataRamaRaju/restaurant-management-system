import { Navigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role");
  console.log("Protected Route - Role from Storage:", role);
  console.log("Allowed Roles:", allowedRoles);

  if (!role) {
    console.log("No role found, redirecting to login.");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    console.log("Role not allowed, redirecting to login.");
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
