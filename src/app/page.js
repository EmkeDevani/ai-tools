'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [tools, setTools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Function to parse dd-mm-yyyy date format
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0); // Return earliest possible date if no date
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        // Sort tools by date in descending order using the parseDate function
        const sortedTools = data.tools.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        setTools(sortedTools);
        setSubjects(data.subjects);
        setFilteredTools(sortedTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchTools();
  }, []);

  useEffect(() => {
    let filtered = [...tools];
    
    if (subjectFilter) {
      filtered = filtered.filter(tool => {
        const toolSubjects = tool.subject.split(',').map(s => s.trim());
        return toolSubjects.includes(subjectFilter);
      });
    }
    
    if (ratingFilter) {
      filtered = filtered.filter(tool => 
        tool.rating === ratingFilter
      );
    }
    
    setFilteredTools(filtered);
  }, [subjectFilter, ratingFilter, tools]);

  // Get the 3 most recent tools
  const latestTools = tools.slice(0, 3);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-top justify-items-center min-h-screen p-8 pb-20 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">     

        <h1 className="text-4xl font-bold mb-8">AI Tools Overview</h1>

        {/* Latest Additions Section */}
        <div className="w-full mb-12">
          <h2 className="text-2xl font-semibold mb-4">Latest Additions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestTools.map((tool, index) => (
              <div key={index} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{tool.tool}</h3>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mb-2 block"
                >
                  Visit Website
                </a>
                <p className="text-gray-600 mb-2 line-clamp-2">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tool.subject.split(',').map((subject, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                      {subject.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Added: {tool.date}</span>
                  {tool.rating && (
                    <span className="text-yellow-500">
                      {'★'.repeat(tool.rating)}{'☆'.repeat(5 - tool.rating)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8 flex gap-4">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Alle onderwerpen</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Alle beoordelingen</option>
            <option value="5">5 Sterren</option>
            <option value="4">4 Sterren</option>
            <option value="3">3 Sterren</option>
            <option value="2">2 Sterren</option>
            <option value="1">1 Ster</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <div key={index} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{tool.tool}</h2>
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mb-2 block"
              >
                Visit Website
              </a>
              <p className="text-gray-600 mb-2">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {tool.subject.split(',').map((subject, idx) => (
                  <span 
                    key={idx} 
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                  >
                    {subject.trim()}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Added by: {tool.addedBy}</span>
                <span className="text-sm text-gray-500">Date: {tool.date}</span>
              </div>
              {tool.rating && (
                <div className="mt-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(tool.rating)}{'☆'.repeat(5 - tool.rating)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
