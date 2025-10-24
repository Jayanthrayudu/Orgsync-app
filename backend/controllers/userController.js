const { User, Organization } = require('../models');
const { validateUser } = require('../utils/validation');

class UserController {
  // Get all users for an organization
  static async getUsersByOrganization(req, res) {
    try {
      const { orgId } = req.params;
      const users = await User.findAll({
        where: { organizationId: orgId },
        order: [['id', 'ASC']]
      });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
  }

  // Create user for an organization
static async createUser(req, res) {
  try {
    const { orgId } = req.params;
    console.log("Request body:", req.body); // <--- check what frontend sends
    const { error, value } = validateUser({ ...req.body, organizationId: orgId });
    if (error) {
      console.log("Validation error:", error.details);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const org = await Organization.findByPk(orgId);
    if (!org) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    if (value.role === 'Co-ordinator') {
      const currentCoordinators = await User.count({ where: { organizationId: orgId, role: 'Co-ordinator' } });
      if (currentCoordinators >= org.maxCoordinatorsAllowed) {
        return res.status(400).json({ success: false, message: `Maximum ${org.maxCoordinatorsAllowed} coordinators allowed` });
      }
    }

    console.log("Creating user with:", value);
    const user = await User.create(value);
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
}



  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = validateUser(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const [updatedRows] = await User.update(value, { where: { id } });
      if (updatedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });

      const updatedUser = await User.findByPk(id);
      res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await User.destroy({ where: { id } });
      if (deletedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });

      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
  }
}

module.exports = UserController;
