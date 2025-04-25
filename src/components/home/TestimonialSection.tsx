
import React from 'react';

const testimonials = [
  {
    quote: "The AI recommendations helped me completely transform my resume. I got three interview calls within a week of updating it!",
    author: "Alex Johnson",
    role: "Software Engineer"
  },
  {
    quote: "I couldn't figure out why I wasn't getting callbacks. ResumeGlow identified key missing elements in my experience section that made all the difference.",
    author: "Sarah Thompson",
    role: "Marketing Specialist"
  },
  {
    quote: "As someone changing careers, I had no idea how to position my transferable skills. The AI analysis gave me exactly the guidance I needed.",
    author: "Michael Rodriguez",
    role: "Career Changer"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-resume-dark mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thousands of job seekers have improved their resumes with our AI-powered analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-6">
                <svg className="h-8 w-8 text-resume-secondary/40" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
              <div>
                <p className="font-medium text-resume-dark">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
