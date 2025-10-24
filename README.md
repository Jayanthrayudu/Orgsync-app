# OrgSync

OrgSync is a simple organization management web application built with **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend. It allows admins to manage organizations, view details, and track requests and status.  

Note: Authentication (JWT/login) is **not implemented** as it was not required for the demo. The app currently allows direct access to all pages.

---

## Features

- View all organizations in a table (desktop) or card view (mobile)
- View organization details
- Delete organizations with a confirmation modal
- Responsive design for mobile, tablet, and desktop
- Sidebar navigation with active route highlighting
- Dashboard overview (placeholder for metrics)
- Pending requests badge with default values

---
## ER Diagram (Database Design)

![ER Diagram](ER_Diagram.pdf)

> **PDF Version:** [ER_Diagram.pdf](ER_Diagram.pdf)  
> **Relationship:** One `Organization` → Many `Users`  
> `organizationId` in `Users` is a **Foreign Key (FK)** referencing `Organizations.id`

### Entities:

**Organizations**
- `id`: INTEGER (PK)
- `name`: STRING
- `slug`: STRING
- `organizationSLUG`: STRING
- `primaryAdminName`: STRING
- `primaryAdminEmail`: STRING
- `supportEmail`: STRING
- `phoneNo`: STRING
- `status`: ENUM
- `pendingRequests`: INTEGER

**Users**
- `id`: INTEGER (PK)
- `username`: STRING
- `email`: STRING
- `role`: ENUM
- `status`: ENUM
- `organizationId`: INTEGER (FK)

---

## Technologies Used

**Frontend:**
- React (Vite)
- Bootstrap 5
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- MongoDB (Atlas)
- REST APIs

**Other:**
- Axios for API calls
- Local storage for storing logos

---