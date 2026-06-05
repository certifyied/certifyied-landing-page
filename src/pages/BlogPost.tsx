import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPost() {
    const [searchParams] = useSearchParams();
    const isSinglePost = searchParams.has("id");

    useEffect(() => {
        // 1. Remove old script if exists to prevent duplicates on route changes
        const scriptId = 'certifyied-blog-embed-script';
        const oldScript = document.getElementById(scriptId);
        if (oldScript) oldScript.remove();
        
        // 2. Inject the CDN script
        const script = document.createElement("script");
        script.id = scriptId;
        // Using the custom color param as well
        script.src = "https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/embed?color=10b981";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            const existing = document.getElementById(scriptId);
            if (existing) existing.remove();
        };
    }, [isSinglePost]); // Re-run when switching between single post and grid view

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <div className="flex-grow bg-muted/40 pt-28 pb-20">
                <div className="container mx-auto px-4">
                    {/* Back button */}
                    <div className="mb-8">
                        {isSinglePost ? (
                            <a href="/blog" className="text-primary hover:underline font-medium">
                                ← Back to Blogs
                            </a>
                        ) : (
                            <a href="/" className="text-primary hover:underline font-medium">
                                ← Back to Home
                            </a>
                        )}
                    </div>
                    
                    {/* Container where the single blog post or blog list will load */}
                    {isSinglePost ? (
                        <div 
                            id="certifyied-blog-post" 
                            data-project-id="670e2135-e070-4b9c-b284-5778e361077e"
                        ></div>
                    ) : (
                        <div 
                            id="certifyied-blog-container" 
                            data-project-id="670e2135-e070-4b9c-b284-5778e361077e"
                            data-limit="9"
                            data-redirect-url="/blog"
                        ></div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
