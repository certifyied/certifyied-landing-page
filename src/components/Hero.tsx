import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Users } from "lucide-react";

const Hero = () => {

  return (
    <section
      className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by 500+ businesses worldwide
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
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
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          At Certifyied, we don’t just market brands — we build digital success stories.


          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="lg" className="group">
              Start Free Consultation
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="hero-outline" size="lg" className="group">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {[
              { icon: TrendingUp, value: "250%", label: "Avg. ROI Increase" },
              { icon: Users, value: "500+", label: "Happy Clients" },
              { icon: Sparkles, value: "$50M+", label: "Revenue Generated" },
              { icon: TrendingUp, value: "98%", label: "Client Retention" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-colors duration-300"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 animate-float hidden lg:block">
        <div className="bg-card shadow-medium rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">Traffic Increased</div>
              <div className="text-xs text-muted-foreground">+127% this month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-40 right-10 animate-float hidden lg:block" style={{ animationDelay: "1s" }}>
        <div className="bg-card shadow-medium rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">New Leads</div>
              <div className="text-xs text-muted-foreground">+45 today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
