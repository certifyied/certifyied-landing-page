import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Cristo Kayalakkam",
    role: "CEO – Dynamic Control System",
    image: "https://ui-avatars.com/api/?name=Cristo+Kayalakkam&size=100&background=random",
    content:
      "Partnering with this certified digital marketing and advertising company was a turning point for our brand. Their website optimization and advanced SEO control systems helped us achieve consistent growth and stronger online visibility. The team’s data-driven approach delivers measurable results. Highly recommended as the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi.",
    rating: 5,
  },
  {
    name: "Mishal Thambi",
    role: "CEO – Dosa King",
    image: "https://ui-avatars.com/api/?name=Mishal+Thambi&size=100&background=random",
    content:
      "What stood out most was their transparent and structured approach to website development and SEO strategy. Every step was clearly explained, and the execution aligned perfectly with our business goals at Dosa King. As a certified digital marketing company, their expertise is evident in performance, visibility, and measurable results. Highly recommended as the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi",
    rating: 5,
  },
  {
    name: "Base Mathew",
    role: "CEO – Hotel Periyar",
    image: "https://ui-avatars.com/api/?name=Base+Mathew&size=100&background=random",
    content:
      "We trusted this team with our hotel’s social media marketing, and the impact was remarkable. Engagement, reach, and brand visibility improved significantly. Their deep understanding of hospitality branding and digital platforms sets them apart. One of the most reliable partners we’ve worked with — truly the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi",
    rating: 5,
  },
  {
    name: "Madhu",
    role: "CEO – MaxFun",
    image: "https://ui-avatars.com/api/?name=Madhu&size=100&background=random",
    content:
      "For MaxFun, we needed creative and consistent social media management, and this certified company delivered beyond expectations. Their campaigns boosted our brand recall and customer interaction in a short time. A skilled, responsive, and result-focused digital marketing team — truly the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi.",
    rating: 5,
  },
  {
    name: "Dr. Sailee",
    role: "CEO – Dr. Sailee's Dental Clinic",
    image: "https://ui-avatars.com/api/?name=Dr+Sailee&size=100&background=random",
    content:
      "This certified company’s SEO strategies allowed our dental clinic to connect with the right audience and boost online visibility. Professional, ethical, and expert in healthcare marketing, their team delivered measurable results in website traffic and patient inquiries. Without a doubt, the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi.",
    rating: 5,
  },
  {
    name: "Harikumar",
    role: "CEO – EduPulse",
    image: "https://ui-avatars.com/api/?name=Harikumar&size=100&background=random",
    content:
      "Choosing this certified digital marketing and advertising company for Google ranking and SEO performance was the right decision. Our keyword positions improved steadily, and our overall digital presence became stronger. Their expertise, support, and consistency make them a trusted long-term partner — the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi.",
    rating: 5,
  },
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
            Loved by Businesses Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say
            about working with Certifyied.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border"
              variants={itemVariants}
              whileHover={{
                y: -8,
                borderColor: "hsl(var(--primary) / 0.3)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
