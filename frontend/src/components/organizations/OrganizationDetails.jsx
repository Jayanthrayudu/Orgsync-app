import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { organizationAPI, userAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import UserList from '../users/UserList'
import AddUser from '../users/AddUser'
import { Building2, Users, Pencil, Save , Mail, Phone, Globe } from 'lucide-react'

const OrganizationDetails = () => {
  const { id } = useParams()
  const [org, setOrg] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchOrganizationDetails()
  }, [id])

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true)
      setError('')
      const [orgRes, usersRes] = await Promise.all([
        organizationAPI.getById(id),
        userAPI.getByOrg(id)
      ])
      const orgData = orgRes.data.data

      const savedLogo = localStorage.getItem(`orgLogo-${id}`)
      if (savedLogo) orgData.logo = savedLogo

      setOrg(orgData)
      setUsers(usersRes.data.data || [])
    } catch (err) {
      setError('Failed to load organization details')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setOrg((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveChanges = async () => {
    try {
      alert('Changes saved successfully!')
      setIsEditing(false)
    } catch (err) {
      alert('Error saving changes')
      console.error(err)
    }
  }

  if (loading)
    return (
      <div className="card text-center p-5">
        <LoadingSpinner />
        <p className="mt-2 text-muted">Loading organization details...</p>
      </div>
    )

  if (error) return <ErrorMessage message={error} />

  if (!org)
    return (
      <div className="card text-center p-5">
        <h5 className="text-muted">Organization not found</h5>
      </div>
    )

  return (
    <div>
      {/* ORGANIZATION HEADER CARD */}
      <div className="card mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-3 text-center text-md-start mb-3 mb-md-0">
              <div
                className="position-relative mx-auto mx-md-0"
                style={{ width: '100px', height: '100px' }}
              >
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt="Organization Logo"
                    className="rounded-circle border"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <Building2 size={36} className="text-white" />
                  </div>
                )}

                {/* Upload Button */}
                <label
                  htmlFor="orgLogoUpload"
                  className="btn btn-sm btn-light border position-absolute bottom-0 end-0 mb-1 me-1 rounded-circle shadow-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Pencil size={16} />
                </label>
                <input
                  id="orgLogoUpload"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        localStorage.setItem(`orgLogo-${id}`, reader.result)
                        setOrg((prev) => ({ ...prev, logo: reader.result }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>

            <div className="col-md-9 position-relative">
              <h1 className="h2 fw-bold mb-2">{org.name}</h1>
              <p className="text-muted mb-3 fs-6">{org.primaryAdminEmail}</p>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <span
                  className={`badge fs-6 fw-semibold ${
                    org.status === 'Active'
                      ? 'bg-success'
                      : org.status === 'Inactive'
                      ? 'bg-warning text-dark'
                      : 'bg-danger'
                  }`}
                >
                  {org.status}
                </span>
                <span className="badge bg-primary fs-6">
                  {org.pendingRequests || 0} Pending Requests
                </span>
              </div>


                <div className="row g-3 align-items-center mt-3 contact-info-row">
                  {/* EMAIL */}
                  <div className="col-12 col-md-4 d-flex align-items-center">
                    <div
                      className="bg-white border rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                      style={{ width: '40px', height: '40px', flexShrink: 0 }}
                    >
                      <Mail size={20} className="text-secondary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <div className="fw-semibold text-dark">
                        {org.supportEmail || org.primaryAdminEmail}
                      </div>
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="col-12 col-md-4 d-flex align-items-center">
                    <div
                      className="bg-white border rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                      style={{ width: '40px', height: '40px', flexShrink: 0 }}
                    >
                      <Phone size={20} className="text-secondary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Phone</small>
                      <div className="fw-semibold text-dark">{org.phoneNo || 'N/A'}</div>
                    </div>
                  </div>

                  {/* WEBSITE */}
                  <div className="col-12 col-md-4 d-flex align-items-center">
                    <div
                      className="bg-white border rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                      style={{
                        width: '40px',
                        height: '40px',
                        flexShrink: 0,
                        backgroundColor: '#e6f2ff',
                      }}
                    >
                      <Globe size={20} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Website</small>
                      <a
                        href={org.officialWebsiteURL || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fw-semibold text-skyblue text-decoration-none"
                      >
                        {org.officialWebsiteURL || 'N/A'}
                      </a>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
             Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
        </li>
      </ul>

      {/* BASIC DETAILS TAB */}
      {activeTab === 'basic' && (
        <div className="card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Profile</h5>
          </div>
            {/* Edit Icon */}
              <button
                className="btn btn-light border position-absolute top-1 end-0 me-3"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <Pencil size={16} className="me-1" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>

          <div className="row g-4">
            {[
              ['Organization Name', 'name'],
              ['Organization Slug', 'slug'],
              ['Primary Admin Name', 'primaryAdminName'],
              ['Primary Admin Email', 'primaryAdminEmail'],
              ['Support Email', 'supportEmail'],
              ['Website URL', 'officialWebsiteURL'],
              ['Primary Phone', 'phoneNo'],
              ['Alternate Phone', 'alternatePhoneNo'],
              ['Timezone', 'timezone'],
              ['Language', 'language']
            ].map(([label, field]) => (
              <div key={field} className="col-md-6">
                <label className="form-label text-muted small fw-semibold">
                  {label}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={org[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                ) : (
                  <div className="form-control bg-light">{org[field] || 'N/A'}</div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="text-end mt-4">
              <button className="btn btn-success" onClick={handleSaveChanges}>
                <Save size={16} className="me-1" /> Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <Users size={20} className="me-2" />
              Users ({users.length})
            </h5>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddUserModal(true)}
            >
              <i className="bi bi-plus-lg me-1"></i>Add User
            </button>
          </div>
          <UserList users={users} />
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <AddUser
          orgId={id}
          onClose={() => setShowAddUserModal(false)}
          onSuccess={fetchOrganizationDetails}
        />
      )}
    </div>
  )
}

export default OrganizationDetails
