import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import digitalMenuImage from "@/assets/digital_menu.jpg";
import zigantureCardImage from "@/assets/ziganture_card.jpg";

const products = [
  {
    title: "Scanfyi – Digital Menu Made Easy",
    description:
      "Scanfyi allows customers to view your menu instantly by scanning a QR code. No apps, no downloads—just a smooth, contactless experience.",
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
    title: "Signature Card – Your Digital Identity",
    description:
      "The Signature Card replaces traditional paper business cards with a smart digital solution. Share your contact details, website, and social links with a simple tap or scan.",
    features: [
      "Instant sharing of contact details",
      "Update information anytime",
      "Professional and eco-friendly",
      "Perfect for individuals, teams, and brands",
    ],
    closingLine:
      "Signature Cards help you leave a strong first impression every time.",
    image: zigantureCardImage,
    imageAlt: "Signature Card",
  },
];

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".product-card");
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
    <section id="pricing" ref={sectionRef} className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Products
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6">
            Innovative Digital Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card opacity-0 group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
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
                      : "Why Signature Card stands out"}
                  </h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.closingLine}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
