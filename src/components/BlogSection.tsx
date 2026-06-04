import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const BlogSection = () => {
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
        <section id="blog" className="py-20 bg-muted/40">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">Our Blog</h2>
                    <p className="text-muted-foreground mt-3">
                        Insights, updates, and expert tips
                    </p>
                </motion.div>

                {/* Container where the 3x3 blog grid will load */}
                <div 
                    id="certifyied-blog-container" 
                    data-project-id="895ecc14-ae41-4fe8-9f2d-51072a3c44c9" 
                    data-limit="3" 
                    data-redirect-url="/blog"
                ></div>

                <div className="text-center mt-12">
                    <Link to="/blog" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                        View All Blogs
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;