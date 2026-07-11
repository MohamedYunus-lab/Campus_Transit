# Sairam Bus Connect - College Bus Management System

A comprehensive full-stack web application for managing college bus operations, routes, schedules, boarding points, and driver information for Sri Sairam College.

## Project Status: ✅ Production Ready

**Version**: 1.0  
**Last Updated**: July 10, 2026  
**Status**: Complete and Tested

---

## 🎯 Project Purpose

The Sairam Bus Connect system helps:

1. **Students** discover available buses for their routes, view boarding points with landmark images, and see real-time schedules
2. **Administrators** manage buses, drivers, routes, and boarding points through an easy-to-use dashboard
3. **College Management** monitor fleet operations and ensure efficient bus allocation

---

## ✨ Key Features

- **Campus Transit Connect** - Modern student portal for bus discovery
- **Real-time Search** - Find buses by number or route name
- **Interactive Maps** - Leaflet.js maps showing boarding points and routes
- **Landmark Images** - Cloudinary integration for boarding point photos
- **Admin Dashboard** - Complete management system with sidebar navigation
- **4-Step Wizard** - Easy route creation with boarding points, drivers, and buses
- **Multiple Buses Per Driver** - One driver can manage unlimited buses
- **Professional Design** - Institutional blue color scheme with modern UI
- **Performance Optimized** - Response compression, caching, rate limiting
- **Mobile Responsive** - Works on all devices

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite + Prisma ORM |
| Styling | Tailwind CSS |
| Maps | Leaflet.js |
| Images | Cloudinary |
| Authentication | JWT + bcrypt |

---

## 🚀 Quick Start

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Runs on: `http://localhost:5001`

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Runs on: `http://localhost:5173`

### Browser
Open: `http://localhost:5173/`

**Login Credentials:**
- Email: `----------`
- Password: `*******`

---

## 📊 Pre-loaded Data

✅ **3 Routes** (Tambaram, Velachery, Adyar)  
✅ **4 Buses** with license numbers (TN-01-AB-1234, etc.)  
✅ **4 Drivers** (Rajesh, Suresh, Murugan, Karthik)  
✅ **12 Boarding Points** with coordinates  
✅ **20 Bus Schedules** with arrival/departure times  

---

## 📁 Project Structure

```
server/
├── .env                    # Environment (PORT=5001, JWT_SECRET)
├── index.js               # Express server with performance features
├── routes/                # 6 API route files
├── middleware/auth.js     # JWT authentication
└── prisma/
    ├── schema.prisma      # Database schema (6 tables)
    ├── dev.db             # SQLite database
    ├── seed.js            # Demo data
    └── migrations/        # 3 applied migrations

client/
├── .env                   # Environment (API_URL, Cloudinary)
├── src/
│   ├── pages/            # Home, Login, Routes, Admin pages
│   ├── components/       # Navbar, Cards, Maps, ImageUpload
│   ├── api/              # API helper functions
│   └── context/          # Auth context
└── tailwind.config.js    # Design system tokens
```

---

## 🔧 API Endpoints (26 Total)

**Authentication** (2): Login, Verify  
**Routes** (4): CRUD operations  
**Buses** (4): CRUD operations  
**Drivers** (4): CRUD operations  
**Boarding Points** (4): CRUD + Image support  
**Schedules** (2): Create and retrieve  

---

## 🔐 Security Features

- JWT authentication with 24-hour tokens
- Password hashing with bcrypt
- Rate limiting (200 req/15min general, 5 req/15min for login)
- Protected admin routes
- Input validation and error handling

---

## ⚡ Performance Features

- Response compression reduces bandwidth
- 10-minute response caching
- Rate limiting prevents overload
- Optimized database queries
- Handles multiple simultaneous users

---

## 🎨 Design System

- **Primary Color**: #004ac6 (Institutional Blue)
- **Font**: Inter (modern, professional)
- **Spacing**: 8px grid system
- **Status Badges**: Color-coded (blue, orange, purple)
- **Active Status**: Green indicators

---

## 📝 Development History

**Phase 1 (June 8)**: Core implementation with database, API, and basic UI  
**Phase 2 (June 8-10)**: Image upload, 4-step wizard, search functionality  
**Phase 3 (June 10-11)**: Professional design system, branding  
**Phase 4 (July 10)**: Critical fixes, performance optimization, database migration  
**Phase 5 (July 10)**: Finalization and documentation  

---

## ✅ What's Included

- ✅ Full-stack application ready to run
- ✅ SQLite database with fresh seed data
- ✅ All API endpoints functional
- ✅ Admin authentication working
- ✅ Image upload configured (Cloudinary)
- ✅ Performance features enabled
- ✅ Responsive design implemented
- ✅ Error handling complete
- ✅ Documentation comprehensive

---

## 🎯 Ready for Deployment

The system is production-ready and can be deployed to:
- Cloud servers (AWS, Azure, Google Cloud)
- Traditional web hosting
- Docker containers
- Local college servers

---

**Status**: ✅ COMPLETE AND PRODUCTION READY 🚌

For detailed information, see **PROJECT_DOCUMENTATION.md**
