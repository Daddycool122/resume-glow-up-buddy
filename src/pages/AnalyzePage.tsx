
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResumeUploader from '@/components/resume/ResumeUploader';
import AnalysisResult, { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';
import { extractTextFromPDF } from '@/services/pdfService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';

const AnalyzePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
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
      const resumeText = await extractTextFromPDF(selectedFile);
      
      // Call the Edge Function to analyze the resume
      const { data: { analysis }, error: functionError } = await supabase.functions.invoke('analyze-resume', {
        body: { content: resumeText }
      });

      if (functionError) throw functionError;

      // Store the analysis result in the database
      const { error: dbError } = await supabase
        .from('resume_analyses')
        .insert({
          user_id: user.id,
          filename: selectedFile.name,
          content: resumeText,
          analysis: analysis,
        });

      if (dbError) throw dbError;
      
      setAnalysisResult(analysis);
      
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
                <AnalysisResult result={analysisResult} />
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
