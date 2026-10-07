# Freelancer Project & Income Tracker

A comprehensive, production-ready full-stack web application designed for independent freelancers, contractors, and agency professionals to streamline client management, monitor project deadlines and milestones, track received and pending payments, analyze cashflow trends, and generate professional PDF invoices and reports.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v18)** – Modern component-based declarative UI
- **Vite** – Next-generation fast frontend tooling and dev server
- **Tailwind CSS** – Modern utility-first responsive styling framework
- **React Router (v6)** – Client-side routing with protected route guards
- **Recharts** – Composable SVG data visualizations (Bar & Donut charts)
- **Axios** – Promise-based HTTP client with automatic JWT bearer interceptors
- **Lucide React** – Clean, modern icon set
- **React Hot Toast** – Smooth, interactive toast notifications
- **jsPDF & jsPDF-AutoTable** – Client-side PDF generation for invoices and financial statements
- **Date-fns** – Lightweight and reliable date formatting utilities

### Backend
- **Node.js** – Server-side JavaScript runtime
- **Express.js** – High-performance REST API routing and middleware framework
- **MongoDB** – Document-oriented NoSQL database
- **Mongoose (v8)** – ODM data modeling, strict schema validation, and aggregation pipelines
- **JWT (JSON Web Tokens)** – Stateless, secure user authentication
- **bcrypt.js** – Industry-standard password hashing
- **CORS** – Cross-Origin Resource Sharing handling
- **Morgan** – HTTP request logger for debugging
- **Dotenv** – Environment configuration manager

---

## 🌟 Features Summary

### 1. 🔐 Authentication & Protected Access
- **User Registration**: Form validation, duplicate email prevention, and `bcryptjs` password hashing.
- **JWT Authentication**: Token-based authentication with automatic session recovery and expiration handling.
- **Protected Routes**: React route guards and Express authorization middleware guaranteeing user data isolation.
- **Demo 1-Click Login**: Instant demo credentials access for testing and evaluation.

### 2. 📊 Analytics Dashboard
- **KPI Summary Cards**: Real-time totals for *Active Projects*, *Total Projects*, *Total Income Earned*, and *Pending Receivables*.
- **Monthly Income Bar Chart**: Visual breakdown of received income vs. pending invoices month-by-month using Recharts.
- **Project Status Distribution**: Donut chart displaying pipeline distribution (*Pending*, *In Progress*, *Completed*, *Cancelled*).
- **Recent Activity Feed**: Quick-access tables displaying latest projects and recent payment transactions.

### 3. 👥 Client Management
- **Full CRUD Operations**: Create, view, edit, and delete client contacts.
- **Detailed Profiles**: Store client name, email, phone, company, billing address, website, and private project notes.
- **Client Overview Modal**: View client contact details alongside all associated projects and total lifetime revenue billed.
- **Live Search**: Instant search by client name, company, email, or phone number.
- **Cascade Deletion**: Automatically cleans up associated projects and payment records upon client removal.

### 4. 📁 Project Management
- **Full CRUD Operations**: Add, edit, inspect, and delete projects.
- **Attributes**: Project Name, Client selector, Category, Start Date, Deadline, Status, Fee, and Priority.
- **Dynamic Payment Calculation**: Automatically computes paid balance and updates payment status (*Pending*, *Partially Paid*, *Paid*) as payments are recorded.
- **Search & Multi-Filters**: Filter projects by Client, Status, Payment Status, or keyword search.
- **Financial Audit Modal**: Displays funding progress bar (% funded), remaining balance, and historical payment logs.

### 5. 💵 Income & Payment Tracking
- **Payment Entry**: Record transactions linked to projects with custom invoice references, payment methods (*Bank Transfer*, *Stripe*, *PayPal*, *Credit Card*, *Crypto*, *Cash*), and notes.
- **Search & Date Filters**: Filter by date range, payment method, project, or payment status.
- **Financial Calculations**: Real-time aggregation of total income, pending receivables, and current calendar month earnings.

### 6. 📄 Invoicing, PDF & CSV Reports
- **Interactive Invoice Viewer**: Preview formatted invoice receipts in a modal.
- **PDF Invoice Export**: 1-click download of styled PDF invoices for clients.
- **CSV Data Export**: Export payment and revenue histories to `.csv` format for accounting spreadsheets.
- **Financial Summary PDF Statement**: Download landscape PDF summary reports of all transactions and receivables.

### 7. 👤 Profile & Security Settings
- Manage personal details, business address, company/studio name, bio, and currency preferences (USD, EUR, GBP, CAD, AUD, INR).
- Secure password change module with verification of current password.

---

## 📁 Project Structure

