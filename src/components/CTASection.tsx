import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="relative bg-primary rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <motion.div
            className="relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-8"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">
                Limited Time Offer
              </span>
            </motion.div>

            <motion.h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-primary-foreground mb-6"
              variants={itemVariants}
            >
              Ready to Transform Your Digital Marketing?
            </motion.h2>

            <motion.p
              className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10"
              variants={itemVariants}
            >
              Get a free marketing audit and strategy session. We'll analyze your
              current performance and show you exactly how to grow.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group"
                  asChild
                >
                  <a href="tel:+918189848498" aria-label="Call Certifyied for consultation">
                    Get Free Audit
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.p
              className="text-primary-foreground/60 text-sm mt-6"
              variants={itemVariants}
            >
              No commitment required. Free for a limited time.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
