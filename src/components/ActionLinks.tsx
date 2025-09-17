import React from 'react';

export function ActionLinks() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="https://www.instagram.com/YOUR_INSTAGRAM/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Follow for Updates
      </a>
    </div>
  );
}