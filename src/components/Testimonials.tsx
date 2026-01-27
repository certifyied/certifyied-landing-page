import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Cristo Kayalakkam",
    role: "CEO – Dynamic Control System",
    image: "https://ui-avatars.com/api/?name=Cristo+Kayalakkam&size=100&background=random",
    content:
      "Partnering with this certified digital marketing and advertising company was a turning point for our brand. Their website optimization and SEO dynamic control system helped us achieve consistent growth and better online visibility. The team understands data-driven strategies and delivers measurable results. Highly recommended for scalable digital success.",
    rating: 5,
  },
  {
    name: "Mishal Thambi",
    role: "CEO – Dosa King",
    image: "https://ui-avatars.com/api/?name=Mishal+Thambi&size=100&background=random",
    content:
      "What stood out most was their transparent and structured approach to website development and SEO strategy. Every step was clearly explained, and the execution aligned perfectly with our business goals at Dosa King. As a certified digital marketing agency, their expertise clearly reflects in performance, visibility, and results. A truly professional and reliable experience.",
    rating: 5,
  },
  {
    name: "Base Mathew",
    role: "CEO – Hotel Periyar",
    image: "https://ui-avatars.com/api/?name=Base+Mathew&size=100&background=random",
    content:
      "We trusted this team with our hotel's social media marketing, and the impact was remarkable. Engagement, reach, and brand visibility improved significantly. They understand hospitality branding and digital platforms deeply. One of the most reliable digital marketing and advertising companies we've worked with.",
    rating: 5,
  },
  {
    name: "Madhu",
    role: "CEO – MaxFun",
    image: "https://ui-avatars.com/api/?name=Madhu&size=100&background=random",
    content:
      "For MaxFun, we needed creative and consistent social media management, and this certified agency delivered beyond expectations. Their campaigns improved our brand recall and customer interaction in a short time. A skilled, responsive, and result-focused digital marketing team.",
    rating: 5,
  },
  {
    name: "Dr. Sailee",
    role: "CEO – Dr. Sailee's Dental Clinic",
    image: "https://ui-avatars.com/api/?name=Dr+Sailee&size=100&background=random",
    content:
      "Their SEO strategies helped our dental clinic reach the right audience and improve online search visibility. The team is professional, ethical, and well-versed in healthcare marketing. We saw clear improvements in website traffic and patient inquiries. Truly result-oriented service.",
    rating: 5,
  },
  {
    name: "Harikumar",
    role: "CEO – EduPulse",
    image: "https://ui-avatars.com/api/?name=Harikumar&size=100&background=random",
    content:
      "Choosing this certified digital marketing and advertising company for Google ranking and SEO performance was the right decision. Our keyword positions improved steadily, and overall digital presence became stronger. Their expertise, support, and consistency make them a trusted long-term partner.",
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
        ease: "easeOut",
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
