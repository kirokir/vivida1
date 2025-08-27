import { motion } from "framer-motion";
import { usePublicContent } from "../hooks/usePublicContent";
import { ExternalLink, Github } from "lucide-react";

export default function WorkPage() {
  const { data: content, isLoading } = usePublicContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const projects = content?.portfolioProjects || [];

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Work</h2>
          <p className="text-muted-foreground text-lg">Showcasing our latest projects and innovations</p>
        </motion.div>
        
        {/* Masonry Grid */}
        <div className="masonry-grid" data-testid="portfolio-grid">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              className="masonry-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              data-testid={`project-${project.id}`}
            >
              <div className="project-card relative rounded-xl overflow-hidden shadow-lg bg-card group">
                <img 
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  data-testid={`project-image-${project.id}`}
                />
                
                <motion.div 
                  className="project-overlay absolute inset-0 flex items-end"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 text-white w-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold" data-testid={`project-title-${project.id}`}>
                        {project.title}
                      </h3>
                      <div className="flex space-x-2">
                        {project.projectUrl && (
                          <a 
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white transition-colors"
                            data-testid={`project-link-${project.id}`}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white transition-colors"
                            data-testid={`project-github-${project.id}`}
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3" data-testid={`project-description-${project.id}`}>
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2" data-testid={`project-tags-${project.id}`}>
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-white/20 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
