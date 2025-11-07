# OptimaCv - CV Generator with AI Enhancement

## New Features Added

### 📝 Enhanced CV Templates
Three new professional templates have been added that match the demo designs:

1. **Modern Black Template** - Clean 2-column layout with dark sidebar for photo and contact info
2. **Colored Sidebar Template** - Professional layout with customizable colored left sidebar
3. **Minimal Template** - Clean, centered design perfect for traditional industries

### 🤖 AI-Powered CV Optimization
- **Smart Content Organization**: AI analyzes your input and organizes it into professional sections
- **Job-Specific Tailoring**: Paste a job description to get AI recommendations for optimizing your CV
- **Instant Feedback**: Get strengths and weaknesses analysis to improve your application

### 📋 Enhanced Data Collection
New form fields support:
- Profile photo upload
- Professional title and summary
- Multiple contact methods (LinkedIn, GitHub, Portfolio, Website)
- Location information
- Languages with proficiency levels
- Professional certifications
- Enhanced skills categorization

## How to Use

### 1. Start the Application
```powershell
# From the project root directory
.\start-dev.ps1
```

### 2. Navigate to CV Builder
- Open http://localhost:3000
- Go to "CV Builder" from the navigation

### 3. Create Your CV
1. **Select Template**: Choose from 6 available templates
2. **Personal Info**: Fill in your details including photo upload
3. **Education**: Add your educational background
4. **Experience**: Detail your work history
5. **Projects**: Showcase your key projects
6. **Skills**: List technical and soft skills
7. **Languages & Certifications**: Add languages and professional certifications

### 4. AI Enhancement (Optional)
- Paste a job description in the "Optimize with AI" section
- Click "Optimize with AI" to get:
  - Organized and improved content
  - Professional summary
  - Strengths analysis
  - Areas for improvement

### 5. Export Your CV
- Preview your CV in real-time
- Click "Download CV" to generate a PDF
- Print functionality optimized for professional output

## API Endpoints

### POST /api/v1/analysis/generate-from-info/
Enhances CV data using AI analysis.

**Request Body:**
```json
{
  "cv_data": {
    "personalInfo": { /* CV data structure */ },
    "education": [...],
    "experience": [...],
    "projects": [...],
    "skills": { /* enhanced skills with languages, certifications */ }
  },
  "job_description": "Optional job description for tailoring",
  "template": "modern-black"
}
```

**Response:**
```json
{
  "organized_data": { /* Enhanced CV data */ },
  "ai_summary": "Professional summary",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area for improvement 1"]
}
```

## Template Features

### Modern Black Template
- Professional photo display
- Dark sidebar with contact info
- Clean typography with clear sections
- Print-optimized layout

### Colored Sidebar Template  
- Customizable accent color
- Large photo with border
- Professional header design
- Color-coded section dividers

### Minimal Template
- Clean, centered layout
- Small profile photo
- Traditional formatting
- Perfect for conservative industries

## Print Optimization
All templates include:
- Print-specific CSS for proper PDF generation
- Optimized font sizes and spacing
- Color preservation for professional output
- Page break handling

## Technical Details

### Frontend
- React/Next.js with TypeScript
- Tailwind CSS for styling
- React-to-print for PDF generation
- Enhanced form validation

### Backend
- FastAPI with Python
- AI integration (Ollama/Gemini)
- Pydantic schemas for data validation
- RESTful API design

### Data Structure
Enhanced CV data now supports:
- Profile photos (base64 encoded)
- Multiple contact methods with automatic icon detection
- Professional summaries and titles
- Languages with proficiency levels
- Professional certifications
- Enhanced skills categorization

## Testing
Basic API tests are included in `test_cv_generation.py`. To run manually:
```python
python test_cv_generation.py
```

## Troubleshooting

### AI Not Working
- Check that your AI provider (Ollama/Gemini) is properly configured in `.env`
- Verify API keys and model availability
- Check backend logs for specific error messages

### Print Issues
- Use Chrome or Edge for best print results
- Ensure print settings are set to "More settings" > "Print backgrounds"
- For best quality, print to PDF first then print the PDF

### Template Images Missing
- Template preview images are located in `/public/images/cv-templates/`
- Ensure SVG files exist for all templates: onyx.svg, sapphire.svg, emerald.svg, modern-black.svg, colored-sidebar.svg, minimal.svg

## Future Enhancements
- Color customization for all templates
- Additional template designs
- Export to various formats (Word, LaTeX)
- Advanced AI features (keyword optimization, ATS scoring)
- Template marketplace integration