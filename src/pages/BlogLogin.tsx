import React from "react";

export default function BlogLogin() {
  const isDev = import.meta.env.DEV;
  const apiUrl = isDev 
    ? "http://localhost:8787/adminApiBlog" 
    : (import.meta.env.VITE_BLOG_API_URL || "https://bloggfeature.certifyied.workers.dev/adminApiBlog");

  return (
    <div className="w-full h-screen bg-[#0b0f19] overflow-hidden flex flex-col">
      {/* Back to Home Navigation Bar */}
      <div className="w-full bg-[#111827] border-b border-[#1f2937] py-3 px-6 flex justify-between items-center z-10">
        <span className="text-[#f9fafb] font-semibold tracking-wide">Certifyied Admin Portal</span>
        <a 
          href="/" 
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
        >
          ← Back to Website
        </a>
      </div>
      
      {/* Dashboard Iframe */}
      <div className="flex-1 w-full h-full relative">
        <iframe
          src={apiUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Admin Blog Dashboard"
          allow="clipboard-read; clipboard-write; geolocation"
        />
      </div>
    </div>
  );
}
