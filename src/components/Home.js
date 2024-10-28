import React, { useState } from 'react';
import Header from './Header';
import CourseCards from './CourseCards';
import Footer from './Footer';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <Header />

      {/* Search and Filter Section */}
      <div className="my-12 p-8 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-2/3 lg:w-1/2 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600"
          />
          <button className="mt-4 md:mt-0 ml-0 md:ml-4 px-6 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition">
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <select className="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600">
            <option>Category</option>
            <option>Web Dev</option>
            <option>DevOps</option>
            <option>Frontend</option>
            <option>Backend</option>
          </select>
          <select className="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600">
            <option>Platform</option>
            {/* Add platform options here */}
          </select>
          <select className="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600">
            <option>Price</option>
            {/* Add price options here */}
          </select>
          <select className="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600">
            <option>Rating</option>
            {/* Add rating options here */}
          </select>
          <select className="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600">
            <option>Duration</option>
            {/* Add duration options here */}
          </select>
          <select className="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600">
            <option>Language</option>
            {/* Add language options here */}
          </select>
        </div>
      </div>

      {/* Course Cards */}
      <CourseCards searchTerm={searchTerm} />
      <Footer />
    </div>

  );
};

export default Home;
