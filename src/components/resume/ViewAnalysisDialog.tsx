
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ResumeAnalysisResult } from './AnalysisResult';
import AnalysisResult from './AnalysisResult';
import DashboardDialog from './DashboardDialog';
import { Button } from '@/components/ui/button';
import { ChartBar } from 'lucide-react';

interface ViewAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: {
    id: string;
    filename: string;
    content: string;
    analysis: ResumeAnalysisResult;
    created_at: string;
  } | null;
}

const ViewAnalysisDialog: React.FC<ViewAnalysisDialogProps> = ({ 
  open, 
  onOpenChange, 
  analysis 
}) => {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  
  if (!analysis) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Resume Analysis: {analysis.filename}</DialogTitle>
            <DialogDescription className="flex justify-between items-center">
              <span>Analyzed on {new Date(analysis.created_at).toLocaleString()}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDashboardOpen(true)}
                className="bg-resume-primary/10 hover:bg-resume-primary/20 text-resume-primary"
              >
                <ChartBar className="h-4 w-4 mr-1" />
                View Dashboard
              </Button>
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-auto py-4">
            <AnalysisResult 
              result={analysis.analysis} 
              filename={analysis.filename}
              content={analysis.content}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DashboardDialog 
        open={dashboardOpen}
        onOpenChange={setDashboardOpen}
        result={analysis?.analysis}
        filename={analysis?.filename}
      />
    </>
  );
};

export default ViewAnalysisDialog;
