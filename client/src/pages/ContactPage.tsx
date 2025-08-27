import { motion } from "framer-motion";
import { useState } from "react";
import { usePublicContent } from "../hooks/usePublicContent";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function ContactPage() {
  const { data: content, isLoading } = usePublicContent();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/contact", formData);
      
      // Show success state
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const theme = content?.theme;
  const contactInfo = content?.contactInfo;

  return (
    <section className="py-16 px-8 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full text-center">
        <motion.h1 
          className="text-5xl lg:text-6xl font-bold text-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Let's create something amazing.
        </motion.h1>
        
        {/* Contact Information */}
        <motion.div 
          className="mb-16 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Email</h3>
              <a 
                href={`mailto:${contactInfo?.email}`}
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                data-testid="contact-email"
              >
                {contactInfo?.email}
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Phone</h3>
              <a 
                href={`tel:${contactInfo?.phone}`}
                className="text-lg text-primary hover:text-primary/80 transition-colors"
                data-testid="contact-phone"
              >
                {contactInfo?.phone}
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Office</h3>
              <p className="text-lg text-muted-foreground" data-testid="contact-office">
                {contactInfo?.officeLocation}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          data-testid="contact-form"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
                data-testid="input-email"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
              Subject
            </Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full"
              data-testid="input-subject"
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full resize-vertical"
              data-testid="input-message"
            />
          </div>
          
          {/* Dynamic Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-8 text-lg font-semibold transition-all duration-200 ${
              theme?.buttonStyle === 'rounded-full' ? 'rounded-full' : 
              theme?.buttonStyle === 'square' ? 'rounded-none' : 'rounded-lg'
            }`}
            style={{
              backgroundColor: theme?.primaryColor || '#e11d48',
              borderColor: theme?.primaryColor || '#e11d48',
            }}
            data-testid="button-submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
          
          {/* Success Message */}
          {showSuccess && (
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              data-testid="success-message"
            >
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                Thank you! Your message has been sent successfully.
              </div>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
