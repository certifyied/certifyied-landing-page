import { Check } from "lucide-react";
import { motion } from "framer-motion";
import digitalMenuImage from "@/assets/digital_menu.jpg";
import zigantureCardImage from "@/assets/ziganture_card.jpg";

const products = [
  {
    title: "Scanfyi – Digital Menu Made Easy",
    description:
      "Scanfyi lets customers view your menu instantly by scanning a QR code. No apps, no downloads—just a smooth, contactless experience. Designed and promoted by the best digital marketing company in Kochi, we ensure maximum reach and engagement for your restaurant.",
    features: [
      "Quick QR-based menu access",
      "Clean, mobile-friendly design",
      "Easy updates anytime",
      "Cost effective and eco-friendly",
      "Ideal for restaurants, cafés, and food businesses",
    ],
    closingLine:
      "Scanfyi helps your brand look modern while making ordering easier for customers.",
    image: digitalMenuImage,
    imageAlt: "Scanfyi Digital Menu",
  },
  {
    title: "Zignature Card – Your Digital Identity",
    description:
      "The Zignature Card replaces traditional paper business cards with a smart digital solution. Share your contact details, website, and social links instantly with a simple tap or scan. Promoted and supported by the best digital marketing company in Kochi, ensuring your digital identity reaches the right audience.",
    features: [
      "Instant sharing of contact details",
      "Update information anytime",
      "Professional and eco-friendly",
      "Perfect for individuals, teams, and brands",
    ],
    closingLine:
      "zignature Cards help you leave a strong first impression every time.",
    image: zigantureCardImage,
    imageAlt: "Zignature Card",
  },
];

const Pricing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="pricing" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Products
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
            Innovative Digital Solutions
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden border border-border"
              variants={itemVariants}
              whileHover={{
                y: -8,
                borderColor: "hsl(var(--primary) / 0.3)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="w-full h-64 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {product.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {index === 0
                      ? "Why Scanfyi works"
                      : "Why Zignature Card stands out"}
                  </h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIndex * 0.1 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.closingLine}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
