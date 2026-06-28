import { useState } from "react";

export default function CertLogin() {
  const isDev = import.meta.env.DEV;
  
  // Blog Admin URL resolver
  const blogUrl = import.meta.env.VITE_BLOG_API_URL || "https://bloggfeature.certifyied.workers.dev/adminApiBlog";

  // Reviews Portal URL resolver (reviewdash)
  const reviewsUrl = import.meta.env.VITE_REVIEWS_URL || (isDev ? "http://localhost:5180/" : "/reviewdash/");

  const [activeTab, setActiveTab] = useState<"blog" | "reviews">("blog");

  // Construct iframe URLs with parent origin parameter to avoid cross-origin image resolution issues
  const parentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const magicToken = params.get('magic_token');

  let resolvedBlogUrl = `${blogUrl}${blogUrl.includes('?') ? '&' : '?'}parent_origin=${encodeURIComponent(parentOrigin)}`;
  let resolvedReviewsUrl = `${reviewsUrl}${reviewsUrl.includes('?') ? '&' : '?'}parent_origin=${encodeURIComponent(parentOrigin)}`;

  if (magicToken) {
    resolvedBlogUrl += `&magic_token=${encodeURIComponent(magicToken)}`;
    resolvedReviewsUrl += `&magic_token=${encodeURIComponent(magicToken)}`;
  }

  return (
    <div className="w-full h-screen bg-[#0b0f19] overflow-hidden flex flex-col font-sans text-white">
      {/* Header and Tab Navigation */}
      <header className="w-full bg-[#111827] border-b border-[#1f2937] py-3 px-6 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="flex items-center gap-2">
          <span className="text-[#f9fafb] font-bold text-lg tracking-wide">
            Certifyied <span className="text-[#467222]">Portals</span>
          </span>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex bg-[#0b0f19] p-1 rounded-lg border border-[#1f2937]">
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === "blog"
                ? "bg-[#467222] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ✍️ Blog Admin
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === "reviews"
                ? "bg-[#467222] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ⭐ Customer Reviews
          </button>
        </div>

        <a 
          href="/" 
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
        >
          ← Back to Website
        </a>
      </header>
      
      {/* Portals Iframe Container */}
      <div className="flex-1 w-full h-full relative bg-[#0b0f19]">
        {activeTab === "blog" ? (
          <iframe
            src={resolvedBlogUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="Admin Blog Dashboard"
            allow="clipboard-read; clipboard-write; geolocation"
          />
        ) : (
          <iframe
            src={resolvedReviewsUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="Reviews Management Dashboard"
            allow="clipboard-read; clipboard-write; geolocation"
          />
        )}
      </div>
    </div>
  );
}
