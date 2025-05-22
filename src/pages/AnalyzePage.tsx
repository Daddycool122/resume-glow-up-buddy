
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResumeUploader from '@/components/resume/ResumeUploader';
import AnalysisResult, { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';
import { extractTextFromPDF } from '@/services/pdfService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';
import { generateMockAnalysis } from '@/services/mockService';
import ApiKeyInput from '@/components/resume/ApiKeyInput';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AnalyzePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setResumeText('');
    setError(null);
  };

  const handleApiKeySubmit = (apiKey: string) => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowApiSettings(false);
    toast({
      title: "API Key Updated",
      description: "Your Gemini API key has been saved.",
    });
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

    setIsProcessing(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to analyze resumes.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Extract text from PDF
      const text = await extractTextFromPDF(selectedFile);
      setResumeText(text);
      
      // Get the API key from localStorage
      const geminiApiKey = localStorage.getItem('gemini_api_key');
      
      if (!geminiApiKey) {
        setShowApiSettings(true);
        throw new Error("Gemini API key is required. Please set your API key in settings.");
      }
      
      // Call the Edge Function to analyze the resume, passing the API key
      const { data, error: functionError } = await supabase.functions.invoke('analyze-resume', {
        body: { 
          content: text,
          geminiApiKey // Pass the API key to the edge function
        }
      });

      if (functionError) throw functionError;
      
      if (!data || !data.analysis) {
        console.error("Invalid response format:", data);
        throw new Error("Failed to get valid analysis from the server. Using mock data instead.");
      }

      const analysis = data.analysis;
      setAnalysisResult(analysis);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been successfully analyzed.",
      });
    } catch (err: any) {
      console.error("Analysis error:", err);
      
      // Use mock data if there's an error with the API
      const mockAnalysis = generateMockAnalysis();
      setAnalysisResult(mockAnalysis);
      
      setError(err.message || "An error occurred while analyzing your resume. Using mock data instead.");
      
      toast({
        title: "Analysis Failed",
        description: "Using mock data for demonstration purposes.",
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-resume-dark">Analyze Your Resume</h1>
              <Popover open={showApiSettings} onOpenChange={setShowApiSettings}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">API Settings</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
                </PopoverContent>
              </Popover>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-resume-dark">Upload Your Resume</h2>
              <ResumeUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            </div>
            
            <div className="flex justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleAnalyze}
                disabled={isProcessing || !selectedFile}
                className="bg-resume-primary hover:bg-resume-accent"
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>
            
            {analysisResult && (
              <div className="mb-8">
                <AnalysisResult 
                  result={analysisResult} 
                  filename={selectedFile?.name}
                  content={resumeText}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyzePage;
