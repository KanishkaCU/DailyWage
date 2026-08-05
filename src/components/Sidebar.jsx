import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  FileText,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t, languages } = useLanguage();

  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { label: t("addWorker"), path: "/add-worker", icon: UserPlus },
    { label: t("attendance"), path: "/attendance", icon: CalendarCheck },
    { label: t("reports"), path: "/reports", icon: FileText },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE TOP HEADER ================= */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="truncate">
            <h2 className="text-base font-bold text-gray-900 tracking-tight leading-none">
              Daily<span className="text-brand-600">Wage</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-medium truncate">{t("tagline")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector Dropdown for Mobile Header */}
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-400 mr-1 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-gray-700 font-medium focus:outline-none text-xs cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ================= MOBILE SLIDING DRAWER BACKDROP ================= */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* ================= MOBILE SLIDING DRAWER ================= */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:hidden no-print ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Daily<span className="text-brand-600">Wage</span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {t("tagline")}
              </p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 pt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      isActive ? "text-brand-600" : "text-gray-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="px-3 pb-4 space-y-3">
          {/* Language Switcher */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-400 px-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-brand-500 cursor-pointer truncate"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
            <p className="text-[11px] text-gray-400">{t("owner")}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-60 lg:w-64 bg-white border-r border-gray-200 flex-col justify-between h-screen sticky top-0 shrink-0 no-print">
        <div>
          {/* Brand */}
          <div className="px-5 py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Daily<span className="text-brand-600">Wage</span>
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {t("tagline")}
            </p>
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
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      isActive ? "text-brand-600" : "text-gray-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-3 pb-4 space-y-3">
          {/* Language Switcher */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-400 px-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-brand-500 cursor-pointer truncate"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* User */}
          <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
            <p className="text-[11px] text-gray-400">{t("owner")}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;