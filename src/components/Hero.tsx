// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
// import { motion } from "framer-motion";

// const Hero = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: [0.4, 0, 0.2, 1] as const,
//       },
//     },
//   };

//   const floatingVariants = {
//     animate: {
//       y: [0, -10, 0],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: [0.4, 0, 0.6, 1] as const,
//       },
//     },
//   };

//   return (
//     <section
//       className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 relative overflow-hidden"
//     >
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.1, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: [0.4, 0, 0.6, 1] as const,
//           }}
//         />
//         <motion.div
//           className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.15, 1],
//             opacity: [0.4, 0.6, 0.4],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             ease: [0.4, 0, 0.6, 1] as const,
//             delay: 1,
//           }}
//         />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
//       </div>

//       <div className="container mx-auto max-w-6xl relative z-10">
//         <motion.div
//           className="text-center"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Badge */}
//           <motion.div
//             className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
//             variants={itemVariants}
//             whileHover={{ scale: 1.05 }}
//           >
//             <Sparkles className="w-4 h-4 text-primary" />
//             <span className="text-sm font-medium text-primary">
//               Trusted by 5000+ businesses worldwide
//             </span>
//           </motion.div>

//           {/* Main Headline */}
//           <motion.h1
//             className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight mb-6"
//             variants={itemVariants}
//           >
//             Best{" "}
//             <span className="text-primary relative">
//               Google 360  
//               <svg
//                 className="absolute -bottom-2 left-0 w-full"
//                 viewBox="0 0 200 12"
//                 fill="none"
//               >
//                 <path
//                   d="M2 10C50 2 150 2 198 10"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   className="text-primary/40"
//                 />
//               </svg>
//             </span>{" "}
//             Provider and    {" "} <span className="text-primary relative">
//               digital marketing 
//               <svg
//                 className="absolute -bottom-2 left-0 w-full"
//                 viewBox="0 0 200 12"
//                 fill="none"
//               >
//                 <path
//                   d="M2 10C50 2 150 2 198 10"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   className="text-primary/40"
//                 />
//               </svg>
//             </span>{" "} company in India
//       </motion.h1>


//           {/* Subheadline */}
//           <motion.p
//             className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
//             variants={itemVariants}
//           >
//             At Certifyied, we don't just market brands — we build digital success stories.
//           </motion.p>

//           {/* CTA Button */}
//           <motion.div
//             className="flex items-center justify-center mb-16"
//             variants={itemVariants}
//           >
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button variant="hero" size="lg" className="group" asChild>
//                 <a href="tel:+918189848498" aria-label="Call Certifyied for consultation">
//                   Start Free Consultation
//                   <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                 </a>
//               </Button>
//             </motion.div>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
//             variants={containerVariants}
//           >
//             {[
//               { icon: TrendingUp, value: "5000+", label: "Happy Clients" },
//               { icon: Users, value: "1000+", label: "Creators" },
//               { icon: Users, value: "2.5M+", label: "Client Retention" },
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
//                 variants={itemVariants}
//                 whileHover={{
//                   scale: 1.05,
//                   borderColor: "hsl(var(--primary) / 0.3)",
//                   transition: { duration: 0.2 },
//                 }}
//               >
//                 <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
//                 <div className="text-2xl md:text-3xl font-bold text-foreground">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Floating Elements */}
//       <motion.div
//         className="absolute bottom-10 left-10 hidden lg:block"
//         variants={floatingVariants}
//         animate="animate"
//       >
//         <motion.div
//           className="bg-card shadow-medium rounded-2xl p-4 border border-border"
//           whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//               <TrendingUp className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <div className="text-sm font-semibold">Traffic Increased</div>
//               <div className="text-xs text-muted-foreground">+127% this month</div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         className="absolute top-40 right-10 hidden lg:block"
//         variants={floatingVariants}
//         animate="animate"
//         transition={{ delay: 1 }}
//       >
//         <motion.div
//           className="bg-card shadow-medium rounded-2xl p-4 border border-border"
//           whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//               <Users className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <div className="text-sm font-semibold">New Leads</div>
//               <div className="text-xs text-muted-foreground">+45 today</div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

