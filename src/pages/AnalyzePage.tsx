
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResumeUploader from '@/components/resume/ResumeUploader';
import ApiKeyInput from '@/components/resume/ApiKeyInput';
import AnalysisResult, { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';
import { extractTextFromPDF } from '@/services/pdfService';
import GeminiService from '@/services/geminiService';
import { generateMockAnalysis } from '@/services/mockService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AnalyzePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini_api_key') || '');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(selectedFile);
      
      // Use mock data for demo purposes
      // In a real app, uncomment the code below to use actual Gemini API
      let result: ResumeAnalysisResult;
      
      if (import.meta.env.DEV) {
        // Use mock data in development mode
        result = generateMockAnalysis();
      } else {
        // Use real API in production mode
        const geminiService = new GeminiService({ apiKey });
        result = await geminiService.analyzeResume(resumeText);
      }
      
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been successfully analyzed.",
      });
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "An error occurred while analyzing your resume.");
      
      toast({
        title: "Analysis Failed",
        description: err.message || "An error occurred while analyzing your resume.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-resume-dark mb-6">Analyze Your Resume</h1>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-resume-dark">Upload Your Resume</h2>
                <ResumeUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              </div>
              
              <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
            </div>
            
            <div className="flex justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleAnalyze}
                disabled={isProcessing || !selectedFile || !apiKey}
                className="bg-resume-primary hover:bg-resume-accent"
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>
            
            {analysisResult && (
              <div className="mb-8">
                <AnalysisResult result={analysisResult} />
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-8">
              <h2 className="text-xl font-semibold mb-2 text-resume-dark">What happens next?</h2>
              <p className="text-gray-600 mb-4">
                After connecting Supabase, you'll be able to:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Create an account to save your analyses</li>
                <li>Compare multiple resume versions</li>
                <li>Store your API keys securely in the backend</li>
                <li>Access premium features and templates</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyzePage;
