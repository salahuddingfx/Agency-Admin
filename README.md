# Nextora Studio

Nextora Studio is an enterprise-grade digital studio platform consisting of a public client portal, an internal administrator management dashboard, and a production-ready Express.js API gateway backend. It empowers startups and enterprise groups to catalog services, manage customer leads and contact requests, control digital portfolios, administer workflows/projects, issue client invoices, process career applications, and resolve customer support tickets.

## Monorepo Architecture Overview

This project is organized as a monorepo structured into three distinct sub-components:

```
nextora-studio/
├── client/          # Customer-facing public application (React, Vite, Tailwind CSS, Framer Motion)
├── admin/           # Enterprise management portal & CMS dashboard (React, Vite, Tailwind CSS)
└── server/          # Core backend REST API gateway (Node.js, Express, MongoDB, Mongoose)
```

---

## Technical Architecture & Core Stacks

### 1. Client App (`/client`)
A high-performance, visually immersive user interface constructed to showcase Nextora's portfolio, services, packages, and case studies, while integrating forms for careers, support, and sales discovery.
- **Framework & Tooling**: [React 19](https://react.dev/), [Vite](https://vite.dev/) (fast hot module reloading).
- **Aesthetics & Styles**: [Tailwind CSS](https://tailwindcss.com/) (modern responsive spacing, flex/grid systems), glassmorphism design tokens, customized mesh backgrounds, micro-interactions, and custom fonts.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid page transitions, viewport-triggered animations, and a customized premium hero typing effect.
- **Icons**: [Lucide React](https://lucide.dev/) for unified visual symbols.
- **State & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) for robust caching and server state updates.
- **Routing**: [React Router](https://reactrouter.com/) for single page routing.
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for sleek toast messages.

### 2. Admin App (`/admin`)
An internal-facing operational control panel providing analytical and CRUD capability over studio modules.
- **Framework & Tooling**: React, Vite.
- **Styling**: Tailwind CSS.
- **Features**: Complete dashboard for managing clients, leads, invoices, support tickets, system settings, blog publications, portfolio pieces, services, and career postings.

### 3. API Gateway & Server (`/server`)
A secure REST API gateway handling core authentication, media uploads, database persistence, invoice generation, and notifications.
- **Core Server**: [Express.js](https://expressjs.com/) (Node.js).
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/).
- **Authentication**: JWT authentication (stored securely in cookies/headers) and cryptographic password hashing with bcryptjs.
- **Security**:
  - `helmet` for HTTP security header protection.
  - `express-rate-limit` to prevent brute force and DDoS requests.
  - `express-mongo-sanitize` to block MongoDB injection exploits.
  - Custom XSS filters stripping HTML tags on input bodies.
- **API Documentation**: Built-in [Swagger UI](https://swagger.io/tools/swagger-ui/) for testing and referencing endpoints.
- **Integrations**:
  - `pdfkit` for server-side dynamic PDF invoice rendering.
  - `nodemailer` for outgoing invoice notifications and transactional emails.
  - `multer` + `cloudinary` for secure cloud media upload management.

---

## Detailed Directory Breakdown

### Backend API Endpoints

The API Gateway is mounted on `/api/v1` and hosts the following service modules:

| Endpoint Module | Primary Route Prefix | Description |
|---|---|---|
| **Auth** | `/api/v1/auth` | User login, registration, token refresh, and session status |
| **Users** | `/api/v1/users` | Manage user credentials, profiles, and basic data |
| **Admins** | `/api/v1/admins` | High-level administrative operations and configurations |
| **Services** | `/api/v1/services` | Service package configurations, lists, and features |
| **Portfolio** | `/api/v1/portfolios` | Case study visuals, tags, images, and project metadata |
| **Case Studies** | `/api/v1/case-studies` | Business outcome metrics, customer challenges, and details |
| **Blogs** | `/api/v1/blogs` | Tech blogging CMS (articles, categories, author credits) |
| **Teams** | `/api/v1/teams` | Employee registry, roles, socials, and bios |
| **Technologies** | `/api/v1/technologies` | Developer core stacks, frameworks, and system tags |
| **Testimonials** | `/api/v1/testimonials` | Client reviews, star ratings, and company badges |
| **Careers** | `/api/v1/careers` | Open position postings, salaries, and details |
| **Applications** | `/api/v1/applications`| Career applicants, resumes, and progress |
| **Contacts** | `/api/v1/contacts` | General contact requests and messages |
| **Leads** | `/api/v1/leads` | Sales funnel, project scopes, and customer discovery leads |
| **Clients** | `/api/v1/clients` | Customer directory, business details, and active accounts |
| **Projects** | `/api/v1/projects` | Project roadmaps, active deliverables, and phases |
| **Invoices** | `/api/v1/invoices` | Billing sheets, line items, payments, and PDF generation |
| **Tickets** | `/api/v1/tickets` | Support ticket logs, priorities, assignments, and chat |
| **Settings** | `/api/v1/settings` | App-wide layout settings, keys, and configurations |

---

## Installation & Local Setup

To run Nextora Studio locally, make sure you have [Node.js (v18+)](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your system.

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd nextora-studio
```

### Step 2: Configure Environment Variables

Create `.env` configuration files inside each of the folders:

#### Backend Server Environment (`/server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nextora_studio
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Email Transporter Configuration (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@nextora.studio

# Cloud Media Store (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

#### Client Frontend Environment (`/client/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

#### Admin Dashboard Environment (`/admin/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Step 3: Install Dependencies & Run

Open three terminal windows (or use background processes) to start each sub-component:

#### 1. Start API Server
```bash
cd server
npm install
npm run dev
```
*The API gateway will start on [http://localhost:5000](http://localhost:5000) and Swagger API docs can be viewed at [http://localhost:5000/api-docs](http://localhost:5000/api-docs).*

#### 2. Start Client Web Application
```bash
cd client
npm install
npm run dev
```
*The client app will launch on [http://localhost:5173](http://localhost:5173).*

#### 3. Start Admin Dashboard App
```bash
cd admin
npm install
npm run dev
```
*The admin interface will launch on [http://localhost:5174](http://localhost:5174).*

---

## Docker Deployment (Production)

The backend server is containerized and ready for production staging using Docker:

### Build & Run via Docker Compose (Server only)
Navigate to the `/server` directory and run:
```bash
cd server
docker-compose up --build
```
This launches both the Node API container and a local MongoDB instance.

---

## Contributing Guidelines

Please check our [Code of Conduct](CODE_OF_CONDUCT.md) and [Security Policy](SECURITY.md) before contributing patches. 

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

Nextora Studio is licensed under the MIT License. See [LICENSE](LICENSE) for details.
