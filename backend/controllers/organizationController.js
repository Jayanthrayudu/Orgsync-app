const { Organization, User } = require('../models');
const { validateOrganization } = require('../utils/validation');

class OrganizationController {
  // Get all organizations
  static async getAllOrganizations(req, res) {
    try {
      const organizations = await Organization.findAll({
        attributes: ['id', 'name', 'slug', 'status', 'pendingRequests', 'createdAt', 'updatedAt'],
        order: [['id', 'ASC']]
      });

      res.status(200).json({ success: true, data: organizations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch organizations', error: error.message });
    }
  }

  // Get organization by ID with users
  static async getOrganizationById(req, res) {
    try {
      const { id } = req.params;
      const organization = await Organization.findByPk(id, {
        include: [{
          model: User,
          as: 'users',
          attributes: ['id', 'username', 'role', 'status'],
          required: false
        }]
      });

      if (!organization) {
        return res.status(404).json({ success: false, message: 'Organization not found' });
      }

      res.status(200).json({ success: true, data: organization });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch organization', error: error.message });
    }
  }

  // Create organization
  static async createOrganization(req, res) {
    try {
      const { error, value } = validateOrganization(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const organizationData = {
        ...value,
        organizationSLUG: value.organizationSLUG || value.slug,
        alternatePhoneNo: value.alternatePhoneNo || null,
        timezone: value.timezone || 'Asia/Kolkata',
        language: value.language || 'English',
        officialWebsiteURL: value.officialWebsiteURL || null,
        logo: value.logo || null,
        status: value.status || 'Active',
        pendingRequests: value.pendingRequests || 0
      };

      const organization = await Organization.create(organizationData);
      res.status(201).json({ success: true, message: 'Organization created successfully', data: organization });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create organization', error: error.message });
    }
  }

  // Update organization
  static async updateOrganization(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = validateOrganization(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      if (!value.organizationSLUG) value.organizationSLUG = value.slug;

      const [updatedRows] = await Organization.update(value, { where: { id } });
      if (updatedRows === 0) return res.status(404).json({ success: false, message: 'Organization not found' });

      const updatedOrganization = await Organization.findByPk(id);
      res.status(200).json({ success: true, message: 'Organization updated successfully', data: updatedOrganization });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update organization', error: error.message });
    }
  }

  // Update organization status
  static async updateOrganizationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [updatedRows] = await Organization.update({ status }, { where: { id } });
      if (updatedRows === 0) return res.status(404).json({ success: false, message: 'Organization not found' });

      res.status(200).json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
    }
  }

  // Delete organization
  static async deleteOrganization(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await Organization.destroy({ where: { id } });
      if (deletedRows === 0) return res.status(404).json({ success: false, message: 'Organization not found' });

      res.status(200).json({ success: true, message: 'Organization deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete organization', error: error.message });
    }
  }
}

module.exports = OrganizationController;
