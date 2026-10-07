# Freelancer Project & Income Tracker

A modern, full-stack web application designed for independent freelancers, contractors, and creative professionals to manage clients, track project milestones, record income transactions, monitor cashflow health, and generate PDF invoices & financial reports.

Built as an individual Software Engineering project with a responsive SaaS UI, RESTful Node.js API, MongoDB database, JWT authentication, and interactive Recharts data visualization.

---

## 🚀 Live Features

### 1. 🔐 Authentication & Security
- **User Registration**: Secure account creation with field validation and duplicate email protection.
- **JWT Authentication**: Encrypted JSON Web Tokens stored in localStorage and attached via Axios request interceptors.
- **Password Security**: Password hashing with `bcryptjs` (salt factor 10) and hidden from query responses (`select: false`).
- **Protected Routes**: React client-side route guards and Express backend authorization middleware ensuring users access only their own data.
- **Session Verification**: Automatic token verification on reload (`/api/auth/me`) and graceful expired session recovery.
- **Demo Quick-Login**: 1-click demo login button for instant grading and evaluation.

### 2. 📊 Analytical Dashboard
- **Summary Cards**: Real-time KPI cards for Active Projects, Total Projects, Total Income Earned, and Pending Receivables.
- **Monthly Income Bar Chart**: Dynamic visual breakdown comparing received income vs pending invoices across months using **Recharts**.
- **Project Status Distribution**: Donut chart visualizing project pipeline statuses (*Pending*, *In Progress*, *Completed*, *Cancelled*).
- **Recent Projects Table**: Quick view of latest contracts with status and fee indicators.
- **Recent Income Activity**: Transaction feed showing latest payments and method tags.

### 3. 👥 Client Management
- **Full CRUD**: Add, edit, view, and delete client contacts.
- **Client Profiles**: Name, email, phone, company, address, website, and rich notes/preferences.
- **Client Details Modal**: Shows detailed contact info, associated project history, and total lifetime revenue billed.
- **Live Search**: Search clients by name, email, company, or phone number.
- **Cascade Cleanup**: Deleting a client automatically cleans up their associated projects and payments.

### 4. 📁 Project Management
- **Full CRUD**: Create, edit, inspect, and delete projects.
- **Detailed Attributes**: Project Name, Client selector, Category, Start Date, Deadline, Status, Fee, and Priority level.
- **Automated Payment Status Calculation**: Dynamic tracking (*Pending*, *Partially Paid*, *Paid*) based on recorded client payments.
- **Project Overview Modal**: Shows financial progress bar (% funded), remaining balance, and full payment audit history.
- **Search & Multi-Filters**: Filter by Client, Project Status, Payment Status, or keyword search.

### 5. 💵 Income & Payment Tracking
- **Full CRUD**: Record and adjust income payments linked to projects and clients.
- **Attributes**: Project, Client, Amount, Payment Date, Payment Status (*Paid* / *Pending*), Payment Method (*Bank Transfer*, *Stripe*, *PayPal*, *Credit Card*, *Crypto*, *Cash*), Invoice Number, and Notes.
- **Financial Metrics**: Real-time calculation of Total Income, Pending Invoices, and Current Month revenue.
- **Search & Date Filtering**: Search by invoice reference or notes, filter by payment method, status, or date range.

### 6. 📄 Reports & Invoice Generation (Optional Features Implemented)
- **Interactive Invoice Viewer**: Preview formatted invoice receipts.
- **PDF Invoice Download**: 1-click client PDF invoice generation powered by `jspdf` and `jspdf-autotable`.
- **CSV Data Export**: Download transaction histories in `.csv` format for accounting or spreadsheet tools.
- **Financial Summary PDF Report**: Export landscape financial statements summarizing payments and receivables.

### 7. 👤 Profile & Account Settings
- **Profile Customization**: Update name, professional title, phone, studio/company name, address, bio, and preferred currency.
- **Security Settings**: Change account password with current password verification.

---

## 🛠️ Technologies Used

### Frontend
- **React.js (v18)** - Component-based user interface
- **Vite** - High-performance frontend build tool and dev server
- **Tailwind CSS** - Modern utility-first responsive styling
- **React Router DOM (v6)** - Client-side routing and protected routes
- **Recharts** - Responsive charting library for financial dashboards
- **Axios** - Promise-based HTTP client with token interceptors
- **Lucide React** - Clean and consistent modern icons
- **React Hot Toast** - Toast notification system
- **jsPDF & jsPDF-AutoTable** - Client-side PDF generation for invoices and financial statements
- **Date-fns** - Lightweight date formatting utility

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - REST API framework
- **MongoDB** - Document-based NoSQL database
- **Mongoose (v8)** - ODM model validation and aggregation pipelines
- **JSONWebToken (JWT)** - Stateless token-based user authentication
- **bcryptjs** - Password hashing algorithm
- **CORS** - Cross-Origin Resource Sharing handling
- **Morgan** - HTTP request logger for development
- **Dotenv** - Environment variable management

---

## 🏛️ System Architecture