```
Freelancer Project & Income Tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js      # Auth & Profile logic
│   │   │   ├── clientController.js    # Client CRUD & stats
│   │   │   ├── projectController.js   # Project CRUD & status sync
│   │   │   ├── incomeController.js    # Payment tracking & metrics
│   │   │   └── dashboardController.js # Analytics & Chart data
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT verification guard
│   │   │   └── errorMiddleware.js     # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js                # User schema & bcrypt hashing
│   │   │   ├── Client.js              # Client schema
│   │   │   ├── Project.js             # Project schema
│   │   │   └── Income.js              # Payment / Income schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── clientRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── incomeRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── utils/
│   │   │   ├── generateToken.js       # JWT signer
│   │   │   └── seedData.js            # Sample data seeder
│   │   ├── app.js                     # Express app setup & CORS
│   │   └── server.js                  # Entrypoint bootstrap
│   ├── .env                           # Server environment variables
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js               # Axios instance with JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Auth state provider
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── MonthlyIncomeChart.jsx
│   │   │   │   └── ProjectStatusChart.jsx
│   │   │   ├── clients/
│   │   │   │   ├── ClientModal.jsx
│   │   │   │   └── ClientDetailsModal.jsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectModal.jsx
│   │   │   │   └── ProjectDetailsModal.jsx
│   │   │   ├── income/
│   │   │   │   ├── IncomeModal.jsx
│   │   │   │   └── InvoicePreviewModal.jsx
│   │   │   ├── common/                # StatCard, Modal, ConfirmDialog, FormInput, etc.
│   │   │   └── layout/                # Sidebar, Navbar, AppLayout, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── utils/
│   │   │   ├── formatters.js          # Currency & date formatters
│   │   │   ├── exportPdf.js           # jsPDF generators
│   │   │   └── exportCsv.js           # CSV file exporter
│   │   ├── App.jsx                    # Routing & route guards
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx                   # React root entrypoint
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json                       # Root orchestration script
└── README.md
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `backend/` directory (or duplicate `backend/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/freelancer_tracker
JWT_SECRET=freelancer_super_secret_jwt_key_2026_secure
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Explanation of Environment Variables:
| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `MONGODB_URI` | MongoDB connection string (Local or MongoDB Atlas) | `mongodb://127.0.0.1:27017/freelancer_tracker` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `your_secret_key` |
| `JWT_EXPIRE` | Token validity duration | `30d` |
| `NODE_ENV` | Application environment | `development` or `production` |
| `CLIENT_URL` | Frontend URL allowed for CORS | `http://localhost:5173` |

---

## 📦 Installation & Setup Instructions

### Prerequisites
- **Node.js** (v18.x or higher) – [Download Node.js](https://nodejs.org/)
- **npm** (v9.x or higher)
- **MongoDB** running locally (`mongod` / Windows Service) or a MongoDB Atlas URI

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/freelancer-project-tracker.git
cd "Freelancer Project & Income Tracker"
```

---

### Step 2: Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure `.env` is created with your database configuration:
   ```bash
   cp .env.example .env
   ```
4. Seed the database with realistic sample data:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend REST API will start at `http://localhost:5000`.*

---

### Step 3: Frontend Setup
1. In a new terminal, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend client will start at `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials

You can use the built-in 1-click **"Fill & Login with Demo Account"** button on the login screen or enter:
- **Email**: `demo@freelancer.com`
- **Password**: `password123`

---

## 🌐 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `PUT` | `/api/auth/change-password` | Update user password | Yes |

### Clients (`/api/clients`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/clients` | List all clients (supports `?search=`) | Yes |
| `POST` | `/api/clients` | Add new client | Yes |
| `GET` | `/api/clients/:id` | Get single client details with project history | Yes |
| `PUT` | `/api/clients/:id` | Edit client information | Yes |
| `DELETE` | `/api/clients/:id` | Delete client and cascade related records | Yes |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/projects` | List projects (`?search=&status=&clientId=&paymentStatus=`) | Yes |
| `POST` | `/api/projects` | Create new project | Yes |
| `GET` | `/api/projects/:id` | Get project details and payment audit | Yes |
| `PUT` | `/api/projects/:id` | Edit project details | Yes |
| `DELETE` | `/api/projects/:id` | Delete project and related payments | Yes |

### Income (`/api/income`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/income` | List payments (`?search=&projectId=&paymentStatus=&startDate=&endDate=`) | Yes |
| `POST` | `/api/income` | Record payment (auto-synchronizes project status) | Yes |
| `GET` | `/api/income/:id` | Get payment details with invoice reference | Yes |
| `PUT` | `/api/income/:id` | Update payment details | Yes |
| `DELETE` | `/api/income/:id` | Delete payment & recalculate project balance | Yes |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | KPI summary cards & recent activities | Yes |
| `GET` | `/api/dashboard/monthly-income` | Monthly revenue aggregation for Bar Chart | Yes |
| `GET` | `/api/dashboard/project-status` | Status distribution for Donut Chart | Yes |

---

## 👨‍💻 Author
- **Course**: Software Engineering Individual Assignment
- **Project**: Freelancer Project & Income Tracker
- **License**: MIT
