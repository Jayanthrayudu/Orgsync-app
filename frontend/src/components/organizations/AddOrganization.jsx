import { useState } from 'react'
import { Check } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import { organizationAPI } from '../../services/api'

const AddOrganization = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    organizationSLUG: '',
    primaryAdminName: '',
    primaryAdminEmail: '',
    supportEmail: '',
    phoneNo: '',
    maxCoordinatorsAllowed: 5
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        organizationSLUG: formData.organizationSLUG || formData.slug,
        alternatePhoneNo: '',
        timezone: 'Asia/Kolkata',
        language: 'English',
        officialWebsiteURL: '',
        logo: ''
      }

      await organizationAPI.create(dataToSend)

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Add organization error:', error.response?.data || error.message)
      setErrors(error.response?.data || { message: 'Something went wrong!' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Organization</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.message && <ErrorMessage message={errors.message} />}

              {/* Organization Name & Slug */}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Organization Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Slug *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Admin Info */}
              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.primaryAdminName}
                    onChange={(e) => setFormData({ ...formData, primaryAdminName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.primaryAdminEmail}
                    onChange={(e) => setFormData({ ...formData, primaryAdminEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Support Email & Phone */}
              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Support Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone No *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <LoadingSpinner /> : <Check size={16} className="me-2" />}
                {loading ? 'Adding...' : 'Add Organization'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddOrganization
