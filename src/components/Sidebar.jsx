import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Profile */}
      <div className="profile">
        <div className="avatar">👤</div>
        <div>
          <p className="profile-name">Admin</p>
          <p className="profile-role">Owner</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="menu">
        <p className="active" onClick={() => navigate("/dashboard")}>
          Dashboard
        </p>
        <p onClick={() => navigate("/add-worker")}>Add Worker</p>
        <p onClick={() => navigate("/attendance")}>Attendance</p>
        <p onClick={() => navigate("/reports")}>Reports</p>
      </nav>

      {/* Logout */}
      <div className="logout" onClick={handleLogout}>
        🚪 Logout
      </div>
    </aside>
  );
}

export default Sidebar;