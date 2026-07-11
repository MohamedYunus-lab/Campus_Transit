# Quick Start - College Bus Management System

Get the app running in 2 minutes!

## Prerequisites

- Node.js 16+
- npm package manager

## 1. Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

Expected output: `Server running on http://localhost:5001`

## 2. Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Expected output: `Local: http://localhost:5173/`

## 3. Open in Browser

Go to: **http://localhost:5173/**

## Login Credentials

- **Email**: admin@college.edu
- **Password**: admin123

---

## Common Issues

### Port 5001 already in use?
Edit `server/.env` and change `PORT=5001` to another port (e.g., 5002)

### Cannot connect to API?
1. Make sure backend is running first
2. Check `client/.env` has correct API URL
3. Clear browser cache (Ctrl+Shift+Delete)

### Image upload not working?
- File must be < 5MB
- Format must be PNG, JPG, or GIF
- Cloudinary credentials in `client/.env` are already set

---

## Next Steps

Read **PROJECT_DOCUMENTATION.md** for complete project details.
