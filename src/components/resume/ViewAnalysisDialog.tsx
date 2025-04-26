
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ResumeAnalysisResult } from './AnalysisResult';
import AnalysisResult from './AnalysisResult';

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
  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resume Analysis: {analysis.filename}</DialogTitle>
          <DialogDescription>
            Analyzed on {new Date(analysis.created_at).toLocaleString()}
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
  );
};

export default ViewAnalysisDialog;
