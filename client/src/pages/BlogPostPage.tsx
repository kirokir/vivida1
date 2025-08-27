import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: milestone, isLoading, error } = useQuery({
    queryKey: ["/api/journey", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !milestone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Button onClick={() => navigate("/journey")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <motion.div 
        className="h-64 bg-gradient-to-r from-primary to-primary/80 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/journey")}
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Journey
        </Button>
      </motion.div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Project Logo & Meta */}
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
            </div>
            <div className="pt-8">
              <h1 
                className="text-4xl font-bold text-foreground mb-4"
                data-testid="post-title"
              >
                {milestone.title}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Vivida Team</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{milestone.year}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rich Text Content */}
          <div 
            className="prose prose-lg max-w-none bg-white rounded-xl p-8 shadow-sm"
            data-testid="post-content"
          >
            <div dangerouslySetInnerHTML={{ __html: milestone.content || milestone.caption }} />
          </div>
        </motion.div>
      </div>
      
      {/* Spacing for footer */}
      <div className="h-16"></div>
    </div>
  );
}
