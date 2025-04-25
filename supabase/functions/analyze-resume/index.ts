import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using a supported model name
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { content } = await req.json();
    if (!content) {
      throw new Error('No resume content provided');
    }

    console.log('Analyzing resume content...');
    
    const prompt = `You are an expert resume reviewer. Analyze the following resume text and provide detailed professional feedback.
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
        }
      ],
      "keywords": {
        "matched": ["<keyword 1>", "<keyword 2>", ...],
        "missing": ["<suggested keyword 1>", "<suggested keyword 2>", ...]
      },
      "improvement_suggestions": "<detailed paragraph with suggestions for improvement>"
    }

    Resume text to analyze:
    ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response text as JSON
    const analysis = JSON.parse(text);
    
    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
