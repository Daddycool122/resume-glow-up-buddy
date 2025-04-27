import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Save, Share2, ChartBar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import DashboardDialog from './DashboardDialog';

interface ResumeAnalysisScore {
  overall: number;
  content: number;
  formatting: number;
  keywords: number;
}

interface ResumeAnalysisSection {
  title: string;
  feedback: string;
  improvements: string[];
}

export interface ResumeAnalysisResult {
  scores: ResumeAnalysisScore;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  sections: ResumeAnalysisSection[];
  keywords: {
    matched: string[];
    missing: string[];
  };
  improvement_suggestions: string;
}

interface AnalysisResultProps {
  result: ResumeAnalysisResult;
  filename?: string;
  content?: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, filename, content }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const fileContent = JSON.stringify(result, null, 2);
    const file = new Blob([fileContent], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `resume_analysis_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Analysis Downloaded",
      description: "Your resume analysis has been saved as JSON.",
    });
  };
  
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2))
        .then(() => {
          toast({
            title: "Analysis Copied!",
            description: "The analysis has been copied to your clipboard.",
          });
        })
        .catch(err => {
          toast({
            title: "Failed to copy",
            description: "Could not copy to clipboard: " + err,
            variant: "destructive"
          });
        });
    }
  };

  const handleSaveAnalysis = async () => {
    try {
      setIsSaving(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save resume analyses.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      if (!filename || !content) {
        toast({
          title: "Missing data",
          description: "Filename or content is missing. Cannot save the analysis.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      const analysisJson = JSON.parse(JSON.stringify(result)) as Json;
      
      const { error: dbError } = await supabase
        .from('resume_analyses')
        .insert({
          user_id: user.id,
          filename: filename,
          content: content,
          analysis: analysisJson,
        });

      if (dbError) {
        throw dbError;
      }
      
      toast({
        title: "Analysis Saved",
        description: "Your resume analysis has been saved to your account.",
      });
    } catch (error: any) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Failed to save",
        description: error.message || "An error occurred while saving the analysis.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          Resume Analysis
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          AI-generated analysis of your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Overall Score</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getScoreColor(result.scores.overall)}`}>
                  {result.scores.overall}/100
                </div>
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-sm text-gray-600">Content</div>
                    <div className={`font-bold ${result.scores.content >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {result.scores.content}/100
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-sm text-gray-600">Format</div>
                    <div className={`font-bold ${result.scores.formatting >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {result.scores.formatting}/100
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-sm text-gray-600">Keywords</div>
                    <div className={`font-bold ${result.scores.keywords >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {result.scores.keywords}/100
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p className="text-gray-700">{result.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-green-700">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-orange-700">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700">{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sections" className="pt-4">
            <ScrollArea className="h-[400px] pr-4">
              {result.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                  <p className="text-gray-700 mb-3">{section.feedback}</p>
                  
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Suggested Improvements</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {section.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-gray-700">{improvement}</li>
                    ))}
                  </ul>
                  
                  {index < result.sections.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="keywords" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.matched.length > 0 ? (
                    result.keywords.matched.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No matching keywords found</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Recommended Keywords to Add</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.missing.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="border-orange-200 text-orange-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="improvements" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Recommended Improvements</h3>
              <div className="p-4 bg-resume-primary/5 border border-resume-primary/20 rounded-lg">
                <p className="whitespace-pre-line text-gray-700">
                  {result.improvement_suggestions}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          Powered by Gemini AI
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setDashboardOpen(true)}
            className="bg-resume-primary/10 hover:bg-resume-primary/20 text-resume-primary"
          >
            <ChartBar className="h-4 w-4 mr-1" />
            Create Dashboard
          </Button>
          <Button 
            className="bg-resume-primary hover:bg-resume-accent"
            onClick={handleSaveAnalysis}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save Analysis'}
          </Button>
        </div>
      </CardFooter>

      <DashboardDialog 
        open={dashboardOpen}
        onOpenChange={setDashboardOpen}
        result={result}
        filename={filename}
      />
    </Card>
  );
};

export default AnalysisResult;
