
import {
  Heart,
  Home,
  Activity,
  CalendarDays,
  LogOut,
} from "lucide-react";

const links = [
  { name: "Dashboard", icon: Home },
  { name: "Cycle Tracker", icon: Activity },
  { name: "Academic Calendar", icon: CalendarDays },
];

export default function Sidebar({
  page,
  setPage,
  onLogout,
  user,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Heart size={24} />
        <span>HerSpace</span>
      </div>

      <p className="side-label">YOUR SPACE</p>

      {links.map(({ name, icon: Icon }) => (
        <button
          key={name}
          className={`nav-button ${
            page === name ? "active" : ""
          }`}
          onClick={() => setPage(name)}
        >
          <Icon size={18} />
          {name}
        </button>
      ))}

      <div className="sidebar-bottom">
        <div className="user-mini">
          <span className="avatar">
            {(user.displayName || user.email || "H")
              .charAt(0)
              .toUpperCase()}
          </span>

          <div>
            <strong>{user.displayName || "HerSpace user"}</strong>
            <small>{user.email}</small>
          </div>
        </div>

        <button className="nav-button logout" onClick={onLogout}>
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
