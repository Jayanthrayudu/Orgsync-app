import { useState, useEffect } from 'react'
import axios from 'axios'

const UserList = ({ users: propUsers, loading = false, onRefresh }) => {
  const [users, setUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({ username: '', email: '', role: '', organizationId: '' })
  const [editingUserId, setEditingUserId] = useState(null)

  useEffect(() => {
    setUsers(propUsers)
  }, [propUsers])

  // Delete logic
  const confirmDelete = (id) => {
    setSelectedUserId(id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/${selectedUserId}`)
      setUsers(users.filter((u) => u.id !== selectedUserId))
      setShowDeleteModal(false)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error deleting user')
    }
  }

  // Edit logic
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
    try {
      const res = await axios.put(`/api/users/${editingUserId}`, editFormData)
      setUsers(users.map((u) => (u.id === editingUserId ? res.data.data : u)))
      setShowEditModal(false)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error updating user')
    }
  }

  if (loading) return <p>Loading...</p>
  if (!users || users.length === 0) return <p className="text-center text-muted">No users found</p>

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
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
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'Admin' ? 'bg-primary' : 'bg-success'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => confirmDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
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
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Co-ordinator">Co-ordinator</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
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
