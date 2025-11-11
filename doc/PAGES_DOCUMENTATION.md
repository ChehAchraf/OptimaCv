# 📖 Pages & Endpoints Documentation - OptimaCv

**Complete guide to all frontend pages and backend endpoints**  
**Date:** January 2025  
**Version:** 1.0 (Post-merge unified codebase)

---

## 📑 Table of Contents

1. [Frontend Pages Overview](#frontend-pages-overview)
2. [Page-by-Page Details](#page-by-page-details)
3. [Backend Endpoints](#backend-endpoints)
4. [Page-to-API Mapping](#page-to-api-mapping)
5. [User Flows](#user-flows)

---

## 🎨 Frontend Pages Overview

The application has **7 pages** organized in Next.js App Router format:

| Page | Route | Purpose | Status |
|------|-------|---------|--------|
| **Home/Landing** | `/` | Main landing page with feature cards | ✅ Active |
| **Analyzer** | `/analyzer` | AI-powered CV analysis tool | ✅ Active |
| **CV Builder** | `/cv-builder` | Interactive CV creation with templates | ✅ Active |
| **Job Offers** | `/offers` | Browse mock job postings | ✅ Active |
| **Templates** | `/templates` | Browse available CV templates | ✅ Active |
| **Enterprise** | `/entreprise` | Bulk CV ranking for recruiters | ✅ Active |
| **Layout** | `layout.tsx` | Root layout with Navbar | ✅ Active |

---

## 📄 Page-by-Page Details

### 1. **Home / Landing Page** (`/`)

**File:** `frontend/app/page.tsx` (135 lines)

**Purpose:**  
Main landing page that introduces OptimaCv and provides navigation to all major features.

**Key Features:**
- **Hero Section** - Eye-catching introduction with CTA buttons
- **4 Feature Cards** - Quick links to main tools:
  - 📊 Analyze CV (links to `/analyzer`)
  - 💼 Job Offers (links to `/offers`)
  - 📝 CV Builder (links to `/cv-builder`)
  - 🎨 Templates (links to `/templates`)
- **Process Section** - 3-step guide on how to use the platform
- **Trust Section** - Statistics and social proof
- **Company Section** - Enterprise features highlight
- **CTA Section** - Call-to-action for getting started

**Components Used:**
- `HeroSection` - Main hero with animations
- `ProcessSection` - Step-by-step process
- `TrustSection` - Trust indicators
- `CompanySection` - B2B features
- `Card`, `Button` from shadcn/ui
- Framer Motion for animations
- React Icons (HeroIcons v2)

**User Flow:**
1. User lands on homepage
2. Views features and benefits
3. Clicks feature card or CTA button
4. Redirects to specific tool page

**API Calls:** None (static page)

---

### 2. **Analyzer Page** (`/analyzer`)

**File:** `frontend/app/analyzer/page.tsx` (322 lines)

**Purpose:**  
AI-powered CV analysis tool that compares your CV against job descriptions and optionally analyzes visual design.

**Key Features:**

#### **Input Section:**
1. **CV Upload (PDF)** - Required
   - File type: `application/pdf`
   - Shows selected filename
   
2. **Job Description (Textarea)** - Required
   - Character counter
   - 10 rows textarea
   
3. **Visual Analysis (Checkbox)** - Optional
   - When checked, reveals image upload field
   - File types: `image/png`, `image/jpeg`, `image/webp`
   - Animated reveal with Framer Motion

#### **Analysis Results Display:**
- **Match Score** - Large circular badge (e.g., "85%")
- **Strengths** - Green list with checkmarks
- **Weaknesses** - Red list with warning icons
- **Detailed Analysis** - JSON formatted analysis
- **Visual Feedback** (if image provided):
  - Layout score with progress bar (0-10)
  - Layout notes
  - Font choice feedback
  - Color scheme evaluation
  - Improvement suggestions list

**User Flow:**
1. Upload CV PDF → shows "✓ filename.pdf selected"
2. Paste job description → character count updates
3. (Optional) Check "Analyze design" → upload CV screenshot
4. Click "🚀 Launch analysis" → Loading state with spinner
5. Results appear below form with animations
6. View match score, strengths, weaknesses
7. If visual analysis enabled, see design feedback

**API Endpoint:**
- **POST** `/api/v1/analysis/analyze-full-cv/`
- **Request:** FormData
  - `cv_pdf`: File (PDF)
  - `job_description`: string
  - `cv_image`: File (optional, PNG/JPG)
- **Response:** `FullAnalysisResponse`
  ```json
  {
    "filename_pdf": "John_Doe_CV.pdf",
    "filename_image": "cv_screenshot.png",
    "analysis_vs_jd": {
      "match_score": 85,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "detailed_analysis": { ... }
    },
    "visual_analysis": {
      "layout_score": 8,
      "layout_notes": "...",
      "font_choice_notes": "...",
      "color_scheme_notes": "...",
      "suggestions": ["..."]
    }
  }
  ```

**Error Handling:**
- Validates PDF and job description required
- Shows error alert for invalid file types
- Displays API errors in red alert banner

---

### 3. **CV Builder Page** (`/cv-builder`)

**File:** `frontend/app/cv-builder/page.tsx` (295 lines)

**Purpose:**  
Interactive multi-step wizard for creating professional CVs from scratch with live preview.

**Key Features:**

#### **8-Step Wizard:**
1. **Template Selection** - Choose visual design
2. **Job Offer** - Optional job details for tailoring
3. **Personal Info** - Name, email, phone, LinkedIn, GitHub, summary
4. **Experience** - Work history with company, role, dates, description
5. **Projects** - Side projects with name, URL, description
6. **Education** - Schools, degrees, dates
7. **Skills** - Hard skills, soft skills categorization
8. **Languages & Certifications** - Languages spoken and professional certs

#### **Live Preview Panel:**
- **Real-time rendering** - Shows CV as you type
- **Zoom controls** - +/- buttons (0.5x to 2x zoom)
- **Full screen mode** - Dedicated preview modal
- **Template switcher** - Quick toggle between templates
- **Data quality indicators** - 4 badges showing completion:
  - 👤 Personal Info (red if missing name, green if complete)
  - 💼 Experience (count of entries)
  - 🎓 Education (count of entries)
  - 🛠 Skills (count of skills)

#### **Navigation:**
- **Previous button** - Go back to edit earlier steps (disabled on step 1)
- **Next button** - Advance to next step (steps 1-7)
- **Download PDF button** - Final step (step 8) downloads ready CV

**Available Templates:**
- `modern-black` - Default sleek design
- `colored-sidebar` - Sidebar with color accent
- `minimal` - Clean minimalist layout
- `emerald` - Green theme
- `onyx` - Dark professional
- `sapphire` - Blue corporate

**User Flow:**
1. Select template → Preview updates
2. Fill job offer (optional) → Stored for tailoring
3. Enter personal info → Name appears in preview
4. Add experience entries → Each shows in preview
5. Add projects (optional) → Projects section appears
6. Add education → Education section populates
7. Add skills → Skills list updates
8. Add languages/certs → Final touches
9. Click "Download PDF" → Generates PDF using html2canvas + jsPDF

**API Endpoint:**
- **None** - Purely client-side rendering and PDF generation
- Uses `downloadCVAsPDF()` utility from `@/lib/downloadUtils`
- Future: May integrate with `/api/v1/analysis/generate-from-info/` for AI-assisted CV generation

**Components Used:**
- `Stepper` - Step indicator with numbers
- `TemplateSelector` - Template gallery
- `JobOfferForm` - Job details form
- `PersonalInfoForm` - Personal data form
- `EducationForm` - Education entries
- `ExperienceForm` - Work history
- `ProjectsForm` - Projects list
- `SkillsForm` - Skills categorization
- `LanguagesForm` - Languages & certs
- `CVPreview` - Live preview renderer
- `PrintableCV` - Hidden print-ready component

**State Management:**
- `currentStep` - Current wizard step (0-7)
- `selectedTemplate` - Active template ID
- `jobOffer` - Job offer details object
- `formData: CVData` - Complete CV data structure
- `isFullScreen` - Full screen preview state
- `zoomLevel` - Preview zoom (0.5-2.0)

---

### 4. **Job Offers Page** (`/offers`)

**File:** `frontend/app/offers/page.tsx` (313 lines)

**Purpose:**  
Browse mock job listings with skills, responsibilities, and keywords to help users understand job market requirements.

**Key Features:**

#### **Mock Job Listings (6 hardcoded examples):**
1. **Full Stack Developer React/Node.js** - TechCorp, Paris, 45k-65k€
2. **Senior Data Scientist** - DataFlow Analytics, Lyon, 55k-75k€
3. **Senior UX/UI Designer** - CreativeStudio, Toulouse, 40k-55k€
4. **DevOps Engineer** - CloudTech Solutions, Remote, 50k-70k€
5. **Mobile Developer Flutter** (if more exist in file)
6. **Project Manager Agile** (if more exist in file)

#### **Each Job Card Shows:**
- **Header:**
  - Job title
  - Company name with icon (🏢)
  - Location with pin icon (📍)
  - Job type badge (CDI, CDD, etc.)
  - Salary range (💰)
- **Posted date** (e.g., "Il y a 2 jours")
- **Description** - Brief job overview
- **Required Skills** - Badge list (e.g., React, Node.js, TypeScript)
- **Responsibilities** - Bullet point list (5 items)
- **Keywords** - Small badge tags (e.g., "startup", "agile")
- **Action Buttons:**
  - "Voir les détails" (View Details) - Expands card
  - "Analyser mon CV" - Links to `/analyzer` (future: pre-fill job description)

#### **Search & Filter:**
- **Search bar** with magnifying glass icon
- **Filter by:**
  - Location
  - Job Type (CDI, CDD, Freelance)
  - Salary Range
  - Keywords

**User Flow:**
1. Browse job listing cards
2. Click "View Details" → Expanded view with full responsibilities
3. Click "Analyze my CV" → Redirects to `/analyzer` with job pre-filled (future enhancement)
4. Use search to filter jobs by title/company/keywords
5. Use filters to narrow by location/type/salary

**API Endpoint:**
- **Currently:** None (static data)
- **Future:** 
  - `GET /api/v1/jobs/search?q={query}&location={loc}&type={type}`
  - `GET /api/v1/jobs/{id}` - Single job details

**Data Structure:**
```typescript
interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string; // "CDI", "CDD", "Freelance"
  salary: string;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  posted: string;
}
```

**Components Used:**
- `Card` - Job card container
- `Badge` - Skills, keywords, type badges
- `Button` - Action buttons
- `Input` - Search field
- Framer Motion - Stagger animations
- React Icons - HiMapPin, HiClock, HiCurrencyDollar, HiMagnifyingGlass, HiBuildingOffice2

---

### 5. **Templates Page** (`/templates`)

**File:** `frontend/app/templates/page.tsx` (214 lines)

**Purpose:**  
Showcase available CV template designs with previews, categories, and feature descriptions.

**Key Features:**

#### **Template Gallery (6 templates):**

1. **Moderne Professionnel** ⭐ Popular
   - Category: Moderne
   - Color: Blue (bg-blue-100)
   - Features: Design épuré, Couleurs modernes, Mise en page flexible, Compatible ATS

2. **Classique Corporate**
   - Category: Classique
   - Color: Gray (bg-gray-100)
   - Features: Style traditionnel, Très lisible, Format standard, Sérieux et professionnel

3. **Créatif Designer**
   - Category: Créatif
   - Color: Purple (bg-purple-100)
   - Features: Design original, Couleurs vives, Layout créatif, Sections visuelles

4. **Minimaliste Clean** ⭐ Popular
   - Category: Minimaliste
   - Color: Green (bg-green-100)
   - Features: Ultra épuré, Beaucoup d'espace blanc, Focus sur le contenu, Très moderne

5. **Tech & Startups**
   - Category: Tech
   - Color: Indigo (bg-indigo-100)
   - Features: Icônes tech, Sections pour projets, Links GitHub/Portfolio, Style startup

6. **Executive Senior**
   - Category: Executive
   - Color: Slate (bg-slate-100)
   - Features: Très professionnel, Mise en avant expérience, Format premium, Sections leadership

#### **Display Features:**
- **Header** - Title and description
- **Category filters** - Filter by template category (All, Moderne, Classique, Créatif, etc.)
- **Popular badges** - "Populaire" badge on recommended templates
- **Template cards:**
  - Large emoji preview (🎨, 📋, 🎭, ⚪, 💻, 👔)
  - Template name
  - Description
  - Category badge
  - Feature list (4 bullet points)
  - "Utiliser ce template" button
- **Grid layout** - Responsive grid (1-3 columns)
- **Animations** - Framer Motion stagger and hover effects

**User Flow:**
1. View template gallery
2. Click category filter → Show only templates in that category
3. Hover over card → Card lifts and shadow increases
4. Read features and description
5. Click "Use this template" → Redirects to `/cv-builder` with template pre-selected

**API Endpoint:**
- **Currently:** None (static data)
- **Future:** 
  - `GET /api/v1/templates` - Fetch all templates
  - `GET /api/v1/templates/{id}` - Single template details
  - `GET /api/v1/templates/{id}/preview` - Generate preview image

**Data Structure:**
```typescript
interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  preview: string; // Emoji or image URL
  features: string[];
  color: string; // Tailwind class
  popular?: boolean;
}
```

**Components Used:**
- `Card` - Template card
- `Badge` - Category and popular badges
- `Button` - "Use template" CTA
- Link - Next.js navigation
- Framer Motion - Scroll animations

---

### 6. **Enterprise Page** (`/entreprise`)

**File:** `frontend/app/entreprise/page.tsx` (194 lines)

**Purpose:**  
B2B tool for recruiters and hiring managers to upload multiple CVs and rank candidates against a single job description.

**Key Features:**

#### **Bulk CV Analysis:**
- **Upload Multiple PDFs** - Input accepts multiple files (`multiple` attribute)
- **Single Job Description** - One textarea for the role requirements
- **Batch Processing** - Backend processes all CVs in parallel
- **Ranked Results** - Candidates sorted by match score (highest first)

#### **Input Form:**
1. **Job Description Textarea**
   - Label: "1. Collez la description de poste (JD)"
   - 10 rows
   - Required field

2. **Multiple CV Upload**
   - Label: "2. Téléchargez les CVs des candidats (PDFs)"
   - File input with `multiple` attribute
   - Accepts: `application/pdf`
   - Shows count: "{X} fichiers sélectionnés"

3. **Submit Button**
   - "🚀 Analyser et Classer les Candidats"
   - Loading state: "⏳ Analyse en cours..."

#### **Results Display:**
- **Summary Card:**
  - Total processed: "{X} candidats analysés"
  - Top score highlighted
  
- **Ranked Candidate Cards:**
  - **Rank badge** - #1, #2, #3 with special colors
  - **Avatar** - Initials from name (e.g., "JD" for John Doe)
  - **Candidate Info:**
    - Full name
    - Email address
  - **Match Score** - Progress bar + percentage (e.g., 85%)
  - **Strengths** - Green list (top 3-5)
  - **CV Summary** - Brief overview
  - **Action Buttons:**
    - "📥 Download CV" (future)
    - "✉️ Contact Candidate" (future)

#### **Ranking Logic:**
- Sorted by `match_score` (descending)
- Top 3 get special visual treatment:
  - 🥇 #1: Gold border, larger badge
  - 🥈 #2: Silver badge
  - 🥉 #3: Bronze badge

**User Flow:**
1. Recruiter pastes job description
2. Uploads 5-20 candidate CVs (bulk)
3. Clicks "Analyze and Rank"
4. Backend processes all CVs in parallel (~10-30 seconds)
5. Results appear sorted by match score
6. Review top candidates
7. Click contact/download buttons

**API Endpoint:**
- **POST** `/api/v1/analysis/companies/rank-candidates/`
- **Request:** FormData
  - `job_description`: string
  - `cv_pdfs`: File[] (array of PDFs)
- **Response:** `FullRankingResponse`
  ```json
  {
    "total_processed": 15,
    "ranked_results": [
      {
        "filename": "candidate1.pdf",
        "analysis": {
          "contact_info": {
            "name": "John Doe",
            "email": "john@example.com"
          },
          "summary": "Experienced full-stack developer...",
          "match_score": 92,
          "strengths": ["5 years React", "Node.js expert", "AWS certified"]
        }
      },
      // ... more candidates
    ]
  }
  ```

**Error Handling:**
- Validates job description not empty
- Skips non-PDF files with console warning
- Shows error if no valid PDFs processed
- Displays individual CV processing errors (non-blocking)

**Components Used:**
- `Card` - Main container and candidate cards
- `Alert` - Error/success messages
- `Badge` - Rank badges (#1, #2, #3)
- `Progress` - Match score progress bars
- `Avatar` - Candidate initials
- `Button` - Action buttons
- `Label`, `Textarea`, `Input` - Form controls

**Use Cases:**
- **Recruiters** - Quickly filter 50+ CVs to top 10 candidates
- **HR Managers** - Compare candidates for same position
- **Agencies** - Rank talent pool against client requirements
- **Startups** - Efficient candidate screening with limited HR resources

---

### 7. **Root Layout** (`layout.tsx`)

**File:** `frontend/app/layout.tsx`

**Purpose:**  
Root layout component that wraps all pages with common UI elements and configuration.

**Key Features:**
- **HTML structure** - `<html lang="en">` wrapper
- **Font configuration** - Inter font from Google Fonts
- **Navbar** - Persistent navigation across all pages
- **Dark mode support** - Class-based dark mode toggle
- **Metadata** - SEO title and description
- **Body styling** - Background colors, font family, antialiasing

**Components:**
- `Navbar` - Top navigation bar with logo and links

**Navbar Links:**
- Home (/)
- Analyzer (/analyzer)
- CV Builder (/cv-builder)
- Job Offers (/offers)
- Templates (/templates)
- Enterprise (/entreprise)

---

## 🔌 Backend Endpoints

### **Base URL:** `http://localhost:8000`

### **API Router:** `/api/v1/`

All endpoints are organized under the `/api/v1/` prefix with three main routers:

---

### **1. Analysis Router** (`/api/v1/analysis/`)

**File:** `backend/apis/v1/endpoints/analysis2.py`

#### **Endpoint 1: Analyze CV Only**
```http
POST /api/v1/analysis/analyze-cv-only/
```

**Purpose:** Parse and analyze a CV PDF without job comparison.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: File (PDF) - Required

**Response:** `CVOnlyResponse`
```json
{
  "filename": "my_cv.pdf",
  "analysis_source": "AI Service (Gemini)",
  "analysis": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "summary": "Experienced software engineer...",
    "skills": ["Python", "React", "AWS"],
    "experience": [
      {
        "company": "TechCorp",
        "title": "Senior Developer",
        "duration": "2020-2023",
        "details": "Led development team..."
      }
    ],
    "education": [
      {
        "institution": "MIT",
        "degree": "BS Computer Science",
        "duration": "2016-2020"
      }
    ]
  }
}
```

**Used By:** Future feature - Quick CV parser

---

#### **Endpoint 2: Analyze CV vs Job Description**
```http
POST /api/v1/analysis/analyze-cv-vs-jd/
```

**Purpose:** Compare CV against job description for match scoring.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: File (PDF) - Required
  - `job_description`: string - Required

**Response:** `CVvsJDResponse`
```json
{
  "filename": "my_cv.pdf",
  "analysis_source": "AI Service (Gemini)",
  "analysis_vs_jd": {
    "match_score": 85,
    "strengths": [
      "5+ years React experience matches requirement",
      "AWS certification mentioned in JD"
    ],
    "weaknesses": [
      "No Kubernetes experience",
      "Missing leadership examples"
    ],
    "summary": "Strong technical match...",
    "detailed_analysis": {
      "skills_match": 90,
      "experience_match": 85,
      "education_match": 80
    }
  }
}
```

**Used By:** `/analyzer` page (text-only analysis)

---

#### **Endpoint 3: Analyze CV Visual Design**
```http
POST /api/v1/analysis/analyze-cv-visual/
```

**Purpose:** Analyze visual design aspects of CV from an image.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: File (PNG/JPG/WebP) - Required

**Response:** `VisualAnalysisResponse`
```json
{
  "filename": "cv_screenshot.png",
  "feedback": {
    "layout_score": 8,
    "overall_professionalism": "Very professional layout with good balance",
    "layout_notes": "Excellent use of white space and hierarchy",
    "font_choice_notes": "Professional sans-serif fonts, good readability",
    "color_scheme_notes": "Conservative blue palette, ATS-friendly",
    "suggestions": [
      "Consider increasing line spacing in experience section",
      "Add more visual separation between sections",
      "Skills section could use icons for better scanning"
    ]
  }
}
```

**Used By:** `/analyzer` page (visual analysis checkbox)

---

#### **Endpoint 4: Full CV Analysis (Text + Visual)**
```http
POST /api/v1/analysis/analyze-full-cv/
```

**Purpose:** Combined text and optional visual analysis (used by Analyzer page).

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `cv_pdf`: File (PDF) - Required
  - `job_description`: string - Required
  - `cv_image`: File (PNG/JPG) - Optional

**Response:** `FullAnalysisResponse`
```json
{
  "filename_pdf": "my_cv.pdf",
  "filename_image": "cv_screenshot.png",
  "analysis_vs_jd": {
    "match_score": 85,
    "strengths": ["..."],
    "weaknesses": ["..."],
    "summary": "...",
    "detailed_analysis": {}
  },
  "visual_analysis": {
    "layout_score": 8,
    "layout_notes": "...",
    "font_choice_notes": "...",
    "color_scheme_notes": "...",
    "suggestions": ["..."]
  }
}
```

**Used By:** `/analyzer` page (main endpoint)

---

#### **Endpoint 5: Rank Multiple Candidates**
```http
POST /api/v1/analysis/companies/rank-candidates/
```

**Purpose:** Bulk CV analysis and ranking for recruiters (B2B feature).

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `job_description`: string - Required
  - `cv_pdfs`: File[] (multiple PDFs) - Required

**Response:** `FullRankingResponse`
```json
{
  "total_processed": 15,
  "ranked_results": [
    {
      "filename": "candidate_a.pdf",
      "analysis": {
        "contact_info": {
          "name": "Alice Smith",
          "email": "alice@example.com"
        },
        "summary": "Senior developer with 8 years...",
        "match_score": 92,
        "strengths": ["8 years React", "Team leadership", "AWS certified"]
      }
    },
    {
      "filename": "candidate_b.pdf",
      "analysis": {
        "match_score": 87,
        // ...
      }
    }
    // ... sorted by match_score descending
  ]
}
```

**Used By:** `/entreprise` page

---

#### **Endpoint 6: Generate CV from Structured Data**
```http
POST /api/v1/analysis/generate-from-info/
```

**Purpose:** AI-assisted CV generation from JSON data (future feature).

**Request:**
- **Content-Type:** `application/json`
- **Body:** `CVGenerateRequest`
```json
{
  "cv_data": {
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "linkedin": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe"
    },
    "education": [
      {
        "school": "MIT",
        "degree": "BS Computer Science",
        "startDate": "2016",
        "endDate": "2020"
      }
    ],
    "experience": [
      {
        "company": "TechCorp",
        "role": "Senior Developer",
        "startDate": "2020",
        "endDate": "2023",
        "description": "Led development team of 5..."
      }
    ],
    "projects": [],
    "skills": {
      "hard": ["Python", "React", "AWS"],
      "soft": ["Leadership", "Communication"]
    }
  },
  "job_description": "Optional JD for tailoring"
}
```

**Response:** `GeneratedCVResponse`
```json
{
  "organized_data": {
    "personalInfo": { /* AI-improved data */ },
    "education": [ /* AI-organized */ ],
    "experience": [ /* AI-enhanced descriptions */ ],
    "skills": { /* AI-categorized */ }
  },
  "ai_summary": "Strong technical background with...",
  "strengths": ["Relevant experience", "Good skill set"],
  "weaknesses": ["Could add more leadership examples"]
}
```

**Used By:** Future CV builder AI assistant feature

---

### **2. Optimization Router** (`/api/v1/optimization/`)

**File:** `backend/apis/v1/endpoints/optimization.py`

#### **Endpoint: Optimize Content**
```http
POST /api/v1/optimization/optimize-content
```

**Purpose:** Optimize CV sections (experience/projects) based on job requirements.

**Request:**
- **Content-Type:** `application/json`
- **Body:** `OptimizationRequest`
```json
{
  "job_offer": {
    "title": "Senior React Developer",
    "description": "We need someone with 5+ years React...",
    "required_skills": ["React", "TypeScript", "AWS"]
  },
  "original_text": "Worked on web applications using React and Node.js. Built features and fixed bugs."
}
```

**Response:** `OptimizationResponse`
```json
{
  "optimized_text": "Led development of enterprise web applications using React, TypeScript, and AWS services. Architected scalable frontend solutions serving 100K+ users. Implemented CI/CD pipelines reducing deployment time by 60%.",
  "suggestions": [
    "Add specific metrics (users, performance gains)",
    "Mention AWS services by name (Lambda, S3, etc.)",
    "Highlight leadership and architecture decisions"
  ],
  "match_score": 88
}
```

**Used By:** Future CV builder optimization feature

---

### **3. Ollama Router** (`/api/v1/ollama/`)

**File:** `backend/apis/v1/endpoints/ollama_endpoint.py`

#### **Endpoint: Optimize with Raw Prompt**
```http
POST /api/v1/ollama/optimize-ollama
```

**Purpose:** Direct prompt-to-AI query (low-level utility for frontend).

**Request:**
- **Content-Type:** `application/json`
- **Body:** `OllamaOptimizationRequest`
```json
{
  "prompt": "Improve this CV experience section to match this job:\n\nJob: Senior React Developer...\n\nExperience: Built web apps with React..."
}
```

**Response:** `OllamaOptimizationResponse`
```json
{
  "optimizedText": "Architected and delivered enterprise-grade React applications serving 500K+ monthly active users. Led frontend development using React, TypeScript, Redux, and modern CI/CD practices..."
}
```

**Used By:** Future inline optimization in CV builder

**Note:** Uses `ai_service.query()` which routes to Ollama or Gemini based on `AI_PROVIDER` env var.

---

## 🔗 Page-to-API Mapping

| Frontend Page | API Endpoints Used | Purpose |
|---------------|-------------------|---------|
| **`/` (Home)** | None | Static landing page |
| **`/analyzer`** | `POST /api/v1/analysis/analyze-full-cv/` | CV + JD analysis with optional visual |
| **`/cv-builder`** | None currently | Client-side rendering and PDF export |
| **`/offers`** | None currently | Static job listings (mock data) |
| **`/templates`** | None currently | Static template gallery |
| **`/entreprise`** | `POST /api/v1/analysis/companies/rank-candidates/` | Bulk CV ranking |

### **Future Integrations:**
- **CV Builder** → `/api/v1/analysis/generate-from-info/` for AI assistance
- **CV Builder** → `/api/v1/optimization/optimize-content` for section optimization
- **CV Builder** → `/api/v1/ollama/optimize-ollama` for inline suggestions
- **Offers Page** → `GET /api/v1/jobs/` for live job listings
- **Templates Page** → `GET /api/v1/templates/` for dynamic templates

---

## 👤 User Flows

### **Flow 1: Job Seeker - Analyze CV**

```
1. User visits OptimaCv.com (/)
2. Clicks "Analyze CV" feature card
3. Lands on /analyzer
4. Uploads CV PDF (required)
5. Pastes job description (required)
6. Optionally checks "Analyze design" checkbox
   └─ If checked: uploads CV screenshot
7. Clicks "Launch analysis"
8. Backend calls:
   └─ POST /api/v1/analysis/analyze-full-cv/
   └─ AI service analyzes text (Gemini/Ollama)
   └─ If image provided: AI analyzes visual design
9. Results display:
   ├─ Match score (e.g., 85%)
   ├─ Strengths (green list)
   ├─ Weaknesses (red list)
   └─ Visual feedback (if applicable)
10. User reviews feedback
11. User goes to /cv-builder to create optimized CV
```

---

### **Flow 2: Job Seeker - Build CV from Scratch**

```
1. User visits home (/) or clicks "CV Builder" from Navbar
2. Lands on /cv-builder
3. Step 1: Selects template (e.g., "modern-black")
   └─ Preview updates immediately
4. Step 2: Optionally enters job offer details for tailoring
5. Step 3: Fills personal info (name, email, phone, LinkedIn)
   └─ Name appears in preview
6. Step 4: Adds work experiences (company, role, dates, description)
   └─ Each entry appears in preview
7. Step 5: Adds projects (optional)
8. Step 6: Adds education (school, degree, dates)
9. Step 7: Adds skills (hard skills, soft skills)
10. Step 8: Adds languages and certifications
11. Reviews live preview:
    ├─ Uses zoom controls (+/-)
    ├─ Checks data quality indicators
    └─ Opens full screen preview
12. Clicks "Download PDF"
13. Browser downloads CV as PDF file:
    └─ Uses html2canvas + jsPDF client-side
14. User has ready-to-submit CV!
```

---

### **Flow 3: Job Seeker - Browse Jobs & Templates**

```
1. User clicks "Job Offers" from Navbar
2. Lands on /offers
3. Browses 6 mock job listings
4. Uses search bar to filter by keyword
5. Uses filters (location, type, salary)
6. Clicks "View Details" on interesting job
   └─ Card expands to show responsibilities
7. Clicks "Analyze my CV" button
   └─ Redirects to /analyzer (future: pre-fills job description)
8. User navigates to /templates
9. Browses 6 template designs
10. Clicks category filter (e.g., "Tech")
11. Reads features of "Tech & Startups" template
12. Clicks "Use this template"
    └─ Redirects to /cv-builder with template pre-selected
```

---

### **Flow 4: Recruiter - Rank Candidates (B2B)**

```
1. Recruiter logs in (future: auth)
2. Clicks "Enterprise" from Navbar
3. Lands on /entreprise
4. Pastes job description for "Senior React Developer" role
5. Uploads 20 candidate CVs (bulk PDF upload)
6. Clicks "Analyze and Rank Candidates"
7. Backend processes:
   ├─ POST /api/v1/analysis/companies/rank-candidates/
   ├─ Parses all 20 PDFs in parallel
   ├─ AI analyzes each CV vs JD
   └─ Returns sorted by match_score
8. Results display (20-30 seconds later):
   ├─ Total processed: "20 candidates"
   ├─ #1 Alice (92%) with gold badge
   ├─ #2 Bob (87%) with silver badge
   ├─ #3 Carol (85%) with bronze badge
   └─ ... remaining candidates
9. Recruiter reviews top 5 candidates
10. Clicks "Contact Candidate" (future feature)
11. Shortlists top candidates for interviews
```

---

## 🧩 Components Architecture

### **Shared UI Components** (`frontend/components/ui/`)
- `alert.tsx` - Error/success alerts
- `avatar.tsx` - User initials display
- `badge.tsx` - Category/status badges
- `button.tsx` - Primary actions
- `card.tsx` - Content containers
- `checkbox.tsx` - Form checkboxes
- `input.tsx` - Text inputs
- `label.tsx` - Form labels
- `progress.tsx` - Progress bars (match scores)
- `separator.tsx` - Visual dividers
- `stepper.tsx` - Step indicators
- `tabs.tsx` - Tab navigation
- `textarea.tsx` - Multi-line inputs
- `tooltip.tsx` - Hover tooltips

### **CV Builder Components** (`frontend/components/cv/`)
- `CVPreview.tsx` - Live CV preview renderer
- `PrintableCV.tsx` - Print/PDF-ready component
- `SectionOrdering.tsx` - Drag-and-drop section reordering
- `Stepper.tsx` - 8-step wizard indicator
- `TemplateSelector.tsx` - Template gallery picker

### **CV Builder Forms** (`frontend/components/cv/forms/`)
- `EducationForm.tsx` - Education entries
- `ExperienceForm.tsx` - Work history
- `JobOfferForm.tsx` - Job offer input
- `LanguagesForm.tsx` - Languages & certs
- `PersonalInfoForm.tsx` - Contact info
- `ProjectsForm.tsx` - Side projects
- `SkillsForm.tsx` - Skills categorization

### **CV Templates** (`frontend/components/cv/templates/`)
- `ColoredSidebarTemplate.tsx` - Sidebar with accent color
- `EmeraldTemplate.tsx` - Green professional theme
- `MinimalTemplate.tsx` - Clean minimalist
- `ModernBlackTemplate.tsx` - Sleek dark design
- `OnyxTemplate.tsx` - Dark corporate
- `SapphireTemplate.tsx` - Blue traditional

### **Landing Page Components** (`frontend/components/`)
- `CompanySection.tsx` - B2B features highlight
- `HeroSection.tsx` - Main hero with CTA
- `Navbar.tsx` - Top navigation
- `ProcessSection.tsx` - 3-step guide
- `TrustSection.tsx` - Statistics/testimonials

---

## 🛠 Technology Stack

### **Frontend:**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Library:** shadcn/ui (Radix UI primitives)
- **Animations:** Framer Motion 12
- **Icons:** React Icons (HeroIcons v2)
- **PDF Export:** html2canvas + jsPDF
- **HTTP:** Native Fetch API

### **Backend:**
- **Framework:** FastAPI (Python)
- **Validation:** Pydantic v2
- **PDF Parsing:** PyPDF2
- **AI Services:**
  - Google Gemini (cloud, default)
  - Ollama (local, switchable)
- **Architecture:** Facade pattern (`ai_service.py`)
- **Server:** Uvicorn ASGI

### **Development:**
- **Package Manager:** npm (frontend), pip (backend)
- **Dev Server:** Next.js dev + Uvicorn
- **Start Script:** `start-dev.ps1` (PowerShell automation)
- **Environment:** `.env` for config

---

## 📊 Key Metrics & Statistics

### **Page Complexity:**
| Page | Lines of Code | Components Used | API Calls | Complexity |
|------|---------------|-----------------|-----------|------------|
| Home | 135 | 6 | 0 | Low |
| Analyzer | 322 | 12 | 1 | High |
| CV Builder | 295 | 15+ | 0 | Very High |
| Offers | 313 | 8 | 0 | Medium |
| Templates | 214 | 6 | 0 | Low |
| Enterprise | 194 | 10 | 1 | Medium |

### **Backend Endpoints:**
- **Total:** 8 endpoints
- **Active:** 6 endpoints (2 future)
- **Authentication:** None (public for now)
- **Rate Limiting:** Not implemented yet

### **Data Flow:**
```
User Input → Frontend Form → API Request (FormData/JSON)
    ↓
Backend Endpoint → PDF Service (parse text)
    ↓
AI Service (Facade) → Ollama/Gemini
    ↓
AI Response → Pydantic Validation
    ↓
JSON Response → Frontend Display
```

---

## 🔐 Security & Privacy

### **Current Implementation:**
- ✅ File type validation (PDF, PNG, JPG only)
- ✅ Input sanitization (Pydantic models)
- ✅ Error handling (try-catch blocks)
- ⚠️ No file size limits yet
- ⚠️ No rate limiting
- ⚠️ No authentication
- ⚠️ Files not stored (processed in memory)

### **Recommended Enhancements:**
- [ ] Add file size limits (e.g., 10MB max)
- [ ] Implement rate limiting (e.g., 10 requests/minute)
- [ ] Add user authentication (JWT tokens)
- [ ] Store processed CVs with user consent
- [ ] Add GDPR compliance (data deletion)
- [ ] Implement CORS properly
- [ ] Add HTTPS in production
- [ ] Sanitize uploaded filenames

---

## 🚀 Future Enhancements

### **Planned Features:**
1. **User Authentication** - Login/signup with JWT
2. **Save CV Projects** - Store drafts in database
3. **CV History** - Track analysis history
4. **Export Formats** - DOCX, HTML, JSON export
5. **Live Job API** - Replace mock data with real jobs
6. **AI Chat Assistant** - Chat with AI for CV advice
7. **Template Customization** - Color/font editors
8. **Collaboration** - Share CVs for feedback
9. **Analytics Dashboard** - Track application success
10. **Mobile App** - React Native version

### **Backend Improvements:**
- [ ] Database integration (PostgreSQL)
- [ ] Caching layer (Redis)
- [ ] Background jobs (Celery)
- [ ] Webhooks for notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] PDF template engine (Jinja2)

---

## 📞 Support & Documentation

**Main Docs:**
- `README.md` - Project overview and setup
- `FULL_REVIEW.md` - Complete code review
- `START_GUIDE.md` - Development guide
- `QUICK_START.md` - Quick reference
- `PAGES_DOCUMENTATION.md` - This file

**Contact:**
- GitHub Issues: For bug reports
- Email: support@optimacv.com (if applicable)

---

**Last Updated:** January 2025  
**Maintainer:** OptimaCv Development Team  
**Version:** 1.0.0 (Post-merge unified codebase)

---

## 📝 Quick Reference

### **Development URLs:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs:** http://localhost:8000/redoc

### **Start Development:**
```powershell
# Automated (recommended)
.\start-dev.ps1

# Manual
# Terminal 1: Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Ollama (if using local AI)
ollama serve
ollama pull llama3.2:latest
```

### **Environment Variables (.env):**
```env
# AI Provider Selection
AI_PROVIDER=gemini  # or "ollama"

# Gemini Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Ollama Configuration (local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
```

---

*This documentation reflects the current state of the OptimaCv application after merging duplicate files and unifying the codebase.*
