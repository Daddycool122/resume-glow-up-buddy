
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';

const SavedAnalysesPage: React.FC = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedAnalyses = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view saved analyses.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('resume_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setSavedAnalyses(data || []);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching saved analyses:", error);
        toast({
          title: "Error",
          description: "Failed to load saved analyses.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSavedAnalyses();
  }, []);

  const handleViewAnalysis = (analysis: any) => {
    // You might want to pass the entire analysis object to a detailed view
    console.log("View analysis:", analysis);
    // Potential future enhancement: open a modal or navigate to a detailed view
  };

  if (isLoading) {
    return <div>Loading saved analyses...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Saved Resume Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {savedAnalyses.length === 0 ? (
            <p className="text-center text-gray-500">No saved analyses found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Saved At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedAnalyses.map((analysis) => {
                  const parsedAnalysis = analysis.analysis as ResumeAnalysisResult;
                  return (
                    <TableRow key={analysis.id}>
                      <TableCell>{analysis.filename}</TableCell>
                      <TableCell>{parsedAnalysis.scores.overall}/100</TableCell>
                      <TableCell>
                        {formatDistance(new Date(analysis.created_at), new Date(), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewAnalysis(analysis)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedAnalysesPage;
