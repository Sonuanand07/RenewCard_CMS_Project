# RenewCred Content Management System (CMS)

A production-ready, fully integrated Content Management System with a powerful admin panel and dynamic public-facing website. Built with Next.js, Express.js, MongoDB, and Redux Toolkit.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [System Requirements](#system-requirements)
6. [Installation & Setup](#installation--setup)
7. [Environment Configuration](#environment-configuration)
8. [Database](#database)
9. [API Documentation](#api-documentation)
10. [Admin Panel Guide](#admin-panel-guide)
11. [Public Frontend](#public-frontend)
12. [Docker Deployment](#docker-deployment)
13. [Development Workflow](#development-workflow)
14. [Project Structure](#project-structure)
15. [Content Block Types](#content-block-types)
16. [Assumptions & Design Decisions](#assumptions--design-decisions)
17. [Troubleshooting](#troubleshooting)

## Project Overview

RenewCred CMS is a decoupled, headless Content Management System that separates content management (admin panel) from content presentation (public website). This architecture provides:

- **Flexibility**: Content can be managed independently of the frontend
- **Scalability**: Easily add new content types without modifying core code
- **Maintainability**: Clear separation of concerns between admin and public interfaces
- **Type Safety**: Structured content blocks with defined schemas
- **Rich Content Support**: Tables, mathematical equations (LaTeX), lists, images, CTAs, and more

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel (Next.js)                    │
│  ├─ Authentication (Redux Toolkit)                           │
│  ├─ Page Management                                          │
│  └─ Content Block Editor                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ (API Requests)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Express.js)                        │
│  ├─ Authentication (JWT)                                     │
│  ├─ Page Routes                                              │
│  └─ Content Management                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ (Database Queries)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Database                                │
│  ├─ Admins Collection                                        │
│  └─ Pages Collection (with Content Blocks)                   │
└─────────────────────────────────────────────────────────────┘
                     ↑
                     │ (Fetch Published Content)
                     │
┌─────────────────────────────────────────────────────────────┐
│                 Public Website (Next.js)                     │
│  ├─ Dynamic Page Rendering                                   │
│  ├─ Block Renderer Component                                 │
│  └─ SEO Optimization                                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin Creates Content**: Admin panel sends blocks to backend
2. **Backend Validation**: Express validates and structures data
3. **Database Storage**: MongoDB stores blocks in array format
4. **Public Fetches**: Public website queries published pages
5. **Dynamic Rendering**: BlockRenderer component displays content

## Technology Stack

### Frontend (Admin Panel)
- **Framework**: Next.js 13+ (React)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Math Rendering**: react-katex (for LaTeX equations)
- **Rich Text Editor**: Custom block-based system
- **Notifications**: react-hot-toast

### Frontend (Public Website)
- **Framework**: Next.js 13+ (React)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Math Rendering**: react-katex
- **Dynamic Content**: Block Renderer Component

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Custom middleware + Express-validator
- **Security**: Helmet, CORS

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB
- **Orchestration**: Docker Compose

## Features

### Admin Panel Features
- ✅ Secure authentication (login/logout)
- ✅ Dashboard with analytics
- ✅ CRUD operations for pages
- ✅ Draft/Published/Archived status workflow
- ✅ Multi-block content editor
- ✅ SEO metadata management
- ✅ User session management
- ✅ Responsive design
- ✅ Real-time form validation
- ✅ Pagination for page lists

### Content Management Features
- ✅ Rich content blocks:
  - Headers (H1-style)
  - Paragraphs
  - Lists (unordered)
  - Tables with headers
  - LaTeX mathematical equations
  - Images with alt text
  - Rich HTML content
  - Call-to-action buttons
- ✅ Block ordering and reordering
- ✅ SEO optimization (meta title, description, keywords)
- ✅ Publishing workflow (draft → published → archived)
- ✅ Author tracking (created by, updated by, published by)

### Public Website Features
- ✅ Dynamic page rendering
- ✅ SEO-friendly URLs (slug-based)
- ✅ Navigation menu
- ✅ Footer with links
- ✅ Responsive design
- ✅ Mathematics rendering (LaTeX)
- ✅ Table display
- ✅ Image optimization
- ✅ Error handling

## System Requirements

### Minimum Requirements
- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm**: 8+ or yarn 1.22+
- **MongoDB**: 4.4+
- **Docker**: 20.10+ (for containerized deployment)
- **RAM**: 4GB minimum
- **Disk Space**: 2GB for dependencies

### Recommended Requirements
- **Node.js**: v20.x LTS
- **Docker Desktop**: 4.x
- **MongoDB Atlas**: Cloud-hosted database
- **RAM**: 8GB or more
- **CPU**: Multi-core processor

## Installation & Setup

### Option 1: Local Development (Without Docker)

#### Prerequisites
```bash
# Install Node.js v20 LTS
# Install MongoDB locally or use MongoDB Atlas
```

#### Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed  # Optional: Load sample data
npm run dev   # Start development server (port 5000)
```

#### Setup Admin Frontend
```bash
cd admin-frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev   # Start dev server (port 3000)
```

#### Setup Public Frontend
```bash
cd public-frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev   # Start dev server (port 3001)
```

### Option 2: Docker Deployment (Recommended)

#### Quick Start
```bash
# Clone repository
git clone <your-repo-url>
cd RenewCred_Project

# Copy environment template
cp .env.example .env

# Build and start all services
docker-compose up --build

# Seed sample data (in another terminal)
docker-compose exec backend npm run seed
```

#### Access Services
- Admin Panel: http://localhost:3000
- Public Website: http://localhost:3001
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

#### Stop Services
```bash
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Environment Configuration

### Root Level (.env)
```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
MONGODB_ROOT_USERNAME=admin
MONGODB_ROOT_PASSWORD=admin
MONGODB_URI=mongodb://admin:admin@mongo:27017/renewcred_cms?authSource=admin
BACKEND_PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
NODE_ENV=development
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin@mongo:27017/renewcred_cms?authSource=admin
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Admin Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Public Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Database

### Schema Overview

#### Admins Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'editor']),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Pages Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, required),
  description: String,
  blocks: [{
    type: String (enum: ['header', 'paragraph', 'list', 'table', 'equation', 'richtext', 'image', 'cta']),
    data: Mixed (varies by type),
    order: Number
  }],
  status: String (enum: ['draft', 'published', 'archived'], default: 'draft'),
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  publishedAt: Date,
  publishedBy: ObjectId (ref: Admin),
  createdBy: ObjectId (ref: Admin, required),
  updatedBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Block Data Structures

#### Header Block
```javascript
{ type: 'header', data: { text: 'Page Title' } }
```

#### Paragraph Block
```javascript
{ type: 'paragraph', data: { text: 'Lorem ipsum dolor sit amet...' } }
```

#### List Block
```javascript
{
  type: 'list',
  data: {
    items: ['Item 1', 'Item 2', 'Item 3']
  }
}
```

#### Table Block
```javascript
{
  type: 'table',
  data: {
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      ['Value 1', 'Value 2', 'Value 3'],
      ['Value 4', 'Value 5', 'Value 6']
    ]
  }
}
```

#### Equation Block (LaTeX)
```javascript
{
  type: 'equation',
  data: {
    equation: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    displayMode: true
  }
}
```

#### Rich Text Block
```javascript
{
  type: 'richtext',
  data: {
    html: '<p>Rich HTML content</p>'
  }
}
```

#### Image Block
```javascript
{
  type: 'image',
  data: {
    url: 'https://example.com/image.jpg',
    alt: 'Image description'
  }
}
```

#### CTA (Call-to-Action) Block
```javascript
{
  type: 'cta',
  data: {
    text: 'Click Here',
    link: 'https://example.com'
  }
}
```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register Admin
```
POST /auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@renewcred.com",
  "password": "SecurePassword123",
  "role": "admin" // optional: 'admin' or 'editor', default: 'editor'
}

Response: 201 Created
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "...",
    "username": "admin",
    "email": "admin@renewcred.com",
    "role": "admin"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@renewcred.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": { ... }
}
```

#### Get Current Admin
```
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "admin": { ... }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Pages Endpoints

#### Create Page (Protected)
```
POST /pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "About Us",
  "slug": "about",
  "description": "Learn about RenewCred",
  "blocks": [
    { type: 'header', data: { text: 'About RenewCred' }, order: 0 },
    { type: 'paragraph', data: { text: 'We are a credit...' }, order: 1 }
  ],
  "seoTitle": "About RenewCred - Credit Management",
  "seoDescription": "Learn about our mission...",
  "seoKeywords": ["credit", "financial"]
}

Response: 201 Created
{
  "success": true,
  "message": "Page created successfully",
  "page": { ... }
}
```

#### List Pages (Protected)
```
GET /pages?status=published&search=about&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "pages": [ ... ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### Get Page (Protected)
```
GET /pages/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "page": { ... }
}
```

#### Get Published Page (Public)
```
GET /pages/public/{slug}

Response: 200 OK
{
  "success": true,
  "page": { ... }
}
```

#### Update Page (Protected)
```
PUT /pages/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Title",
  "blocks": [ ... ],
  // ... other fields
}

Response: 200 OK
{
  "success": true,
  "message": "Page updated successfully",
  "page": { ... }
}
```

#### Publish Page (Protected)
```
POST /pages/{id}/publish
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Page published successfully",
  "page": { ... }
}
```

#### Unpublish Page (Protected)
```
POST /pages/{id}/unpublish
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Page unpublished successfully",
  "page": { ... }
}
```

#### Delete Page (Protected - Admin Only)
```
DELETE /pages/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Page deleted successfully"
}
```

## Admin Panel Guide

### Logging In
1. Navigate to http://localhost:3000
2. Use credentials:
   - Email: `admin@renewcred.com`
   - Password: `Admin@123`
3. Click "Login"

### Dashboard
The dashboard displays:
- Total pages count
- Published pages count
- Quick access to create new pages
- Recent published pages list

### Managing Pages

#### Creating a New Page
1. Click "Create Page" from sidebar or dashboard
2. Enter page title (slug auto-generates)
3. Add content blocks:
   - Select block type from dropdown
   - Click "Add Block"
   - Fill in block-specific fields
   - Remove blocks with "Remove" button
4. Add SEO information (optional)
5. Click "Create Page"

#### Editing a Page
1. Go to "Pages" → Find page → Click "Edit"
2. Modify content blocks
3. Click "Save Changes"

#### Publishing Content
1. Edit a page
2. Click "Publish" (if draft)
3. Page becomes available at `/pages/public/{slug}`

#### Unpublishing Content
1. Edit a published page
2. Click "Unpublish"
3. Page status changes to draft

#### Deleting Pages
1. Go to "Pages"
2. Click "Delete" on page row
3. Confirm deletion

### Block Types Reference

#### Header
- Use for page titles
- Rendered as large bold text
- Supports plain text

#### Paragraph
- Use for body content
- Supports plain text
- Can span multiple lines

#### Rich Text
- Use for HTML content
- Supports custom HTML
- Be careful with user input

#### List
- Unordered lists
- Enter items one per line
- Auto-renders as bullet points

#### Table
- Define headers (comma-separated)
- Define rows (pipe-separated values, one per line)
- Example:
  - Headers: `Column 1, Column 2, Column 3`
  - Rows: `Value 1|Value 2|Value 3`

#### Equation
- LaTeX mathematical notation
- Example: `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`
- Toggle "Display Mode" for centered block equations
- Leave unchecked for inline equations

#### Image
- Requires image URL
- Alt text for accessibility

#### CTA
- Button text and link
- Styled prominently on public site

## Public Frontend

### Accessing Content
- Home: http://localhost:3001
- Dynamic pages: http://localhost:3001/{slug}
- Example: http://localhost:3001/about

### How It Works
1. User navigates to a URL
2. Frontend fetches page data from `/pages/public/{slug}`
3. BlockRenderer displays content blocks
4. Browser renders final HTML

### SEO Features
- Meta tags from page data
- Structured URLs with slugs
- Descriptive page titles
- Meta descriptions in page content

## Docker Deployment

### Building Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build admin-frontend
docker-compose build public-frontend
```

### Running Services
```bash
# Start all services
docker-compose up

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

### Development with Hot Reload
Services are configured with volume mounts for live code updates:
```bash
# Changes to source code automatically reflect
docker-compose up

# No rebuild needed for code changes
# Only rebuild if dependencies change
```

### Production Deployment

For production, consider:
1. Remove volume mounts
2. Use environment-specific .env files
3. Enable HTTPS/SSL
4. Use managed MongoDB (MongoDB Atlas)
5. Configure proper CORS origins
6. Set strong JWT_SECRET
7. Use proper logging and monitoring

## Development Workflow

### Local Development Steps

1. **Start Services**
   ```bash
   docker-compose up
   ```

2. **Seed Database** (in new terminal)
   ```bash
   docker-compose exec backend npm run seed
   ```

3. **Access Applications**
   - Admin Panel: http://localhost:3000
   - Public Site: http://localhost:3001
   - Backend API: http://localhost:5000/health

4. **Make Changes**
   - Edit files in your IDE
   - Changes automatically reload (hot reload)

5. **Test Content**
   - Create pages in admin panel
   - Publish them
   - View on public site

### Common Development Commands

```bash
# View running services
docker-compose ps

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build

# Install new dependencies
docker-compose exec backend npm install
docker-compose exec admin-frontend npm install

# Run backend seed script
docker-compose exec backend npm run seed

# View backend logs
docker-compose logs -f backend

# Access backend shell
docker-compose exec backend /bin/sh
```

## Project Structure

```
RenewCred_Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── pageController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   └── Page.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── pageRoutes.js
│   │   ├── scripts/
│   │   │   └── seedData.js
│   │   └── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── admin-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── BlockEditor.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── _app.js
│   │   │   ├── index.js
│   │   │   ├── login.js
│   │   │   ├── dashboard.js
│   │   │   └── pages/
│   │   │       ├── index.js
│   │   │       ├── create.js
│   │   │       └── [id]/
│   │   │           └── edit.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── pagesSlice.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── utils/
│   │       ├── api.js
│   │       └── helpers.js
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── public-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlockRenderer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── _app.js
│   │   │   ├── index.js
│   │   │   ├── [slug].js
│   │   │   ├── about.js
│   │   │   └── features.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── utils/
│   │       └── api.js
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Content Block Types

### Type: header
**Purpose**: Page titles and section headings
**Data Structure**: `{ text: string }`
**Example**:
```javascript
{
  type: 'header',
  data: { text: 'Welcome to RenewCred' },
  order: 0
}
```

### Type: paragraph
**Purpose**: Body text content
**Data Structure**: `{ text: string }`
**Example**:
```javascript
{
  type: 'paragraph',
  data: { text: 'This is a paragraph of body text...' },
  order: 1
}
```

### Type: richtext
**Purpose**: HTML content with complex formatting
**Data Structure**: `{ html: string }`
**Example**:
```javascript
{
  type: 'richtext',
  data: { html: '<p><strong>Bold text</strong> and <em>italic</em></p>' },
  order: 2
}
```

### Type: list
**Purpose**: Bullet point lists
**Data Structure**: `{ items: [string] }`
**Example**:
```javascript
{
  type: 'list',
  data: { items: ['Item 1', 'Item 2', 'Item 3'] },
  order: 3
}
```

### Type: equation
**Purpose**: Mathematical equations using LaTeX
**Data Structure**: `{ equation: string, displayMode: boolean }`
**Example**:
```javascript
{
  type: 'equation',
  data: {
    equation: 'E = mc^2',
    displayMode: true
  },
  order: 4
}
```

### Type: table
**Purpose**: Structured tabular data
**Data Structure**: `{ headers: [string], rows: [[string]] }`
**Example**:
```javascript
{
  type: 'table',
  data: {
    headers: ['Feature', 'Free', 'Premium'],
    rows: [
      ['Support', 'Community', 'Priority'],
      ['Analytics', 'Basic', 'Advanced']
    ]
  },
  order: 5
}
```

### Type: image
**Purpose**: Image display
**Data Structure**: `{ url: string, alt: string }`
**Example**:
```javascript
{
  type: 'image',
  data: {
    url: 'https://example.com/image.jpg',
    alt: 'Product screenshot'
  },
  order: 6
}
```

### Type: cta
**Purpose**: Call-to-action buttons
**Data Structure**: `{ text: string, link: string }`
**Example**:
```javascript
{
  type: 'cta',
  data: {
    text: 'Get Started',
    link: 'https://example.com/signup'
  },
  order: 7
}
```

## Assumptions & Design Decisions

### 1. Block-Based Content Architecture
**Assumption**: Content should be flexible and not tied to a specific page layout
**Decision**: Implemented a block-based content system where pages contain arrays of content blocks
**Benefit**: Easy to add new block types, scales with requirements

### 2. Separate Admin and Public Frontends
**Assumption**: Admin and public interfaces have different requirements
**Decision**: Built two separate Next.js applications
**Benefit**: Optimized UX for each use case, independent scaling

### 3. Redux Toolkit for Admin State
**Assumption**: Admin panel needs complex state management
**Decision**: Used Redux Toolkit for predictable state management
**Benefit**: Time-travel debugging, clear data flow, async thunk handling

### 4. MongoDB with Mongoose
**Assumption**: Content schema is flexible and document-based
**Decision**: Chose MongoDB for schema flexibility, Mongoose for validation
**Benefit**: Easy to modify content structures, built-in validation

### 5. JWT Authentication
**Assumption**: Stateless authentication is preferred
**Decision**: Used JWT tokens with secure httpOnly cookies potential
**Benefit**: Scalable, works with microservices, no session storage needed

### 6. Block Order Field
**Assumption**: Content blocks need to be ordered
**Decision**: Added explicit `order` field to each block
**Benefit**: Easy reordering, consistent rendering order

### 7. Role-Based Access Control (RBAC)
**Assumption**: Different admins might have different permissions
**Decision**: Implemented 'admin' and 'editor' roles
**Benefit**: Flexible permission system, future-proof for features like delete restrictions

### 8. SEO Metadata
**Assumption**: Published content needs SEO optimization
**Decision**: Stored `seoTitle`, `seoDescription`, `seoKeywords` in page model
**Benefit**: Content creators can optimize for search, improves discoverability

### 9. Published Status Tracking
**Assumption**: Need to track who published and when
**Decision**: Store `publishedAt` timestamp and `publishedBy` admin reference
**Benefit**: Audit trail, accountability, publication history

### 10. Docker Compose for Development
**Assumption**: Consistent development environment across team
**Decision**: Provided docker-compose.yml with all services
**Benefit**: One-command setup, no manual configuration

## Troubleshooting

### Backend Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Docker Compose
docker-compose up mongo
# Or local MongoDB
mongod
```

### Admin Panel Can't Connect to Backend
```
Error: CORS policy: No 'Access-Control-Allow-Origin'
```
**Solution**: Check CORS_ORIGIN in backend .env
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### JWT Token Issues
```
Error: Invalid or expired authorization token
```
**Solution**:
1. Clear browser localStorage: `localStorage.removeItem('adminToken')`
2. Login again
3. Check JWT_SECRET matches in backend .env

### Page Not Showing on Public Site
**Solution**: Ensure page status is "published"
1. Go to admin panel
2. Click page → Publish button
3. Check page slug matches URL

### MongoDB Connection with Docker
```
Error: authenticate failed
```
**Solution**: Check MongoDB credentials in docker-compose.yml match .env

### Hot Reload Not Working
**Solution**: Ensure volume mounts in docker-compose.yml:
```yaml
volumes:
  - ./backend:/app/backend
  - /app/backend/node_modules
```

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process or change port
```bash
# Change port in .env
PORT=5001

# Or kill existing process
lsof -i :5000
kill -9 <PID>
```

### Database Migration Issues
```
Error: collection already exists
```
**Solution**: Clear database
```bash
docker-compose exec mongo mongosh
use renewcred_cms
db.dropDatabase()
```

## Demo Credentials

After running `npm run seed`:

**Admin**
- Email: `admin@renewcred.com`
- Password: `Admin@123`
- Role: `admin`

**Editor**
- Email: `editor@renewcred.com`
- Password: `Editor@123`
- Role: `editor`

## Support & Contributing

For issues or questions:
1. Check Troubleshooting section
2. Review API documentation
3. Check block type examples
4. Review design decisions

## License

This project is provided as-is for the RenewCred assignment.

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready
