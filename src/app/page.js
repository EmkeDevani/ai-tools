'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Tool from '../components/Tool';

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
              <Tool key={index} tool={tool} />
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
            <Tool key={index} tool={tool} />
          ))}
        </div>

        <div className="pt-8">
          <a 
            href="https://docs.google.com/spreadsheets/d/1ePvAJldz0LboCtMLtBsrgWPCb4cPb5qaPY8l_OXYxSM/edit?gid=0#gid=0" 
            className="text-white hover:underline mb-2 inline-block bg-green-dark px-8 py-3 rounded-lg" 
            target="_blank" 
            rel="noopener noreferrer"
          >Tool toevoegen</a>
        </div>
        
      </main>
      <footer className="bg-green-dark text-white py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Devani. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
}
