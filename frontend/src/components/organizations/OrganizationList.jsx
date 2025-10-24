import { useState, useEffect } from "react";
import { Building2, Trash2, Eye } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { organizationAPI } from "../../services/api";

const OrganizationList = ({ organizations: orgs, loading = false, onRefresh }) => {
  const [organizations, setOrganizations] = useState(orgs);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);


  useEffect(() => {
    const orgsWithLogos = orgs.map((org) => {
      const savedLogo = localStorage.getItem(`orgLogo-${org.id}`);
      return {
        ...org,
        logo: savedLogo || org.logo || null,
        pendingRequests: org.pendingRequests ?? 10,
      };
    });
    setOrganizations(orgsWithLogos);
  }, [orgs]);

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await organizationAPI.delete(id);
      setOrganizations((prev) => prev.filter((org) => org.id !== id));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Delete organization error:", err.response?.data || err.message);
      alert("Failed to delete organization");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="card p-5 text-center">
        <LoadingSpinner />
        <p className="mt-2 text-muted">Loading organizations…</p>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="card p-5 text-center">
        <Building2 size={48} className="text-muted mb-3 mx-auto" />
        <h5 className="text-muted">No Organizations</h5>
        <p className="text-muted">Add your first organization to get started</p>
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-nowrap">Sr.no</th>
              <th scope="col">Organization</th>
              <th scope="col" className="text-center">Requests</th>
              <th scope="col" className="text-center">Status</th>
              <th scope="col" className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, idx) => (
              <tr key={org.id}>
                <td>{idx + 1}</td>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {/* PROFILE / LOGO */}
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        overflow: "hidden",
                        backgroundColor: org.logo ? "transparent" : "#0d6efd",
                        color: "white",
                        fontSize: "1rem",
                      }}
                    >
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        org.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="fw-semibold">{org.name}</div>
                      <small className="text-muted">{org.primaryAdminEmail}</small>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <span className="badge bg-primary">
                    {org.pendingRequests} Pending Request{org.pendingRequests === 1 ? "" : "s"}
                  </span>
                </td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      org.status === "Active"
                        ? "bg-success"
                        : org.status === "Inactive"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {org.status}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <a href={`/organization/${org.id}`} className="btn btn-sm" aria-label={`View ${org.name}`}>
                      <Eye size={16} />
                    </a>
                    <button
                      className="btn btn-sm"
                      onClick={() => setDeleteTarget(org)}
                      aria-label={`Delete ${org.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="d-md-none">
        {organizations.map((org, idx) => (
          <div key={org.id} className="card mb-0 shadow-sm border-0 rounded-3">
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-3 mb-2">
                {/* PROFILE / LOGO */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    backgroundColor: org.logo ? "transparent" : "#0d6efd",
                    color: "white",
                  }}
                >
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    org.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-semibold">{org.name}</h6>
                  <small className="text-muted d-block">{org.primaryAdminEmail}</small>
                </div>
                <div className="d-flex gap-2">
                  <a href={`/organization/${org.id}`} className="btn btn-sm btn-outline-primary" aria-label={`View ${org.name}`}>
                    <Eye size={16} />
                  </a>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(org)} aria-label={`Delete ${org.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <small className="text-muted me-3">Requests</small>
                  <span className="badge bg-primary">
                    {org.pendingRequests} Pending Request{org.pendingRequests === 1 ? "" : "s"}
                  </span>
                </div>
                <div>
                  <small className="text-muted me-2">Status</small>
                  <span
                    className={`badge ${
                      org.status === "Active"
                        ? "bg-success"
                        : org.status === "Inactive"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Delete Organization</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
                </p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" disabled={actionLoading} onClick={() => handleDelete(deleteTarget.id)}>
                  {actionLoading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationList;
