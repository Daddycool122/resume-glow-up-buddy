
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 bg-resume-primary text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Your Resume?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Get AI-powered recommendations and land more interviews. 
          It only takes a minute to upload your resume and get started.
        </p>
        <Link to="/analyze">
          <Button size="lg" className="bg-white text-resume-primary hover:bg-gray-100">
            Analyze My Resume <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
