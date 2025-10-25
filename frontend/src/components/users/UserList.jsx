// src/components/users/UserList.jsx
import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'

const UserList = ({ users: propUsers, loading = false, onRefresh }) => {
  const [users, setUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: '',
    organizationId: ''
  })
  const [editingUserId, setEditingUserId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setUsers(propUsers)
  }, [propUsers])

  // === DELETE USER ===
  const confirmDelete = (id) => {
    setSelectedUserId(id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedUserId) return
    setDeleting(true)
    try {
      await userAPI.delete(selectedUserId) // USE userAPI
      setUsers(users.filter((u) => u.id !== selectedUserId))
      setShowDeleteModal(false)
      onRefresh?.() // Optional refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  // === EDIT USER ===
  const handleEdit = (user) => {
    setEditingUserId(user.id)
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingUserId) return
    setSaving(true)
    try {
      const res = await userAPI.update(editingUserId, editFormData) // USE userAPI
      setUsers(users.map((u) => (u.id === editingUserId ? res.data.data : u)))
      setShowEditModal(false)
      onRefresh?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center py-4">Loading users...</p>
  if (!users || users.length === 0) return <p className="text-center text-muted py-4">No users found</p>

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="fw-medium">{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-info'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(user)}
                    title="Edit user"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => confirmDelete(user.id)}
                    title="Delete user"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === DELETE CONFIRMATION MODAL === */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
                <p className="text-muted small">
                  This action <strong>cannot be undone</strong>.
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === EDIT USER MODAL === */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  disabled={saving}
                />
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      disabled={saving}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Co-ordinator">Co-ordinator</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserList