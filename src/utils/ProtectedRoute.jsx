// Example in React
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // or your auth system

function ProtectedRoute({ children }) {
  const { isSignedIn } = useAuth();
  return isSignedIn ? children : <Navigate to="/" />;
}

export default ProtectedRoute;