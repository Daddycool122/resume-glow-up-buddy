
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-resume-dark">ResumeGlow</h3>
            <p className="text-gray-600 mb-4">
              AI-powered resume analysis to help you land your dream job.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-resume-dark">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-resume-primary">Home</Link>
              </li>
              <li>
                <Link to="/analyze" className="text-gray-600 hover:text-resume-primary">Analyze Resume</Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-600 hover:text-resume-primary">Sign In</Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-resume-dark">Connect</h3>
            <p className="text-gray-600">
              Questions or feedback? Reach out to us.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
          <p>© {year} ResumeGlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
