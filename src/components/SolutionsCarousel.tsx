import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const solutions = [
  {
    title: "E-commerce Growth",
    description: "Scaled online store revenue by 340% in 6 months through strategic SEO and paid advertising.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    metric: "+340%",
    metricLabel: "Revenue Growth",
    icon: TrendingUp,
  },
  {
    title: "B2B Lead Generation",
    description: "Generated 1,200+ qualified leads monthly for enterprise software company.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    metric: "1,200+",
    metricLabel: "Monthly Leads",
    icon: Users,
  },
  {
    title: "Brand Awareness",
    description: "Increased brand visibility by 500% through multi-channel social media campaigns.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    metric: "+500%",
    metricLabel: "Brand Visibility",
    icon: Target,
  },
  {
    title: "Local SEO Dominance",
    description: "Achieved #1 rankings for 50+ local keywords for regional healthcare provider.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop",
    metric: "#1",
    metricLabel: "Local Rankings",
    icon: TrendingUp,
  },
  {
    title: "SaaS User Acquisition",
    description: "Reduced customer acquisition cost by 60% while tripling sign-ups.",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=400&fit=crop",
    metric: "-60%",
    metricLabel: "CAC Reduction",
    icon: Users,
  },
];

const SolutionsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-scroll
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 4000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="solutions" className="py-24 bg-secondary/30">
      <div className="container mx-auto max-w-6xl px-4 mb-12">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              Case Studies
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              Proven Results, Real Impact
            </h2>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="rounded-full"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-8 pl-4 md:pl-[calc((100%-72rem)/2+1rem)]">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-[320px] md:w-[400px] group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <motion.div
                className="bg-card rounded-2xl overflow-hidden border border-border"
                whileHover={{
                  y: -8,
                  borderColor: "rgba(var(--primary), 0.3)",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="relative h-48 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <motion.div
                    className="absolute bottom-4 left-4 flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-primary rounded-lg p-2">
                      <solution.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="text-card">
                      <div className="text-2xl font-bold">{solution.metric}</div>
                      <div className="text-xs opacity-80">{solution.metricLabel}</div>
                    </div>
                  </motion.div>
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsCarousel;
