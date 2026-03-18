import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const BlogSection = () => {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const blogs = [
        {
            title: "Certifyied — Best Digital Marketing Company in India for Scalable Business Growth",
            desc: "In a world where customers search, compare, and decide online, having a strong digital presence is no longer optional—it’s essential. Businesses across India are competing for attention, and only those with the right strategy stand out. This is why choosing the Best Digital Marketing Company in India becomes a critical decision for growth.Certifyied is helping businesses navigate this competitive space with smart, result-oriented digital marketing solutions. By combining creativity, analytics, and market expertise, it empowers brands to grow faster and smarter.",
            date: "Feb 12, 2026",
        },
        {
            title: "The Need for Digital Marketing in Today’s Business Landscape",
            desc: "Consumers today rely heavily on online platforms to discover products and services. Whether it’s searching on Google, scrolling through social media, or reading reviews, every step of the customer journey happens digitally. The Best Digital Marketing Company in India understands this shift and builds strategies that connect businesses with their target audience at the right time. From improving search visibility to creating engaging content, digital marketing plays a key role in driving traffic and conversions.",
            date: "Jan 28, 2026",
        },
        {
            title: "What Makes a Digital Marketing Company the 'Best'?",
            desc: `Not all agencies deliver the same results. The best digital marketing companies stand out by focusing on performance, transparency, and long-term growth.

Here are some qualities that define a top digital marketing partner:

• Data-driven strategies focused on measurable outcomes  
• Customized campaigns tailored to business goals  
• Transparent reporting with clear performance metrics  
• Expertise across SEO, Google Ads, and social media  
• Continuous optimization to improve results over time  

Certifyied follows this approach to ensure every campaign delivers real value.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Services That Drive Results",
            desc: `A strong digital presence requires a combination of multiple strategies working together. The Best Digital Marketing Company in India offers a range of services designed to cover every aspect of online growth.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Search Engine Optimization (SEO)",
            desc: `SEO helps businesses rank higher on search engines, making it easier for customers to find them. From keyword optimization to technical improvements, SEO builds long-term visibility.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Pay-Per-Click Advertising (PPC)",
            desc: `PPC campaigns deliver instant traffic by targeting users actively searching for products or services. With the right strategy, businesses can generate high-quality leads and maximize ROI.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Social Media Marketing",
            desc: `Social platforms are powerful tools for brand building and customer engagement. A strong social media presence helps businesses connect with their audience and build trust.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Content Marketing",
            desc: `Quality content attracts, informs, and converts customers. Blogs, articles, and website content play a key role in establishing authority and driving organic traffic.
By combining these services, Certifyied ensures a comprehensive approach to digital growth.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Why Businesses Choose Certifyied",
            desc: `Choosing the right agency can make a significant difference in your business success. The Best Digital Marketing Company in India focuses not just on delivering services but on building long-term partnerships.


Businesses choose Certifyied because of its:
●	Result-oriented approach

●	Deep understanding of market trends

●	Focus on ROI and performance

●	Commitment to client success

●	Ability to adapt to changing digital landscapes

This combination of expertise and dedication helps businesses achieve consistent growth.`,
            date: "Jan 10, 2026",
        },
        {
            title: "The Power of Data-Driven Marketing",
            desc: `One of the key advantages of working with the Best Digital Marketing Company in India is the use of data to drive decisions. Every campaign is tracked, analyzed, and optimized to deliver better results.
From understanding customer behavior to improving conversion rates, data-driven marketing ensures that businesses make informed decisions and maximize their returns`,
            date: "Jan 10, 2026",
        },
        {
            title: "Future-Proof Your Business",
            desc: `The digital world is constantly evolving, and businesses need to adapt to stay competitive. The Best Digital Marketing Company in India helps brands stay ahead by adopting the latest tools, trends, and strategies.
With the right partner, businesses can not only keep up with changes but also turn them into opportunities for growth.`,
            date: "Jan 10, 2026",
        },
        {
            title: "Conclusion",
            desc: `Digital marketing is no longer just about being online—it’s about being visible, relevant, and impactful. Choosing the Best Digital Marketing Company in India can transform how your business connects with customers and drives growth.
With its strategic approach and commitment to results, Certifyied stands as a reliable partner for businesses looking to succeed in the digital space. If you’re ready to grow your brand, attract more customers, and increase your online presence, now is the time to invest in the right digital marketing strategy.`,
            date: "Jan 10, 2026",
        },
    ];

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

                {/* Blog Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={index}
                            className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedBlog(blog)} // 👈 IMPORTANT
                        >
                            <p className="text-sm text-muted-foreground mb-2">
                                {blog.date}
                            </p>

                            <h3 className="text-lg font-semibold mb-3">
                                {blog.title}
                            </h3>

                            {/* 👇 limit text */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {blog.desc}
                            </p>

                            <span className="text-primary font-medium">
                                Read More →
                            </span>
                        </motion.div>
                    ))}
                </div>
                <AnimatePresence>
                    {selectedBlog && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBlog(null)}
                        >
                            <motion.div
                                className="bg-white max-w-3xl w-full rounded-2xl p-6 md:p-8 shadow-lg overflow-y-auto max-h-[80vh]"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Title */}
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
                                    {selectedBlog.title}
                                </h2>

                                {/* Date */}
                                <p className="text-sm md:text-base text-muted-foreground mb-4">
                                    {selectedBlog.date}
                                </p>

                                {/* Content */}
                                <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {selectedBlog.desc}
                                </p>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedBlog(null)}
                                    className="mt-6 text-primary font-semibold text-base"
                                >
                                    Close
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default BlogSection;