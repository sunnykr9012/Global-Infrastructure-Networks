"use client";

import { Network, Cloud, Globe, Navigation } from 'lucide-react';

export default function Legend() {
  return (
    <div className="absolute bottom-8 left-8 bg-black/70 p-4 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-4">Global Infrastructure Networks</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
          <Network className="w-5 h-5" />
          <span>Energy Grids</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
          <Cloud className="w-5 h-5" />
          <span>Cloud Computing</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          <Globe className="w-5 h-5" />
          <span>Internet Infrastructure</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-yellow-400 rounded-full" />
          <Navigation className="w-5 h-5" />
          <span>GNSS Satellites</span>
        </div>
      </div>
    </div>
  );
}