```
                                +---------------------------+
                                |  React + Vite Frontend    |
                                |  (Tailwind CSS + Recharts)|
                                +-------------+-------------+
                                              |
                                              | REST API (JSON / Bearer JWT)
                                              v
                                +-------------+-------------+
                                |    Express.js Server      |
                                |    (Node.js REST API)     |
                                +-------------+-------------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
                     v                        v                        v
        +------------+-----------+   +--------+---------+   +----------+---------+
        |   Auth & Middleware    |   | API Controllers  |   | Mongoose Models    |
        |  (JWT, bcryptjs, CORS) |   | (CRUD & Analytics|   | (User, Client,     |
        +------------------------+   +------------------+   |  Project, Income)  |
                                                            +----------+---------+
                                                                       |
                                                                       v
                                                            +----------+---------+
                                                            |  MongoDB Database  |
                                                            +--------------------+
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18.0 or higher (`node -v`)
- **npm**: v9.0 or higher (`npm -v`)
- **MongoDB**: MongoDB Server running locally or MongoDB Atlas connection URI

---

### Quick Start (Automated)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/freelancer-project-tracker.git
   cd "Freelancer Project & Income Tracker"
   ```

2. **Setup Server Environment Variables**:
   In `server/` directory, create a `.env` file (or copy `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/freelancer_tracker
   JWT_SECRET=freelancer_super_secret_jwt_key_2026_secure
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

4. **Seed Sample Demo Data**:
   Populate sample clients, projects, and income transactions:
   ```bash
   cd ../server
   npm run seed
   ```

5. **Start Both Applications**:
   - **Terminal 1 (Backend API)**:
     ```bash
     cd server
     npm run dev
     ```
     Server will start at `http://localhost:5000`.

   - **Terminal 2 (Frontend Client)**:
     ```bash
     cd client
     npm run dev
     ```
     Client will start at `http://localhost:5173`.

---

## 🔑 Demo Account Credentials

You can use the built-in 1-click demo button on the login page or enter:
- **Email**: `demo@freelancer.com`
- **Password**: `password123`

---

## 🌐 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new freelancer account | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `PUT` | `/api/auth/change-password` | Change user password | Yes |

### Clients Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/clients` | Get all clients (supports `?search=`) | Yes |
| `POST` | `/api/clients` | Create new client record | Yes |
| `GET` | `/api/clients/:id` | Get single client with projects & payments | Yes |
| `PUT` | `/api/clients/:id` | Update client details | Yes |
| `DELETE` | `/api/clients/:id` | Delete client and cascade delete | Yes |

### Projects Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects` | Get projects (`?search=&status=&clientId=&paymentStatus=`) | Yes |
| `POST` | `/api/projects` | Create new project | Yes |
| `GET` | `/api/projects/:id` | Get project details and financial breakdown | Yes |
| `PUT` | `/api/projects/:id` | Update project | Yes |
| `DELETE` | `/api/projects/:id` | Delete project and related payments | Yes |

### Income & Payment Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/income` | Get payments (`?search=&projectId=&paymentStatus=&startDate=&endDate=`) | Yes |
| `POST` | `/api/income` | Record income payment (auto-updates project paid status) | Yes |
| `GET` | `/api/income/:id` | Get payment details with invoice metadata | Yes |
| `PUT` | `/api/income/:id` | Update payment entry | Yes |
| `DELETE` | `/api/income/:id` | Delete payment entry and recalculate project | Yes |

### Dashboard Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Get KPI metrics and recent project/income lists | Yes |
| `GET` | `/api/dashboard/monthly-income` | Aggregate income by month for Bar Chart | Yes |
| `GET` | `/api/dashboard/project-status` | Aggregate project counts by status for Pie Chart | Yes |

---

## 🗄️ Database Schema Design

### 1. `User` Schema
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, hashed, select: false)
- `title` (String)
- `phone` (String)
- `company` (String)
- `address` (String)
- `bio` (String)
- `currency` (String, default: "USD")
- `timestamps` (createdAt, updatedAt)

### 2. `Client` Schema
- `userId` (ObjectId -> User, indexed)
- `name` (String, required)
- `email` (String, required)
- `phone` (String)
- `company` (String)
- `address` (String)
- `website` (String)
- `notes` (String)
- `timestamps` (createdAt, updatedAt)

### 3. `Project` Schema
- `userId` (ObjectId -> User, indexed)
- `clientId` (ObjectId -> Client, indexed)
- `projectName` (String, required)
- `description` (String)
- `startDate` (Date)
- `deadline` (Date, required)
- `status` (Enum: `['Pending', 'In Progress', 'Completed', 'Cancelled']`)
- `fee` (Number, min: 0)
- `paidAmount` (Number, default: 0)
- `paymentStatus` (Enum: `['Pending', 'Partially Paid', 'Paid']`)
- `category` (String)
- `priority` (Enum: `['Low', 'Medium', 'High', 'Urgent']`)
- `timestamps` (createdAt, updatedAt)

### 4. `Income` Schema
- `userId` (ObjectId -> User, indexed)
- `projectId` (ObjectId -> Project, indexed)
- `clientId` (ObjectId -> Client, indexed)
- `amount` (Number, min: 0.01)
- `paymentDate` (Date)
- `paymentStatus` (Enum: `['Paid', 'Pending']`)
- `paymentMethod` (Enum: `['Bank Transfer', 'Stripe', 'PayPal', 'Credit Card', 'Crypto', 'Cash', 'Other']`)
- `invoiceNumber` (String)
- `notes` (String)
- `timestamps` (createdAt, updatedAt)

---

## 🔮 Future Enhancements
- Recurring retainer invoicing and automated payment email reminders.
- Stripe Connect integration for live credit card checkout links.
- Multi-currency conversion via real-time exchange rate APIs.
- Time tracker widget with pomodoro timer linked to hourly project billing.

---

## 👨‍💻 Author
- **Course**: Software Engineering Individual Assignment
- **Project**: Freelancer Project & Income Tracker
- **License**: MIT
