import { useNavigate, useLocation } from "react-router-dom";

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
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Add Worker", path: "/add-worker", icon: "👷" },
    { label: "Attendance Log", path: "/attendance", icon: "📅" },
    { label: "Reports", path: "/reports", icon: "📈" },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand-header" style={{ marginBottom: "24px", padding: "0 8px" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main, #1F2937)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "#fff", width: "32px", height: "32px", borderRadius: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
            ⚡
          </span>
          DailyWage
        </h2>
      </div>

      {/* User Profile */}
      <div className="profile">
        <div className="avatar" style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)", color: "#FFF", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {userInitial}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p className="profile-name" style={{ fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {username}
          </p>
          <p className="profile-role" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
            System Admin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="menu">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <p
              key={item.path}
              className={isActive ? "active" : ""}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                padding: "10px 14px",
                borderRadius: "12px",
                marginBottom: "6px",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.2s ease",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </p>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="logout"
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          padding: "12px 14px",
          borderRadius: "12px",
          color: "#EF4444",
          fontWeight: "600",
        }}
      >
        <span>🚪</span>
        <span>Logout</span>
      </div>
    </aside>
  );
}

export default Sidebar;