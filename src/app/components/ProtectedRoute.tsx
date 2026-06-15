import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fbf7ef]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ea580c] border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (profile && profile.status !== "ACTIVE") {
    // If user is not active (e.g. INVITED but hasn't completed setup)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#fbf7ef] text-[#182033]">
        <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold mb-2">Account Disabled</h2>
          <p className="text-slate-500 mb-6">Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
