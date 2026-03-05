// import {
//   Search,
//   BarChart3,
//   Share2,
//   FileText,
//   Code,
//   Smartphone,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import google360Image from "@/assets/google_360.jpg";
// import digitalMarketingImage from "@/assets/digital_marketing.jpg";
// import performanceMarketingImage from "@/assets/perfomance_marketing.jpg";
// import socialMediaMarketingImage from "@/assets/social_media_marketing.jpg";
// import webDevImage from "@/assets/web_dev.jpg";
// import appDevImage from "@/assets/app_dev.jpg";

// const services = [
//   {
//     icon: Search,
//     title: "360° Google Services",
//     description:
//       "We help your business rank higher on Google, appear on Maps, and gain more customer calls as the Best Google 360 Provider in India through optimized profiles, local SEO, and high-performing ads.",
//     color: "bg-emerald-500/10 text-emerald-600",
//     image: google360Image,
//   },
//   {
//     icon: BarChart3,
//     title: "Digital Marketing",
//     description:
//       "Customized digital strategies designed to build brand awareness, generate leads, and deliver measurable growth across online platforms.",
//     color: "bg-blue-500/10 text-blue-600",
//     image: digitalMarketingImage,
//   },
//   {
//     icon: Share2,
//     title: "Performance Marketing",
//     description:
//       "We deliver ROI-focused advertising campaigns on Google, Facebook, and Instagram, making us the best Performance Marketing  service in Kochi  and a leader in best digital marketing company  in Kochi, driving real leads, calls, and conversions.",
//     color: "bg-purple-500/10 text-purple-600",
//     image: performanceMarketingImage,
//   },
//   {
//     icon: FileText,
//     title: "Social Media Marketing",
//     description:
//       "We provide creative and consistent social media management, making us the best Social Media Marketing service in Kochi and a leader in best digital marketing company in Kochi   , building trust, increasing engagement, and converting followers into customers.",
//     color: "bg-orange-500/10 text-orange-600",
//     image: socialMediaMarketingImage,
//   },
//   {
//     icon: Code,
//     title: "Seo Optimization",
//     description:
//       "Custom, responsive, and high-performance websites designed to elevate your brand, improve user experiCertifyied offers the best SEO service in Kochi, helping your business rank higher on Google, boost organic traffic, and attract customers with expert local SEO, on-page optimization, and targeted strategies.",
//     color: "bg-pink-500/10 text-pink-600",
//     image: webDevImage,
//   },
//   {
//     icon: Smartphone,
//     title: "Web & App Development",
//     description:
//       "We build scalable and user-friendly mobile and web applications as the best digital marketing company in Kochi, delivering seamless functionality, high performance, and engaging digital experiences.",
//     color: "bg-cyan-500/10 text-cyan-600",
//     image: appDevImage,
//   },
// ];

// const Services = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut" as const,
//       },
//     },
//   };

//   const sectionVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   return (
//     <section id="services" className="py-24 px-4">
//       <div className="container mx-auto max-w-6xl">
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.6 }}
//         >
//           <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
//             About Certifyied
//           </span>
//           <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
//             Everything You Need to Grow
//           </h2>
//           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//            Certifyied delivers smart digital solutions as the Best Google 360 Provider in India and the Best Digital Marketing company in Kochi, boosting visibility, attracting the right audience, and turning leads into loyal customers through result-driven strategies.
//           </p>
//         </motion.div>

//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-50px" }}
//         >
//           {services.map((service, index) => (
//             <motion.div
//               key={index}
//               className="group bg-card rounded-2xl p-8 border border-border cursor-pointer flex flex-col"
//               variants={itemVariants}
//               whileHover={{
//                 y: -8,
//                 borderColor: "hsl(var(--primary) / 0.3)",
//                 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                 transition: { duration: 0.3 },
//               }}
//             >
//               {service.image && (
//                 <motion.div
//                   className="w-full h-48 rounded-xl overflow-hidden mb-6"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <img
//                     src={service.image}
//                     alt={service.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </motion.div>
//               )}
//               <motion.div
//                 className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}
//                 whileHover={{ scale: 1.1, rotate: 5 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <service.icon className="w-7 h-7" />
//               </motion.div>
//               <h3 className="text-xl font-semibold text-foreground mb-3">
//                 {service.title}
//               </h3>
//               <p className="text-muted-foreground leading-relaxed flex-grow">
//                 {service.description}
//               </p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Services;



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
      "Rank higher on Google, appear on Maps, and get more calls with optimized profiles, local SEO, and high-performing ads.",
    image: google360Image,
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description:
      "Customized digital strategies to build brand awareness, generate leads, and deliver measurable growth.",
    image: digitalMarketingImage,
  },
  {
    icon: Share2,
    title: "Performance Marketing",
    description:
      "ROI-focused campaigns across Google & Meta platforms that drive real leads and conversions.",
    image: performanceMarketingImage,
  },
  {
    icon: FileText,
    title: "Social Media Marketing",
    description:
      "Creative social media strategies that build trust, increase engagement, and convert followers.",
    image: socialMediaMarketingImage,
  },
  {
    icon: Code,
    title: "SEO Optimization",
    description:
      "Expert local SEO and on-page strategies to rank higher and boost organic traffic.",
    image: webDevImage,
  },
  {
    icon: Smartphone,
    title: "Web & App Development",
    description:
      "Scalable, high-performance web and mobile applications with seamless UX.",
    image: appDevImage,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-primary font-semibold uppercase tracking-widest text-sm">
            About Certifyied
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium">
            Everything You Need to Grow
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
            Smart digital solutions that boost visibility, attract the right
            audience, and convert leads into loyal customers.
          </p>
        </div>

        {/* Creative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-3xl cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 p-8 text-white">
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 group-hover:scale-110 transition duration-300">
                    <service.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-semibold mb-3">
                    {service.title}
                  </h3>

                  <p className="text-white/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;