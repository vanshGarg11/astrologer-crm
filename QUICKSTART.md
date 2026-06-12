# Quick Start Guide - Astrologer CRM

## Windows Users (Recommended)

This project includes helpful batch scripts to get you up and running quickly.

### Step 1: Setup

Double-click `setup.bat` in the project root. This will:
- Check for Node.js installation
- Install backend dependencies
- Install frontend dependencies
- Create environment files (`.env`)

```bash
setup.bat
```

### Step 2: Configure Database

After setup.bat finishes, edit `backend\.env` and set your MongoDB connection:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/astrologer_crm?retryWrites=true&w=majority
```

**Get your MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Paste it in `backend\.env`

### Step 3: Start Servers

Double-click `start.bat` to start both backend and frontend servers. This will:
- Start backend on `http://localhost:5000`
- Start frontend on `http://localhost:5173`
- Automatically open the app in your browser

```bash
start.bat
```

### Step 4: Login

Once the app opens, login with:
- **Email:** `admin@crm.com`
- **Password:** `admin123`

### Optional: Seed Sample Data

To populate the database with sample data (astrologers, customers, consultations), double-click `seed.bat`:

```bash
seed.bat
```

## Other Operating Systems

### macOS / Linux Setup

```bash
# 1. Navigate to project root
cd astrologer-crm

# 2. Backend setup
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI
npm install
npm run dev

# 3. Frontend setup (in new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev

# 4. Seed database (optional, in another terminal)
cd backend
npm run seed
```

### Manual Terminal Commands (Any OS)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Seed database
cd backend
npm run seed
```

## Verification

Check your setup with the verification script:

**Windows:**
```bash
verify.bat
```

**macOS/Linux:**
```bash
cd backend
npm run verify
```

## Troubleshooting

### "MongoDB connection failed"
- Verify MONGO_URI in `backend/.env`
- Check MongoDB Atlas IP whitelist
- Ensure credentials are URL-encoded

### "Cannot find module" or "npm ERR!"
- Delete `node_modules` folders
- Run `setup.bat` again (Windows) or `npm install` in each folder

### "Port 5000 or 5173 already in use"
- Change PORT in `backend/.env`
- Change port in `frontend/vite.config.ts`

### "Frontend can't connect to backend"
- Check `VITE_API_URL` in `frontend/.env`
- Verify backend is running: `http://localhost:5000/api/health`
- Clear browser cache and localStorage

### "Cannot login"
- Clear browser localStorage: Press F12 → Application → Local Storage → Clear
- Run `seed.bat` to ensure admin user exists
- Check credentials match your `.env` settings

## Next Steps

- Read [README.md](./README.md) for complete documentation
- Check [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API reference
- Review [DEVELOPMENT.md](./DEVELOPMENT.md) for development tips

## Support

If you encounter issues:
1. Check the README.md troubleshooting section
2. Verify your setup with `verify.bat`
3. Check backend logs: Look at the backend terminal window for errors
4. Check browser console: Press F12 in browser and look at Console tab

## Project Structure

```
astrologer-crm/
├── setup.bat          ← Run first
├── start.bat          ← Run to start servers
├── seed.bat           ← Run to seed database
├── verify.bat         ← Run to check setup
├── backend/           ← Express API
│   └── .env           ← Set MONGO_URI here
├── frontend/          ← React App
│   └── .env           ← API base URL
└── README.md          ← Full documentation
```

## What's Included

✅ JWT-based admin authentication  
✅ Complete CRUD for astrologers, customers, consultations  
✅ Search, filter, sort, and pagination  
✅ Dark mode support  
✅ Input validation on backend and frontend  
✅ Error handling and recovery  
✅ Responsive mobile-friendly design  

Enjoy using Astrologer CRM!
