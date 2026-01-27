import {
  Search,
  BarChart3,
  Share2,
  FileText,
  Code,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import google360Image from "@/assets/google_360.jpg";
import digitalMarketingImage from "@/assets/digital_marketing.jpg";
import performanceMarketingImage from "@/assets/perfomance_marketing.jpg";
import socialMediaMarketingImage from "@/assets/social_media_marketing.jpg";
import webDevImage from "@/assets/web_dev.jpg";
import appDevImage from "@/assets/app_dev.jpg";

const services = [
  {
    icon: Search,
    title: "360° Google Services",
    description:
      "We help your business rank higher on Google, appear on Maps, and gain more customer calls through optimized profiles, local SEO, and ads.",
    color: "bg-emerald-500/10 text-emerald-600",
    image: google360Image,
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description:
      "Customized digital strategies designed to build brand awareness, generate leads, and deliver measurable growth across online platforms.",
    color: "bg-blue-500/10 text-blue-600",
    image: digitalMarketingImage,
  },
  {
    icon: Share2,
    title: "Performance Marketing",
    description:
      "ROI-focused advertising campaigns on Google, Facebook, and Instagram that drive real leads, calls, and conversions.",
    color: "bg-purple-500/10 text-purple-600",
    image: performanceMarketingImage,
  },
  {
    icon: FileText,
    title: "Social Media Marketing",
    description:
      "Creative and consistent social media management that builds trust, increases engagement, and converts followers into customers.",
    color: "bg-orange-500/10 text-orange-600",
    image: socialMediaMarketingImage,
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Custom, responsive, and high-performance websites designed to elevate your brand, improve user experience, and drive business growth across all devices.",
    color: "bg-pink-500/10 text-pink-600",
    image: webDevImage,
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Scalable and user-friendly mobile and web applications built to deliver seamless functionality, performance, and engaging digital experiences.",
    color: "bg-cyan-500/10 text-cyan-600",
    image: appDevImage,
  },
];

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            About Certifyied
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
            Everything You Need to Grow
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Certifyied delivers smart digital solutions that boost visibility, attract the right audience, and turn leads into loyal customers through result-driven strategies.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group bg-card rounded-2xl p-8 border border-border cursor-pointer flex flex-col"
              variants={itemVariants}
              whileHover={{
                y: -8,
                borderColor: "hsl(var(--primary) / 0.3)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 },
              }}
            >
              {service.image && (
                <motion.div
                  className="w-full h-48 rounded-xl overflow-hidden mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
              <motion.div
                className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <service.icon className="w-7 h-7" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
