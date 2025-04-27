
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResumeAnalysisResult } from './AnalysisResult';
import ResumeDashboard from './ResumeDashboard';

interface DashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ResumeAnalysisResult | null;
  filename?: string;
}

const DashboardDialog: React.FC<DashboardDialogProps> = ({ 
  open, 
  onOpenChange, 
  result,
  filename
}) => {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Resume Analytics Dashboard</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ResumeDashboard result={result} filename={filename} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
