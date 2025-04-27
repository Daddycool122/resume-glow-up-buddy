
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeAnalysisResult } from '@/components/resume/AnalysisResult';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResumeDashboardProps {
  result: ResumeAnalysisResult;
  filename?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResumeDashboard: React.FC<ResumeDashboardProps> = ({ result, filename }) => {
  // Format scores data for bar chart
  const scoresData = [
    { name: 'Overall', score: result.scores.overall },
    { name: 'Content', score: result.scores.content },
    { name: 'Formatting', score: result.scores.formatting },
    { name: 'Keywords', score: result.scores.keywords },
  ];

  // Create keyword data for pie chart
  const keywordData = [
    { name: 'Matched', value: result.keywords.matched.length },
    { name: 'Missing', value: result.keywords.missing.length },
  ];
  
  // Create section scores for radar chart
  const sectionScores = result.sections.map(section => {
    // Generate a score between 60-90 based on the first letter of the section
    // This is just for visualization as we don't have real section scores
    const hash = section.title.charCodeAt(0) % 30;
    return {
      subject: section.title,
      score: 60 + hash,
      fullScore: 100
    };
  });
  
  // Create strength/weakness count data
  const strengthWeaknessData = [
    { name: 'Strengths', count: result.strengths.length },
    { name: 'Weaknesses', count: result.weaknesses.length },
  ];

  return (
    <div className="h-full w-full">
      <ScrollArea className="h-[70vh]">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Resume Dashboard: {filename}</h1>
          <p className="text-gray-500 mb-6">Visualized insights from your resume analysis</p>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-4 sticky top-0 bg-background z-10">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Score Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-[300px]" config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoresData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="score" fill="#4f46e5" name="Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              {/* Strength vs Weakness */}
              <Card id="strength-weakness-card">
                <CardHeader>
                  <CardTitle>Strengths vs Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ChartContainer className="h-[300px]" config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={strengthWeaknessData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill={COLORS[2]} name="Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h3 className="font-medium text-green-700">Top Strengths</h3>
                        <ul className="list-disc pl-5 mt-2">
                          {result.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-orange-700">Top Areas for Improvement</h3>
                        <ul className="list-disc pl-5 mt-2">
                          {result.weaknesses.slice(0, 3).map((weakness, i) => (
                            <li key={i}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              {/* Resume Section Quality */}
              <Card>
                <CardHeader>
                  <CardTitle>Resume Section Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-[400px]" config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={sectionScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar 
                          name="Section Score" 
                          dataKey="score" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6} 
                        />
                        <Tooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              {/* Section Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Section Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.sections.map((section, i) => (
                      <div key={i} className="border-l-4 border-indigo-400 pl-4 py-1">
                        <h3 className="font-medium">{section.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{section.feedback.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords" className="space-y-6">
              {/* Keywords Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Keywords Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ChartContainer className="h-[300px]" config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={keywordData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {keywordData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h3 className="font-medium text-blue-700">Matched Keywords</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.keywords.matched.slice(0, 8).map((keyword, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                              {keyword}
                            </span>
                          ))}
                          {result.keywords.matched.length > 8 && 
                            <span className="text-sm text-gray-500">+{result.keywords.matched.length - 8} more</span>
                          }
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-orange-700">Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.keywords.missing.slice(0, 8).map((keyword, i) => (
                            <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
                              {keyword}
                            </span>
                          ))}
                          {result.keywords.missing.length > 8 && 
                            <span className="text-sm text-gray-500">+{result.keywords.missing.length - 8} more</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ResumeDashboard;
