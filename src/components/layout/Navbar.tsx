
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileSearch, UserRound } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 py-4 px-6 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FileSearch size={28} className="text-resume-primary" />
          <span className="text-xl font-bold text-resume-dark">ResumeGlow</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/analyze">
            <Button variant="outline">Analyze Resume</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-resume-primary hover:bg-resume-accent">
              <UserRound className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
