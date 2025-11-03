# OptimaCV - CV Analysis Platform

OptimaCV is a full-stack application that uses AI to analyze CVs against job descriptions. It provides detailed analysis including match scores, strengths, weaknesses, and visual design feedback.

## 🏗️ Project Structure

```
rs/
├── backend/          # FastAPI Python backend
│   ├── apis/        # API endpoints
│   ├── core/        # Configuration
│   ├── schemas/     # Pydantic models
│   ├── services/    # Business logic (Gemini AI, PDF parsing)
│   └── main.py      # FastAPI application entry point
├── frontend/        # Next.js TypeScript frontend
│   ├── app/         # Next.js app router pages
│   ├── components/  # React components
│   └── config/      # Configuration files
└── requirements.txt # Python dependencies
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** and npm - [Download Node.js](https://nodejs.org/)
- **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)

## 🚀 Quick Start (Windows)

If you're on Windows, you can use the provided PowerShell script:

```powershell
.\start-dev.ps1
```

This script will:
1. Check for `.env` file
2. Install frontend dependencies if needed
3. Start both backend and frontend servers

## 📝 Manual Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ChehAchraf/OptimaCv.git
cd rs
```

### Step 2: Backend Setup

1. **Create a virtual environment** (recommended):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

2. **Install Python dependencies**:

```bash
pip install -r requirements.txt
```

3. **Create `.env` file** in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Replace `your_google_api_key_here` with your actual Google Gemini API key.

### Step 3: Frontend Setup

1. **Navigate to frontend directory**:

```bash
cd frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Return to root directory**:

```bash
cd ..
```

## 🎯 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**

```bash
# Activate virtual environment if not already activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- API Root: `http://localhost:8000/`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Option 2: Use PowerShell Script (Windows Only)

```powershell
.\start-dev.ps1
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following:

```env
GOOGLE_API_KEY=your_google_gemini_api_key

```

**How to get a Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## 📡 API Endpoints

The backend provides the following main endpoints:

- `POST /api/v1/analysis/analyze-cv-only/` - Analyze CV only
- `POST /api/v1/analysis/analyze-cv-vs-jd/` - Compare CV with Job Description
- `POST /api/v1/analysis/analyze-cv-visual/` - Visual design analysis
- `POST /api/v1/analysis/analyze-full-cv/` - Complete analysis (text + visual)
- `POST /api/v1/analysis/companies/rank-candidates/` - Rank multiple candidates

Visit `http://localhost:8000/docs` for interactive API documentation.

## 🛠️ Development

### Backend Development

- **Location**: `backend/`
- **Framework**: FastAPI
- **Auto-reload**: Enabled with `--reload` flag
- **API Docs**: Available at `/docs` endpoint

### Frontend Development

- **Location**: `frontend/`
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui

### Building for Production

**Backend:**
```bash
# No build step needed, just ensure dependencies are installed
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Change port in uvicorn command
python -m uvicorn backend.main:app --reload --port 8001
```

**Module not found errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**API Key errors:**
- Verify `.env` file exists in root directory
- Check that `GOOGLE_API_KEY` is set correctly
- Ensure no extra spaces or quotes around the API key

### Frontend Issues

**Port 3000 already in use:**
- Next.js will automatically use the next available port (3001, 3002, etc.)

**Dependencies not installing:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
- Clear Next.js cache: `rm -rf frontend/.next`
- Reinstall dependencies
- Check Node.js version (requires 18+)

### Common Issues

**CORS errors:**
- Ensure backend is running on port 8000
- Check `backend/main.py` for CORS configuration
- Verify frontend is calling `http://localhost:8000`

**API connection refused:**
- Verify backend server is running
- Check firewall settings
- Ensure both servers are running on correct ports

## 📦 Dependencies

### Backend
- FastAPI - Web framework
- Uvicorn - ASGI server
- Google Generative AI - AI analysis
- PyMuPDF (fitz) - PDF parsing
- Pydantic - Data validation

### Frontend
- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Framer Motion - Animations
- Radix UI - Component primitives

## 📄 License

Akhouya hada dyalna thzo tmchi l7abs

## 🤝 Contributing

Respect the archeticture layhfdk 

## 📞 Support

For issues and questions, please open an issue on the repository.
