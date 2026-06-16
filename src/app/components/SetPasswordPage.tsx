import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Lock } from "lucide-react";

export function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session, profile } = useAuth();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!session && !loading) {
      navigate("/login");
    }
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      // Automatically try to upgrade status to ACTIVE if user was INVITED
      if (profile && profile.status === "INVITED") {
        await supabase
          .from("users")
          .update({ status: "ACTIVE" })
          .eq("id", profile.id);
      }

      toast.success("Password set successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fbf7ef] p-4 font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#182033]">
      {/* Background decorations matching LoginPage */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 72% 8%, rgba(249,115,22,0.07), transparent 32rem), radial-gradient(circle at 10% 82%, rgba(30,58,95,0.06), transparent 28rem)",
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-[24px] bg-white p-8 shadow-[0_12px_40px_-12px_rgba(30,58,95,0.08)] sm:p-10 border border-slate-100">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-orange-50 to-orange-100/50 text-[#ea580c] ring-1 ring-[#ea580c]/10">
            <Lock size={28} strokeWidth={2} />
          </div>
          <h1 className="mb-2 font-['Sora',sans-serif] text-2xl font-bold tracking-tight text-[#182033]">
            Set Your Password
          </h1>
          <p className="text-sm text-[#556174]">
            Please create a secure password to activate your Marketiv Finance account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-[#556174]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#182033] outline-none transition-all placeholder:text-slate-400 focus:border-[#ea580c] focus:bg-white focus:ring-4 focus:ring-[#ea580c]/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold uppercase tracking-wider text-[#556174]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#182033] outline-none transition-all placeholder:text-slate-400 focus:border-[#ea580c] focus:bg-white focus:ring-4 focus:ring-[#ea580c]/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 8}
            className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#fb7a18] to-[#ea580c] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(234,88,12,0.3)] transition-all hover:scale-[1.01] hover:shadow-[0_12px_24px_-6px_rgba(234,88,12,0.4)] disabled:pointer-events-none disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <span>Save Password & Continue</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
