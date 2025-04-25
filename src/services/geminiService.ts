
import { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';

interface GeminiServiceProps {
  apiKey: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private model = 'models/gemini-1.5-pro-latest';

  constructor({ apiKey }: GeminiServiceProps) {
    this.apiKey = apiKey;
  }

  async analyzeResume(pdfText: string): Promise<ResumeAnalysisResult> {
    try {
      const prompt = `
        You are an expert resume reviewer. Analyze the following resume text extracted from a PDF and provide detailed professional feedback.
        Format your response as a JSON object with the following structure:
        {
          "scores": {
            "overall": <number 0-100>,
            "content": <number 0-100>,
            "formatting": <number 0-100>,
            "keywords": <number 0-100>
          },
          "summary": "<brief overall assessment>",
          "strengths": ["<strength 1>", "<strength 2>", ...],
          "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
          "sections": [
            {
              "title": "<section name>",
              "feedback": "<detailed feedback>",
              "improvements": ["<suggestion 1>", "<suggestion 2>", ...]
            },
            ...
          ],
          "keywords": {
            "matched": ["<keyword 1>", "<keyword 2>", ...],
            "missing": ["<suggested keyword 1>", "<suggested keyword 2>", ...]
          },
          "improvement_suggestions": "<detailed paragraph with suggestions for improvement>"
        }
        
        Don't include placeholders like <...> in your response, replace them with actual content.
        Be detailed but concise in your feedback. Focus on actionable improvements.
        
        Resume text:
        ${pdfText}
      `;

      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4000,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API error:', data);
        throw new Error(data.error?.message || 'Failed to analyze resume');
      }
      
      // Parse the JSON response from Gemini
      const textContent = data.candidates[0].content.parts[0].text;
      const jsonStartIndex = textContent.indexOf('{');
      const jsonEndIndex = textContent.lastIndexOf('}') + 1;
      
      if (jsonStartIndex === -1 || jsonEndIndex === 0) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const jsonText = textContent.substring(jsonStartIndex, jsonEndIndex);
      const analysisResult = JSON.parse(jsonText) as ResumeAnalysisResult;
      
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  }
}

export default GeminiService;
