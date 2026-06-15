import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AuthProvider } from "./app/contexts/AuthContext.tsx";
import { LoginPage } from "./app/components/LoginPage.tsx";
import { ProtectedRoute } from "./app/components/ProtectedRoute.tsx";

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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<App />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);