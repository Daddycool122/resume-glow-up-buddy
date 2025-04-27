
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResumeAnalysisResult } from './AnalysisResult';
import ResumeDashboard from './ResumeDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'sm:max-w-[90vw]'} max-h-[90vh] overflow-y-auto flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Resume Analytics Dashboard</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ResumeDashboard result={result} filename={filename} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
