import { useEffect, useRef } from "react";
import {
  Search,
  BarChart3,
  Share2,
  FileText,
  Mail,
  Target,
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Dominate search rankings with our proven SEO strategies. We help you get found by the right audience.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "PPC Advertising",
    description:
      "Maximize your ad spend with targeted PPC campaigns that deliver measurable results and high ROI.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Share2,
    title: "Social Media Marketing",
    description:
      "Build your brand presence across all major platforms with engaging content and strategic campaigns.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: FileText,
    title: "Content Marketing",
    description:
      "Compelling content that tells your story, engages your audience, and drives conversions.",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description:
      "Nurture leads and drive sales with personalized email campaigns that convert.",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: Target,
    title: "Conversion Optimization",
    description:
      "Turn visitors into customers with data-driven CRO strategies and A/B testing.",
    color: "bg-cyan-500/10 text-cyan-600",
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".service-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-up");
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
            Everything You Need to Grow
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive digital marketing solutions tailored to your business
            goals. From strategy to execution, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card opacity-0 group bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
              >
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
