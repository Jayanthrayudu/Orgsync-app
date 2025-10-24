import { X, LayoutDashboard, Building2 } from "lucide-react";

const Sidebar = ({ onClose }) => {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/manage-organizations", label: "Organizations", icon: <Building2 size={20} /> },
  ];

  const currentPath = window.location.pathname;

  return (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <a href="/" className="fw-bold text-primary fs-5 text-decoration-none">
          OrgSync
        </a>

        {/* X button – mobile (< 900 px) AND large (≥ 900 px) */}
        <button
          className="btn btn-link p-0"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* ---- Menu ---- */}
      <nav className="flex-grow-1 p-3 overflow-auto">
        <div className="nav flex-column gap-1">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={() => window.innerWidth < 900 && onClose()}
              className={`
                nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none
                ${currentPath === item.path
                  ? "bg-primary text-white"
                  : "text-secondary hover-bg-light"}
              `}
            >
              {item.icon}
              <span className="fw-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
