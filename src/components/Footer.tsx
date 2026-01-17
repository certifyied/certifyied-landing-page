import { Mail, MapPin, Phone, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import certifyiedLogo from "@/assets/certifyied_logo.png";

const Footer = () => {
  const footerLinks = {
    Services: [
      { name: "SEO Optimization", href: "#" },
      { name: "PPC Advertising", href: "#" },
      { name: "Social Media", href: "#" },
      { name: "Content Marketing", href: "#" },
      { name: "Email Marketing", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
    ],
    Resources: [
      { name: "Case Studies", href: "#" },
      { name: "Marketing Guide", href: "#" },
      { name: "SEO Tools", href: "#" },
      { name: "ROI Calculator", href: "#" },
      { name: "Free Audit", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <motion.footer
      className="bg-foreground text-background py-16 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.img
                src={certifyiedLogo}
                alt="Certifyied Logo"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="text-background/70 mb-6 max-w-sm">
              Helping ambitious brands scale through data-driven digital marketing
              strategies that deliver measurable results.
            </p>
            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-3 text-background/70"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-5 h-5 text-primary" />
                <span>info@certifyied.com</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-background/70"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 8189848498, +91 9544596699</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-background/70"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-5 h-5 text-primary" />
                <span>28/275J Kakkanad, Kochi, Kerala - 682021</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h4 className="font-semibold text-background mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-background/70 hover:text-primary transition-colors duration-200"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-background/50 text-sm">
            © 2024 Certifyied. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <motion.a
              href="#"
              className="hover:text-primary transition-colors"
              whileHover={{ x: 3 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-primary transition-colors"
              whileHover={{ x: 3 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
