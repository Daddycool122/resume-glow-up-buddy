
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';
import { Eye, Trash2, ChartBar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import ViewAnalysisDialog from '@/components/resume/ViewAnalysisDialog';
import DashboardDialog from '@/components/resume/DashboardDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SavedAnalysesPage: React.FC = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const confirmDelete = (id: string) => {
    setAnalysisToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!analysisToDelete) return;
    
    setIsDeleting(true);
    
    try {
      console.log("Attempting to delete analysis with ID:", analysisToDelete);
      
      const { error, data } = await supabase
        .from('resume_analyses')
        .delete()
        .eq('id', analysisToDelete)
        .select();

      console.log("Delete response:", { error, data });
      
      if (error) {
        console.error("Supabase deletion error:", error);
        throw error;
      }
      
      console.log("Successfully deleted from database");
      
      setSavedAnalyses(prevAnalyses => prevAnalyses.filter(analysis => analysis.id !== analysisToDelete));
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
      
      toast({
        title: "Analysis Deleted",
        description: "The analysis has been successfully removed from the database.",
      });
    } catch (error: any) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error",
        description: "Failed to delete the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

      console.log("Fetching analyses for user:", user.id);
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Fetched analyses:", data?.length || 0);
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

  useEffect(() => {
    fetchSavedAnalyses();
  }, []);

  const handleViewAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setDialogOpen(true);
  };

  const handleViewDashboard = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setDashboardOpen(true);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div>Loading saved analyses...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
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
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewAnalysis(analysis)}
                            >
                              <Eye className="mr-1 h-4 w-4" /> View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDashboard(analysis)}
                              className="bg-resume-primary/10 hover:bg-resume-primary/20 text-resume-primary"
                            >
                              <ChartBar className="mr-1 h-4 w-4" /> Dashboard
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => confirmDelete(analysis.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isDeleting}
                            >
                              <Trash2 className="mr-1 h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <ViewAnalysisDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          analysis={selectedAnalysis}
        />

        <DashboardDialog 
          open={dashboardOpen}
          onOpenChange={setDashboardOpen}
          result={selectedAnalysis?.analysis}
          filename={selectedAnalysis?.filename}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your saved analysis from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setAnalysisToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default SavedAnalysesPage;
