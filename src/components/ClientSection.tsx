import { motion } from "framer-motion";
import clientsImage from "@/assets/clients.png";

const ClientSection = () => {
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
    hidden: { opacity: 0, y: 20 },
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
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Clients
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
            Trusted by High-Growth Brands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            “We work with ambitious companies across industries to drive measurable growth and long-term success.”
          </p>
        </motion.div>

        <motion.div
          className="mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            className="bg-card rounded-2xl overflow-hidden border border-border w-full"
            variants={itemVariants}
            whileHover={{
              y: -8,
              borderColor: "hsl(var(--primary) / 0.3)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="relative w-full overflow-hidden h-56 sm:h-64 md:h-72 lg:h-80">
              <img
                src={clientsImage}
                alt="Client success story"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection;

