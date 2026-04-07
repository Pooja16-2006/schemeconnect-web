# Running SchemeConnect

Architecture:
- `frontend/`: Next.js citizen and admin portal
- `server/`: Express API layer for MERN orchestration
- `ml-service/`: FastAPI + ML eligibility engine

Start services in this order.

## 1. ML Service
```powershell
cd c:\Users\Pooja\OneDrive\Desktop\schemeconnect-web\ml-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 2. Express API
```powershell
cd c:\Users\Pooja\OneDrive\Desktop\schemeconnect-web
node server\index.js
```

## 3. Frontend
```powershell
cd c:\Users\Pooja\OneDrive\Desktop\schemeconnect-web\frontend
cmd /c npm.cmd run dev
```

## URLs
- Frontend: `http://localhost:3000`
- Express API health: `http://localhost:5000/api/health`
- ML service health: `http://localhost:8000/health`

## Optional MongoDB
If you want MongoDB enabled for profile persistence, set:

```powershell
$env:MONGO_URI="your_mongodb_connection_string"
```

before starting the Express API.
