
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-white to-purple-50 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-resume-dark mb-6">
              Elevate Your Resume with <span className="text-resume-primary">AI-Powered</span> Analysis
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get personalized recommendations to improve your resume and stand out to recruiters. 
              Our AI analyzes your resume and provides actionable feedback in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/analyze">
                <Button size="lg" className="bg-resume-primary hover:bg-resume-accent">
                  Analyze My Resume <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-resume-secondary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-resume-primary/20 rounded-full blur-xl"></div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 relative z-10">
                <div className="mb-4 p-3 bg-resume-primary/10 rounded-lg text-resume-primary font-medium">
                  Resume Analysis
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-4/5"></div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
