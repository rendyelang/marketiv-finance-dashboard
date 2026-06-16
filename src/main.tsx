import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AuthProvider } from "./app/contexts/AuthContext.tsx";
import { LoginPage } from "./app/components/LoginPage.tsx";
import { ProtectedRoute } from "./app/components/ProtectedRoute.tsx";
import { SetPasswordPage } from "./app/components/SetPasswordPage.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";

// Intercept the invite link from Supabase before routes resolve
function HashInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.includes("type=invite") || window.location.hash.includes("type=recovery")) {
      navigate("/set-password", { replace: true });
    }
  }, [navigate]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
        }}
      />
      <HashInterceptor />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<App />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);