import { motion } from "framer-motion";
import { usePublicContent } from "../hooks/usePublicContent";
import { ArrowRight, Code, Palette, Smartphone, Cloud, TrendingUp } from "lucide-react";

const serviceIcons = {
  "Development": Code,
  "Design": Palette, 
  "Mobile": Smartphone,
  "Cloud": Cloud,
  "Analytics": TrendingUp,
};

export default function HomePage() {
  const { data: content, isLoading } = usePublicContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Redwood/Studio44 Design */}
      <section className="hero-fade relative h-screen flex items-center justify-center overflow-hidden">
        {/* Vertical Text Left */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 vertical-text text-white/30 text-3xl font-light">
          विविधा
        </div>
        
        {/* Main Title */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-anton text-white text-[15vw] leading-none tracking-tight">
            VIVIDA
          </h1>
        </motion.div>
        
        {/* Vertical Text Right */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 vertical-text text-white/30 text-3xl font-light">
          维维达
        </div>
      </section>

      {/* Services Section - Casewell Design */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive technology solutions designed to elevate your business
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {content?.services?.map((service, index) => {
              const IconComponent = serviceIcons[service.title as keyof typeof serviceIcons] || Code;
              
              return (
                <motion.div 
                  key={service.id}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`service-${service.title.toLowerCase()}`}
                >
                  <div className="mb-6 flex justify-center">
                    <IconComponent className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                    data-testid={`service-link-${service.title.toLowerCase()}`}
                  >
                    Read more <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lento Video Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Dark background with gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        </div>
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <motion.div 
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-8xl font-bold text-white mb-8">
            Engineering <em className="italic font-serif text-gray-300">what's</em> Next
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At the intersection of innovation and execution, we craft tomorrow's technology today.
          </p>
        </motion.div>
      </section>
    </>
  );
}
