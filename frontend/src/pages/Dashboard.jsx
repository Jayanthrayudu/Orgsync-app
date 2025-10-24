import { useState, useEffect } from "react";
import { organizationAPI } from "../services/api"; 
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Users, Building2, Activity } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrgs: 0, activeOrgs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await organizationAPI.getAll();

      const orgData = response?.data?.data || [];

      const total = orgData.length;
      const active = orgData.filter((org) => org.status === "Active").length;

      setStats({ totalOrgs: total, activeOrgs: active });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="h2 fw-bold mb-4">Dashboard</h1>

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className="card-text text-muted">Total Organizations</p>
                <h3 className="card-title text-primary">{stats.totalOrgs}</h3>
              </div>
              <Building2 size={32} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className="card-text text-muted">Active Organizations</p>
                <h3 className="card-title text-success">{stats.activeOrgs}</h3>
              </div>
              <Activity size={32} className="text-success" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
