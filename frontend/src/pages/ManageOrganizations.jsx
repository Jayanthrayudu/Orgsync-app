import { useState, useEffect } from 'react'
import { organizationAPI } from '../services/api';
import AddOrganization from '../components/organizations/AddOrganization'
import OrganizationList from '../components/organizations/OrganizationList'

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrganizations()
  }, [])

const fetchOrganizations = async () => {
  try {
    const response = await organizationAPI.getAll();
    const orgs = response?.data?.data || [];
    setOrganizations(orgs);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Organizations</h1>
          <p className="text-muted">Manage your B2B organizations</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>Add Organization
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <OrganizationList
            organizations={organizations}
            loading={loading}
          />
        </div>
      </div>

      {showModal && (
        <AddOrganization
          onClose={() => setShowModal(false)}
          onSuccess={fetchOrganizations}
        />
      )}
    </>
  )
}

export default ManageOrganizations