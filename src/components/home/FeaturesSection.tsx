
import React from 'react';
import { FileSearch, Bot, LineChart, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: <FileSearch className="h-8 w-8" />,
    title: "Resume Scanning",
    description: "Upload your resume and our system will scan it for content, structure, and formatting."
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI Analysis",
    description: "Gemini AI analyzes your resume against industry standards and job market requirements."
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Performance Score",
    description: "Get a comprehensive score with detailed feedback on how your resume stacks up."
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Improvement Tips",
    description: "Receive actionable recommendations on how to improve your resume's impact."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-resume-dark mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered resume analyzer provides comprehensive feedback to help you land more interviews.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="text-resume-primary mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-resume-dark mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
