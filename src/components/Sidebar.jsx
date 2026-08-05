import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  FileText,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Add Worker", path: "/add-worker", icon: UserPlus },
    { label: "Attendance", path: "/attendance", icon: CalendarCheck },
    { label: "Reports", path: "/reports", icon: FileText },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col justify-between min-h-screen no-print">
      <div>
        {/* Brand */}
        <div className="px-5 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Daily<span className="text-brand-600">Wage</span>
          </h2>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Attendance & Salary Manager</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 pt-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-brand-600" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-3">
        {/* User */}
        <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
          <p className="text-[11px] text-gray-400">Owner</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;