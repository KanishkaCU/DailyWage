import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  BarChart3,
  LogOut,
  Zap,
  ShieldCheck,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Admin User";
  const userInitial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Add Worker", path: "/add-worker", icon: UserPlus },
    { label: "Attendance Log", path: "/attendance", icon: CalendarCheck },
    { label: "Reports", path: "/reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 min-h-screen no-print">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              DailyWage
            </h2>
            <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase">
              Workforce Pro
            </span>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 mb-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm text-slate-100 truncate">
              {username}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              Owner Admin
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;