// export default Hero;


import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import dog from "@/assets/pngtree-a-dog-jumping-in-the-air-with-tag-that-says-on-png-image_15448885.png"; // use transparent PNG

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
    hidden: { opacity: 0, y: 30 },
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
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center pt-20 pb-16 px-4 relative overflow-hidden">

      {/* Playful Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-blue-200 rounded-full blur-2xl opacity-40" />

      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="inline-block relative ml-4"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
        </motion.div>
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full px-6 py-2 mb-10 shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.08 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Trusted by 5000+ businesses worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8"
  variants={itemVariants}
>
  <span className="text-black">Best </span>

  {/* Google 360 with paint background */}
  <span className="relative inline-block px-4 py-1">
    <span className="absolute inset-0 -z-10">
      <svg
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M10,60 Q150,10 290,60 Q150,100 10,60 Z"
          fill="#3b82f6"
          opacity="0.25"
        />
      </svg>
    </span>
    <span className="text-blue-600">Google 360</span>
  </span>

  <span className="text-black"> Provider and </span>

  {/* Digital Marketing with paint background */}
  <span className="relative inline-block px-4 py-1">
    <span className="absolute inset-0 -z-10">
      <svg
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M10,60 Q150,20 290,60 Q150,95 10,60 Z"
          fill="#ec4899"
          opacity="0.25"
        />
      </svg>
    </span>
    <span className="text-pink-600">digital marketing</span>
  </span>

  <span className="text-black"> company in India</span>
</motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12"
            variants={itemVariants}
          >
            At Certifyied, we don't just market brands — we build digital success stories.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex items-center justify-center mb-20"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-6 rounded-2xl shadow-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300"
                asChild
              >
                <a href="tel:+918189848498">
                  Start Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
  variants={containerVariants}
>
  {[
    {
      icon: TrendingUp,
      value: "5000+",
      label: "Happy Clients",
      gradient: "from-yellow-400 via-orange-400 to-pink-500",
      glow: "shadow-yellow-300/40",
    },
    {
      icon: Users,
      value: "1000+",
      label: "Creators",
      gradient: "from-pink-400 via-purple-400 to-indigo-500",
      glow: "shadow-pink-300/40",
    },
    {
      icon: Users,
      value: "2.5M+",
      label: "Client Retention",
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      glow: "shadow-blue-300/40",
    },
  ].map((stat, index) => (
    <motion.div
      key={index}
      className={`relative overflow-hidden rounded-3xl p-8 text-white bg-gradient-to-br ${stat.gradient} shadow-2xl ${stat.glow}`}
      variants={itemVariants}
      whileHover={{
        scale: 1.08,
        rotate: 1,
      }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl"></div>

      {/* Floating Animation */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative z-10 text-center"
      >
        {/* Icon */}
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <stat.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Value */}
        <div className="text-3xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg">
          {stat.value}
        </div>

        {/* Label */}
        <div className="text-sm md:text-base opacity-90 mt-2">
          {stat.label}
        </div>
      </motion.div>

      {/* Decorative Glow Circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
    </motion.div>
  ))}
</motion.div>
        </motion.div>
      </div>

      {/* Floating Cartoon Cards */}
      <motion.div
        className="absolute bottom-16 left-10 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
      >
        <div className="bg-yellow-100 border-2 border-yellow-300 rounded-3xl p-4 shadow-lg">
          <div className="text-sm font-bold text-yellow-700">
            Traffic Increased
          </div>
          <div className="text-xs text-yellow-600">
            +127% this month
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 right-10 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
      >
        <div className="bg-pink-100 border-2 border-pink-300 rounded-3xl p-4 shadow-lg">
          <div className="text-sm font-bold text-pink-700">
            New Leads
          </div>
          <div className="text-xs text-pink-600">
            +45 today
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;