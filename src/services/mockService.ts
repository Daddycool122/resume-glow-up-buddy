
import { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';

// This is a mock service that returns a sample response when we can't use the real Gemini API
export const generateMockAnalysis = (): ResumeAnalysisResult => {
  return {
    scores: {
      overall: 68,
      content: 72,
      formatting: 65,
      keywords: 58
    },
    summary: "Your resume demonstrates good professional experience and education, but needs improvements in formatting and keyword optimization. The content is generally good but could benefit from more quantifiable achievements and clearer organization.",
    strengths: [
      "Solid educational background with relevant qualifications",
      "Good amount of professional experience in the field",
      "Technical skills are clearly listed",
      "Contains relevant project experience"
    ],
    weaknesses: [
      "Lacks quantifiable achievements and metrics",
      "Resume formatting could be more consistent",
      "Missing important industry keywords",
      "Work experience descriptions are too general"
    ],
    sections: [
      {
        title: "Professional Summary",
        feedback: "Your summary is concise but lacks impact. It doesn't effectively highlight your unique value proposition.",
        improvements: [
          "Begin with a powerful statement about your professional identity",
          "Include 2-3 of your most impressive achievements with metrics",
          "Tailor your summary to match the specific job you're applying for",
          "Mention your years of experience and specialist areas"
        ]
      },
      {
        title: "Work Experience",
        feedback: "Your work experience section lists responsibilities but lacks specific achievements and impact metrics.",
        improvements: [
          "Add quantifiable achievements (%, $, numbers) to demonstrate impact",
          "Use strong action verbs at the beginning of each bullet point",
          "Focus on results and contributions, not just duties",
          "Tailor accomplishments to match job requirements"
        ]
      },
      {
        title: "Skills",
        feedback: "Your skills section is basic and doesn't categorize or prioritize skills effectively.",
        improvements: [
          "Group skills by category (technical, soft, industry-specific)",
          "Place most relevant skills for the target job first",
          "Remove outdated or irrelevant skills",
          "Add proficiency levels for technical skills where appropriate"
        ]
      },
      {
        title: "Education",
        feedback: "Your education section is adequate but could provide more relevant details.",
        improvements: [
          "Include relevant coursework or academic projects if recent graduate",
          "Add academic honors or high GPA if applicable",
          "List certifications with dates and issuing organizations",
          "Consider moving education after experience if you have substantial work history"
        ]
      }
    ],
    keywords: {
      matched: [
        "project management",
        "team leadership",
        "data analysis",
        "customer service",
        "problem solving"
      ],
      missing: [
        "agile methodology",
        "cross-functional",
        "performance optimization",
        "strategic planning",
        "KPIs",
        "ROI",
        "stakeholder management"
      ]
    },
    improvement_suggestions: "To significantly improve your resume, focus first on adding measurable achievements to your work experience. For example, instead of 'managed a team', specify 'led a team of 8 that increased productivity by 23% over 6 months'.\n\nRestructure your skills section into clear categories and prioritize those most relevant to your target roles. Make sure to incorporate missing keywords like 'agile methodology' and 'stakeholder management' where appropriate.\n\nYour professional summary needs to be more compelling and targeted. Start with a strong statement about your professional identity and include your most impressive metric-based achievements.\n\nImprove your formatting for better readability - use consistent bullet points, ensure even spacing, and create clear visual hierarchy. Make sure your name and contact information stand out at the top of the resume.\n\nFinally, tailor each submission to the specific job by carefully analyzing the job description and aligning your skills and achievements to the requirements. This customized approach significantly increases your chances of passing through applicant tracking systems."
  };
};
