import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (authLoading) {
    return null;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Successfully logged in");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0c172b] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(249,115,22,0.15), transparent 40rem)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img src="/logo_marketiv.png" alt="Marketiv Logo" className="w-14 h-auto object-contain" />
            <span className="text-white text-xl font-bold tracking-tight font-['Sora']">Marketiv</span>
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-6 font-['Sora']">Marketiv Financial System</h1>
          <p className="text-slate-300 text-lg max-w-md mb-12 leading-relaxed">P2MW 2026 Budget Planning, Transaction Tracking, and Financial Accountability Platform.</p>
          <div className="space-y-6">
            {["Budget Planning", "Transaction Management", "Financial Reporting"].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#ea580c]" />
                </div>
                <span className="text-slate-200 font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-slate-500 text-sm font-medium">&copy; {new Date().getFullYear()} Marketiv Studio. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-[#fbf7ef] flex items-center justify-center p-6 relative">
        <div
          className="absolute inset-0 pointer-events-none z-0 lg:hidden"
          style={{
            background: "radial-gradient(circle at top right, rgba(249,115,22,0.08), transparent 20rem)",
          }}
        />
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <img src="/logo_marketiv.png" alt="Marketiv Logo" className="w-10 h-auto object-contain" />
            <span className="text-[#182033] text-xl font-bold tracking-tight font-['Sora']">Marketiv</span>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl font-bold text-[#182033] mb-2 font-['Sora']">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-8">Sign in to access your dashboard.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#182033] mb-2">Email Address</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#fb7a18] focus:ring-2 focus:ring-[#fb7a18]/20 transition-all font-medium text-[#182033]"
                  placeholder="name@marketiv.id"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#182033] mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#fb7a18] focus:ring-2 focus:ring-[#fb7a18]/20 transition-all font-medium text-[#182033]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Feature under construction");
                  }}
                  className="text-sm font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-b from-[#fb7a18] to-[#ea580c] text-white font-bold text-sm shadow-[0_8px_20px_rgba(234,88,12,0.25)] hover:shadow-[0_10px_25px_rgba(234,88,12,0.35)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
