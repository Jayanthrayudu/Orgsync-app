import { useState } from 'react'
import { X, Check } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const AddUser = ({ onClose, onSuccess, orgId }) => {
  const [formData, setFormData] = useState({ username: '', email: '', role: 'Admin' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await fetch(`/api/users/${orgId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure?')) return;
  try {
    await axios.delete(`/api/users/${id}`);
    alert('Deleted successfully');
    const res = await axios.get(`/api/users/${orgId}`);
    setUsers(res.data.data); 
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add User</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Co-ordinator">Co-ordinator</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <LoadingSpinner /> : <Check size={16} className="me-2" />}
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser