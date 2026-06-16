import { Bell, ChevronDown, Download, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface TopNavProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function TopNav({
  title = "Financial Dashboard",
  subtitle = "Marketiv P2MW Funding Overview",
  onMenuClick,
}: TopNavProps) {
  const { profile } = useAuth();
  
  const handleUnderConstruction = () => {
    toast.info("Feature under construction 🚧");
  };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between h-[76px] px-4 md:px-8 shrink-0 border-b border-slate-900/10 bg-[#fbf7ef]/90 backdrop-blur-[22px]">
      {/* Left: Title & Hamburger */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-900/5 rounded-xl transition-colors shrink-0"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="min-w-0">
          <div className="font-['Sora','Plus_Jakarta_Sans',sans-serif] text-[1.05rem] sm:text-lg md:text-[1.28rem] font-bold text-[#182033] tracking-[-0.04em] leading-none truncate">
            {title}
          </div>
          <div className="hidden sm:block text-slate-500 text-[0.81rem] font-semibold mt-1.5 truncate">
            {subtitle}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Export button */}
        <button 
          onClick={handleUnderConstruction}
          className="hidden sm:flex items-center gap-2 h-[42px] px-3 md:px-4 rounded-xl bg-gradient-to-b from-white/95 to-neutral-50/85 border border-slate-900/10 shadow-[0_10px_24px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.92)] text-[#182033] text-[0.83rem] font-bold tracking-[-0.01em] hover:bg-neutral-50 transition-colors shrink-0 cursor-pointer"
        >
          <Download size={15} />
          <span className="hidden lg:inline">Export</span>
        </button>

        {/* Notification */}
        <button 
          onClick={handleUnderConstruction}
          className="relative flex items-center justify-center w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-xl bg-white border border-slate-900/10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] text-[#556174] hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
        >
          <Bell size={17} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f97316] border-2 border-white" />
        </button>

        {/* User Profile */}
        <button 
          onClick={handleUnderConstruction}
          className="flex items-center gap-2 md:gap-2.5 h-[38px] md:h-[42px] pl-1.5 pr-1.5 sm:pr-2 md:pr-3.5 rounded-xl bg-white border border-slate-900/10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
        >
          <div className="w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-lg bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,0.9)_0_12%,transparent_13%),linear-gradient(135deg,#fed7aa,#fb923c)] shrink-0" />
          <div className="hidden sm:block text-left max-w-[120px]">
            <div className="text-[0.81rem] font-bold text-[#182033] tracking-[-0.02em] leading-none truncate">
              {profile?.full_name || (profile?.role === "ADMIN" ? "Admin" : "Member")}
            </div>
            <div className="text-[0.70rem] font-semibold text-[#556174] mt-0.5 truncate">
              {profile?.position || "Staff"}
            </div>
          </div>
          <ChevronDown size={13} className="hidden sm:block text-[#556174] shrink-0" />
        </button>
      </div>
    </div>
  );
}

