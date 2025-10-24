import { Menu, Bell, User } from "lucide-react";

const Header = ({ onMenuClick }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom sticky-top">
    <div className="container-fluid px-3 px-lg-4">
      {/* Menu button – NOW VISIBLE ON ALL SCREENS */}
      <button
        className="btn btn-link p-0 me-3"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      <a className="navbar-brand fw-bold text-primary" href="/">OrgSync</a>

      <div className="d-flex align-items-center gap-3 ms-auto">
        <button className="btn btn-link p-0 position-relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" style={{ fontSize: "0.65rem" }}>
            3
          </span>
        </button>
        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: "32px", height: "32px" }}>
          <User size={16} />
        </div>
      </div>
    </div>
  </nav>
);

export default Header;