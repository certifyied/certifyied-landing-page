import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function BlogPost() {
    const [searchParams] = useSearchParams();
    const isSinglePost = searchParams.has("id") || searchParams.has("slug");

    useEffect(() => {
        const scriptId = 'certifyied-blog-embed-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/embed";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="min-h-screen bg-muted/40 pt-20 pb-20">
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
                <div 
                    id="certifyied-blog-post" 
                    data-project-id="895ecc14-ae41-4fe8-9f2d-51072a3c44c9"
                ></div>
            </div>
        </div>
    );
}
