import { Navigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { useAuth } from "../contexts/AuthContext";

export default function GuestRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Loading workspace..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

