import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import ManageOrganizations from "./pages/ManageOrganizations";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const location = useLocation();

  useEffect(() => {
    // Close mobile sidebar 
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <>
      <style>{`
        .sidebar-slide {
          transition: transform 0.3s ease-in-out;
          transform: translateX(-100%);
        }
        .sidebar-open {
          transform: translateX(0) !important;
        }
        .sidebar-closed {
          transform: translateX(-100%) !important;
        }
        @media (min-width: 992px) {
          .sidebar-slide {
            transform: translateX(0) !important;
          }
          .sidebar-closed {
            transform: translateX(-100%) !important;
          }
        }
      `}</style>

      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />

        <div className="d-flex flex-grow-1 position-relative">
          {/* Mobile overlay */}
          {sidebarOpen && window.innerWidth < 992 && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              sidebar-slide bg-white border-end
              position-fixed start-0 top-0 h-100
              ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}
            `}
            style={{ width: "280px", zIndex: 1050 }}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>

          {/* Main content */}
          <main className="flex-grow-1 transition-all duration-300" style={{
            marginLeft: sidebarOpen && window.innerWidth >= 992 ? "280px" : "0"
          }}>
            <div className="container-fluid py-4 px-3 px-lg-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/manage-organizations" element={<ManageOrganizations />} />
                <Route path="/organization/:id" element={<OrganizationDetailsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
export default App;