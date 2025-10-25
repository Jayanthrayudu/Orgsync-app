// src/components/users/AddUser.jsx
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { userAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const AddUser = ({ orgId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Co-ordinator', // default to Co-ordinator
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // USE userAPI → correct base URL
      await userAPI.create(orgId, formData)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user')
      console.error('Add user error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-2">
            <h5 className="modal-title fw-bold">Add User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body pt-2">
              {error && (
                <div className="alert alert-danger small mb-3" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  disabled={loading}
                >
                  <option value="Co-ordinator">Co-ordinator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer border-0 pt-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ms-2">Adding...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} className="me-1" />
                    Add User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser