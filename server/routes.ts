import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { seedDatabase } from "./seedDatabase";
import { 
  insertUserSchema, insertTeamMemberSchema, insertServiceSchema, 
  insertJourneyMilestoneSchema, insertPortfolioProjectSchema, 
  insertContactSubmissionSchema, updateSiteThemeSchema, updateContactInfoSchema 
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "vivida-jwt-secret-key";

// Middleware to verify JWT token
const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize database with seed data on first run
  app.get("/api/init", async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database initialized successfully" });
    } catch (error) {
      console.error("Error initializing database:", error);
      res.status(500).json({ message: "Failed to initialize database" });
    }
  });
  
  // Public API - Get all content
  app.get("/api/public-content", async (req, res) => {
    try {
      const content = await storage.getPublicContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching public content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public API - Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const submission = insertContactSubmissionSchema.parse(req.body);
      const newSubmission = await storage.createContactSubmission(submission);
      res.status(201).json({ message: "Message sent successfully", id: newSubmission.id });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(400).json({ message: "Invalid form data" });
    }
  });

  // Get journey milestone by ID (for blog posts)
  app.get("/api/journey/:id", async (req, res) => {
    try {
      const milestone = await storage.getJourneyMilestone(req.params.id);
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      res.json(milestone);
    } catch (error) {
      console.error("Error fetching milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth API - Native login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth API - Firebase login
  app.post("/api/auth/firebase-login", async (req, res) => {
    try {
      const { firebaseUid, email } = req.body;
      
      if (!firebaseUid || !email) {
        return res.status(400).json({ message: "Firebase UID and email required" });
      }

      let user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          email,
          firebaseUid,
        });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("Error during Firebase login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth API - Register (for seeding admin user)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Protected Admin Routes
  
  // Site Theme
  app.get("/api/admin/theme", verifyToken, async (req, res) => {
    try {
      const theme = await storage.getSiteTheme();
      res.json(theme);
    } catch (error) {
      console.error("Error fetching theme:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/theme", verifyToken, async (req, res) => {
    try {
      const themeUpdate = updateSiteThemeSchema.parse(req.body);
      const theme = await storage.updateSiteTheme(themeUpdate);
      res.json(theme);
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(400).json({ message: "Invalid theme data" });
    }
  });

  // Team Members CRUD
  app.get("/api/admin/team-members", verifyToken, async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/team-members", verifyToken, async (req, res) => {
    try {
      const member = insertTeamMemberSchema.parse(req.body);
      const newMember = await storage.createTeamMember(member);
      res.status(201).json(newMember);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ message: "Invalid team member data" });
    }
  });

  app.put("/api/admin/team-members/:id", verifyToken, async (req, res) => {
    try {
      const member = insertTeamMemberSchema.partial().parse(req.body);
      const updatedMember = await storage.updateTeamMember(req.params.id, member);
      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ message: "Invalid team member data" });
    }
  });

  app.delete("/api/admin/team-members/:id", verifyToken, async (req, res) => {
    try {
      await storage.deleteTeamMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Services CRUD
  app.get("/api/admin/services", verifyToken, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/services", verifyToken, async (req, res) => {
    try {
      const service = insertServiceSchema.parse(req.body);
      const newService = await storage.createService(service);
      res.status(201).json(newService);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.put("/api/admin/services/:id", verifyToken, async (req, res) => {
    try {
      const service = insertServiceSchema.partial().parse(req.body);
      const updatedService = await storage.updateService(req.params.id, service);
      res.json(updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.delete("/api/admin/services/:id", verifyToken, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Journey Milestones CRUD
  app.get("/api/admin/journey", verifyToken, async (req, res) => {
    try {
      const milestones = await storage.getJourneyMilestones();
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching journey milestones:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/journey", verifyToken, async (req, res) => {
    try {
      const milestone = insertJourneyMilestoneSchema.parse(req.body);
      const newMilestone = await storage.createJourneyMilestone(milestone);
      res.status(201).json(newMilestone);
    } catch (error) {
      console.error("Error creating journey milestone:", error);
      res.status(400).json({ message: "Invalid milestone data" });
    }
  });

  app.put("/api/admin/journey/:id", verifyToken, async (req, res) => {
    try {
      const milestone = insertJourneyMilestoneSchema.partial().parse(req.body);
      const updatedMilestone = await storage.updateJourneyMilestone(req.params.id, milestone);
      res.json(updatedMilestone);
    } catch (error) {
      console.error("Error updating journey milestone:", error);
      res.status(400).json({ message: "Invalid milestone data" });
    }
  });

  app.delete("/api/admin/journey/:id", verifyToken, async (req, res) => {
    try {
      await storage.deleteJourneyMilestone(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting journey milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Portfolio Projects CRUD
  app.get("/api/admin/work", verifyToken, async (req, res) => {
    try {
      const projects = await storage.getPortfolioProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching portfolio projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/work", verifyToken, async (req, res) => {
    try {
      const project = insertPortfolioProjectSchema.parse(req.body);
      const newProject = await storage.createPortfolioProject(project);
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating portfolio project:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/admin/work/:id", verifyToken, async (req, res) => {
    try {
      const project = insertPortfolioProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updatePortfolioProject(req.params.id, project);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating portfolio project:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/admin/work/:id", verifyToken, async (req, res) => {
    try {
      await storage.deletePortfolioProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting portfolio project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact Info
  app.get("/api/admin/contact-info", verifyToken, async (req, res) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/contact-info", verifyToken, async (req, res) => {
    try {
      const infoUpdate = updateContactInfoSchema.parse(req.body);
      const info = await storage.updateContactInfo(infoUpdate);
      res.json(info);
    } catch (error) {
      console.error("Error updating contact info:", error);
      res.status(400).json({ message: "Invalid contact info data" });
    }
  });

  // Contact Submissions
  app.get("/api/admin/contact-submissions", verifyToken, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/contact-submissions/:id/read", verifyToken, async (req, res) => {
    try {
      await storage.markContactSubmissionAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking submission as read:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
