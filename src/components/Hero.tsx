import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by 500+ businesses worldwide
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight mb-6"
            variants={itemVariants}
          >
            Grow Your Business with{" "}
            <span className="text-primary relative">
              Certifyied 
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary/40"
                />
              </svg>
            </span>{" "}
            Marketing Experts
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            variants={itemVariants}
          >
            At Certifyied, we don't just market brands — we build digital success stories.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="hero" size="lg" className="group">
                Start Free Consultation
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="hero-outline" size="lg" className="group">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            variants={containerVariants}
          >
            {[
              { icon: TrendingUp, value: "250%", label: "Avg. ROI Increase" },
              { icon: Users, value: "500+", label: "Happy Clients" },
              { icon: Sparkles, value: "$50M+", label: "Revenue Generated" },
              { icon: TrendingUp, value: "98%", label: "Client Retention" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(var(--primary), 0.3)",
                  transition: { duration: 0.2 },
                }}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute bottom-10 left-10 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
      >
        <motion.div
          className="bg-card shadow-medium rounded-2xl p-4 border border-border"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">Traffic Increased</div>
              <div className="text-xs text-muted-foreground">+127% this month</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-10 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <motion.div
          className="bg-card shadow-medium rounded-2xl p-4 border border-border"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">New Leads</div>
              <div className="text-xs text-muted-foreground">+45 today</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
