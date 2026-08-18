import { ChevronLeft, User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-[1024px] h-[109px] flex items-center justify-between px-[30px]">
      {/* Back button */}
      <button
        type="button"
        aria-label="Go back"
        className="w-11 h-11 rounded-xl bg-[#1C1220] flex items-center justify-center text-white hover:bg-[#2C192B] transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#3A2138] flex items-center justify-center">
          <User className="w-5 h-5 text-white/80" />
        </div>
        <span className="text-white text-2xl font-bold">My Restaurant</span>
      </div>

      {/* Admin */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#3A2138] flex items-center justify-center">
          <User className="w-5 h-5 text-white/80" />
        </div>
        <div className="leading-tight">
          <p className="text-white font-semibold text-base">Admin</p>
          <p className="text-white/50 text-xs">Company Admin</p>
        </div>
      </div>
    </div>
  );
}