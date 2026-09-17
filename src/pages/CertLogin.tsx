import { useState } from "react";
import { FileEdit, Star, PhoneCall, ArrowLeft } from "lucide-react";
import anotherCertifyiedLogo from "@/assets/another_certifyied_logo.png";

export default function CertLogin() {
  const isDev = import.meta.env.DEV;

  // Blog Admin URL resolver
  const blogUrl = import.meta.env.VITE_BLOG_API_URL || "https://bloggfeature.certifyied.workers.dev/adminApiBlog";

  // Reviews Portal URL resolver (reviewdash) - self-healing dynamic fallback
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const rawReviewsUrl = import.meta.env.VITE_REVIEWS_URL || '';
  const reviewsUrl = (rawReviewsUrl && !rawReviewsUrl.includes('localhost:8787') && rawReviewsUrl !== 'http://localhost:8787/')
    ? rawReviewsUrl
    : (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1'))
      ? 'http://localhost:5180/reviewdash/certlogin'
      : `${currentOrigin}/reviewdash/certlogin`;

  const [activeTab, setActiveTab] = useState<"blog" | "reviews">("reviews");

  // Construct iframe URLs with parent origin parameter to avoid cross-origin image resolution issues
  const parentOrigin = currentOrigin;
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
      <header className="w-full bg-[#0d1117]/95 backdrop-blur-xl border-b border-white/[0.08] py-2.5 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3 z-10 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2.5">
          <a href="/" className="flex items-center focus:outline-none group">
            <img
              src={anotherCertifyiedLogo}
              alt="Certifyied Logo"
              className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </a>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
            Portals
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-[#161b22] p-1 rounded-2xl border border-white/[0.08] shadow-inner gap-1">
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none ${
              activeTab === "blog"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50 font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <FileEdit className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${activeTab === 'blog' ? 'scale-105 text-white' : 'text-emerald-400'}`} />
            <span>Blog Admin</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none ${
              activeTab === "reviews"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50 font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${activeTab === 'reviews' ? 'scale-105 text-amber-300 fill-amber-300' : 'text-amber-400'}`} />
            <span>Customer Reviews</span>
          </button>

          <a
            href="/autodailer"
            className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200 flex items-center gap-2 group focus:outline-none"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 group-hover:scale-105 transition-transform duration-200" />
            <span>Sales Autodialer</span>
          </a>
        </div>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-200 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
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
