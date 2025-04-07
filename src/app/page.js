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
    if (!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
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

  const latestTools = tools.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-dark text-white py-20 px-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">AI Tools Overzicht</h1>
          <p className="text-xl mb-8">Ontdek en verken de laatste AI tools en technologieën</p>
        </div>
      </div>

      <main className="container mx-auto px-8 py-12">
        {/* Latest Additions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Laatste toevoegingen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestTools.map((tool, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{tool.tool}</h3>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium mb-3 block"
                  >
                    Bezoek website
                  </a>
                  <p className="text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.subject.split(',').map((subject, idx) => (
                      <span 
                        key={idx} 
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
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
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Filter Tools</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Alle Beoordelingen</option>
              <option value="5">5 Sterren</option>
              <option value="4">4 Sterren</option>
              <option value="3">3 Sterren</option>
              <option value="2">2 Sterren</option>
              <option value="1">1 Ster</option>
            </select>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{tool.tool}</h2>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium mb-3 block"
                >
                  Visit Website
                </a>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.subject.split(',').map((subject, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {subject.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Added by: {tool.addedBy}</span>
                  <span className="text-sm text-gray-500">{tool.date}</span>
                </div>
                {tool.rating && (
                  <div className="mt-3">
                    <span className="text-yellow-500">
                      {'★'.repeat(tool.rating)}{'☆'.repeat(5 - tool.rating)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
