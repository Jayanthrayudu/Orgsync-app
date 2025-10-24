module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    organizationSLUG: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    primaryAdminName: { type: DataTypes.STRING(255), allowNull: false },
    primaryAdminEmail: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    supportEmail: { type: DataTypes.STRING(255), allowNull: false },
    phoneNo: { type: DataTypes.STRING(20) },
    alternatePhoneNo: { type: DataTypes.STRING(20) },
    maxCoordinatorsAllowed: { type: DataTypes.INTEGER, defaultValue: 5 },
    timezone: { type: DataTypes.STRING(100), defaultValue: 'Asia/Kolkata' },
    language: { type: DataTypes.STRING(50), defaultValue: 'English' },
    officialWebsiteURL: { type: DataTypes.STRING(500) },
    logo: { type: DataTypes.STRING(500) },
    status: { type: DataTypes.ENUM('Active', 'Inactive', 'Blocked'), defaultValue: 'Active' },
    pendingRequests: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, { tableName: 'organizations', timestamps: true });

  // Association
  Organization.associate = (models) => {
    Organization.hasMany(models.User, { foreignKey: 'organizationId', as: 'users' });
  };

  return Organization;
};
