import { motion } from "framer-motion";
import { usePublicContent } from "../hooks/usePublicContent";
import { useNavigate } from "react-router-dom";
import { Rocket, Users, Award, TrendingUp } from "lucide-react";

const milestoneIcons = {
  "Company Founded": Rocket,
  "First Client": Users,
  "Product Launch": Award,
  "Scale & Growth": TrendingUp,
};

export default function JourneyPage() {
  const { data: content, isLoading } = usePublicContent();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const milestones = content?.journeyMilestones || [];

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg">Milestones that define our path forward</p>
        </motion.div>
        
        {/* Horizontal Timeline */}
        <div className="relative py-16">
          <div className="flex overflow-x-auto space-x-16 pb-8" data-testid="timeline-container">
            {milestones.map((milestone, index) => {
              const IconComponent = milestoneIcons[milestone.title as keyof typeof milestoneIcons] || Rocket;
              
              return (
                <motion.div 
                  key={milestone.id}
                  className="timeline-node flex-shrink-0 text-center cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/journey/${milestone.id}`)}
                  data-testid={`milestone-${milestone.id}`}
                >
                  <div className="relative">
                    <motion.div 
                      className="w-16 h-16 rounded-full border-4 border-primary bg-white mx-auto mb-4 flex items-center justify-center shadow-lg"
                      whileHover={{ borderColor: "var(--vivida-primary)", scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="w-6 h-6 text-primary" />
                    </motion.div>
                    
                    {/* Dashed connecting line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute top-8 left-full w-16 border-t-2 border-dashed border-border hidden lg:block"></div>
                    )}
                  </div>
                  
                  <div className="text-sm text-primary font-semibold mb-2">{milestone.year}</div>
                  <h4 className="font-semibold text-foreground mb-2">{milestone.title}</h4>
                  <p className="text-xs text-muted-foreground max-w-32">{milestone.caption}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
