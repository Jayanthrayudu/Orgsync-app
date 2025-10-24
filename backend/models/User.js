module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('Admin', 'Co-ordinator'), allowNull: false },
    organizationId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' }
  }, { tableName: 'users', timestamps: true });

  // Association
  User.associate = (models) => {
    User.belongsTo(models.Organization, { foreignKey: 'organizationId', as: 'organization' });
  };

  return User;
};
