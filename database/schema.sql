CREATE DATABASE IF NOT EXISTS orgsync_db;
USE orgsync_db;

-- Organizations table
CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  organizationSLUG VARCHAR(100) NOT NULL UNIQUE,
  primaryAdminName VARCHAR(255) NOT NULL,
  primaryAdminEmail VARCHAR(255) NOT NULL UNIQUE,
  supportEmail VARCHAR(255) NOT NULL,
  phoneNo VARCHAR(20),
  alternatePhoneNo VARCHAR(20),
  maxCoordinatorsAllowed INT DEFAULT 5,
  timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
  language VARCHAR(50) DEFAULT 'English',
  officialWebsiteURL VARCHAR(500),
  logo VARCHAR(500),
  status ENUM('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
  pendingRequests INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('Admin', 'Co-ordinator') NOT NULL,
  organizationId INT NOT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
);