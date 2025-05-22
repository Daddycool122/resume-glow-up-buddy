import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

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
    // First try to get the API key from the environment variables
    let apiKey = Deno.env.get('GEMINI_API_KEY');
    
    // Parse the request body
    const { content, geminiApiKey } = await req.json();
    
    // If a specific API key was provided in the request, use that instead
    if (geminiApiKey) {
      apiKey = geminiApiKey;
      console.log("Using API key provided in the request");
    }

    if (!apiKey) {
      throw new Error('No Gemini API key available. Please provide one in the request or set it as an environment variable.');
    }

    if (!content) {
      throw new Error('No resume content provided');
    }

    console.log('Analyzing resume content with Gemini API');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); // Updated to gemini-2.0-flash-lite

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

    IMPORTANT: Return ONLY the JSON object without any markdown formatting, code blocks, or additional text.

    Resume text to analyze:
    ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response received from Gemini API');
    
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = text;
    
    // If response contains markdown code blocks, extract just the JSON
    if (text.includes('```json')) {
      const jsonStartIndex = text.indexOf('{');
      const jsonEndIndex = text.lastIndexOf('}') + 1;
      
      if (jsonStartIndex !== -1 && jsonEndIndex > 0) {
        jsonText = text.substring(jsonStartIndex, jsonEndIndex);
        console.log('Extracted JSON from markdown code block');
      }
    }
    
    // Parse the clean JSON text
    let analysis;
    try {
      analysis = JSON.parse(jsonText);
      console.log('Analysis completed successfully');
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      console.log('Failed JSON text:', jsonText);
      throw new Error('Invalid JSON response from Gemini API');
    }
    
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
