import { motion } from "framer-motion";
import { usePublicContent } from "../hooks/usePublicContent";
import { Github, Linkedin } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function TeamPage() {
  const { data: content, isLoading } = usePublicContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = content?.teamMembers || [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-muted-foreground text-lg">The innovators behind Vivida's success</p>
          </motion.div>
        </div>
      </section>
      
      {/* Full-Screen Team Showcase */}
      <div 
        ref={containerRef}
        className="team-container flex overflow-x-auto"
        data-testid="team-carousel"
      >
        {teamMembers.map((member, index) => (
          <motion.div 
            key={member.id}
            className={`team-slide flex items-center justify-center ${
              index % 2 === 0 ? 'bg-accent' : 'bg-muted'
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            data-testid={`team-slide-${member.name.toLowerCase().replace(' ', '-')}`}
          >
            <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className={index % 2 === 0 ? "order-2 md:order-1" : "order-1"}>
                <motion.img 
                  src={member.imageUrl || `https://images.unsplash.com/photo-${index === 0 ? '1507003211169-0a1dd7228f2d' : '1472099645785-5658abf4ff4e'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800`}
                  alt={`${member.name} - ${member.title}`}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  data-testid={`team-image-${member.name.toLowerCase().replace(' ', '-')}`}
                />
              </div>
              
              {/* Content */}
              <div className={index % 2 === 0 ? "order-1 md:order-2" : "order-2"}>
                <motion.h3 
                  className="text-5xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  data-testid={`team-name-${member.name.toLowerCase().replace(' ', '-')}`}
                >
                  {member.name}
                </motion.h3>
                
                <motion.p 
                  className="text-2xl text-primary mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  data-testid={`team-title-${member.name.toLowerCase().replace(' ', '-')}`}
                >
                  {member.title}
                </motion.p>
                
                <motion.p 
                  className="text-lg text-muted-foreground leading-relaxed mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  data-testid={`team-bio-${member.name.toLowerCase().replace(' ', '-')}`}
                >
                  {member.bio}
                </motion.p>
                
                <motion.div 
                  className="flex space-x-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {member.linkedinUrl && (
                    <a 
                      href={member.linkedinUrl}
                      className="text-2xl text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`team-linkedin-${member.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <Linkedin className="w-8 h-8" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a 
                      href={member.githubUrl}
                      className="text-2xl text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`team-github-${member.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <Github className="w-8 h-8" />
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Slide Indicators */}
      {teamMembers.length > 1 && (
        <div className="flex justify-center py-8 space-x-2">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                currentSlide === index ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => {
                const container = containerRef.current;
                if (container) {
                  container.scrollTo({
                    left: index * container.clientWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              data-testid={`slide-indicator-${index}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
