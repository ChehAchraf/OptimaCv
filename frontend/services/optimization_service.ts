import { JobOffer } from '@/types/cv';

interface OptimizationRequest {
  jobOffer: JobOffer;
  originalText: string;
  type: 'experience' | 'project';
  itemTitle: string; // role/company for experience, project name for project
}

interface OptimizationResponse {
  optimizedText: string;
  improvements: string[];
  matchScore: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function optimizeContentBasedOnOffer(
  request: OptimizationRequest
): Promise<OptimizationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/optimize-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to optimize content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error optimizing content:', error);
    throw error;
  }
}

// Fallback function for offline/demo mode
export async function optimizeContentOffline(request: OptimizationRequest): Promise<OptimizationResponse> {
  const { jobOffer, originalText, type, itemTitle } = request;
  
  if (!jobOffer || !jobOffer.description.trim()) {
    return {
      optimizedText: originalText,
      improvements: ['No job offer provided for optimization.'],
      matchScore: 0
    };
  }

  const prompt = `
    As an expert career coach and resume writer, your task is to rewrite a user's professional experience to perfectly align with a specific job offer.

    **Job Offer Details:**
    - **Title:** ${jobOffer.title}
    - **Company:** ${jobOffer.company}
    - **Description & Requirements:** ${jobOffer.description}

    **User's Current Experience Entry:**
    - **Item:** ${itemTitle}
    - **Current Description:** ${originalText}

    **Your Task:**
    Rewrite the "Current Description" to be more impactful and tailored for the job offer. The rewritten description should be a maximum of 3 lines long.
    1.  **Integrate Keywords:** Naturally weave in relevant skills and keywords from the job description.
    2.  **Quantify Achievements:** Where possible, add metrics or quantifiable outcomes (e.g., "Increased sales by 15%," "Managed a team of 5," "Reduced processing time by 30%"). You can invent realistic numbers if none are provided.
    3.  **Use Action Verbs:** Start bullet points or sentences with strong action verbs.
    4.  **Focus on Impact:** Emphasize the results and impact of the user's work, not just the responsibilities.
    5.  **Maintain Original Meaning:** The core of the user's experience should remain truthful. Enhance, don't invent.
    6.  **Output ONLY the rewritten description**, without any extra commentary or introductory phrases. The output should be a single block of text ready to be placed back into a resume.

    **Rewritten Description:**
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ollama/optimize-ollama`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ollama optimization failed:', errorData);
      throw new Error('Failed to optimize content with Ollama');
    }

    const result = await response.json();
    
    // Simple keyword matching for score calculation
    const jobText = jobOffer.description.toLowerCase();
    const keywords = jobText.split(/[,.\s]+/).filter(word => word.length > 4);
    const optimizedLower = result.optimizedText.toLowerCase();
    const matchedKeywords = keywords.filter(keyword => optimizedLower.includes(keyword));
    const matchScore = Math.min((matchedKeywords.length / Math.max(keywords.length * 0.5, 1)) * 100, 95);

    return {
      optimizedText: result.optimizedText.trim(),
      improvements: [
        'Rewritten for better alignment with job offer.',
        'Integrated relevant keywords.',
        'Enhanced focus on achievements and impact.'
      ],
      matchScore: Math.round(matchScore)
    };

  } catch (error) {
    console.error('Error during offline optimization:', error);
    // Return original text as a fallback if API call fails
    return {
      optimizedText: originalText,
      improvements: ['AI optimization service is currently unavailable.'],
      matchScore: 0
    };
  }
}