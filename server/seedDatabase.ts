import { storage } from "./storage";
import bcrypt from "bcrypt";
import { 
  defaultTheme, defaultContactInfo, teamMembers, 
  services, journeyMilestones, portfolioProjects 
} from "../client/src/data/seedData";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if data already exists to avoid duplicates
    const existingServices = await storage.getServices();
    if (existingServices.length > 0) {
      console.log("ℹ️ Database already seeded, skipping...");
      return;
    }

    // Create admin user
    console.log("👤 Creating admin user...");
    const existingUser = await storage.getUserByEmail("vividatech@gmail.com");
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("uditarjun@vivida2025", 10);
      await storage.createUser({
        email: "vividatech@gmail.com",
        password: hashedPassword,
      });
      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    // Set default theme
    console.log("🎨 Setting up default theme...");
    await storage.updateSiteTheme(defaultTheme);
    console.log("✅ Default theme set");

    // Set default contact info
    console.log("📞 Setting up contact information...");
    await storage.updateContactInfo(defaultContactInfo);
    console.log("✅ Contact information set");

    // Create team members
    console.log("👥 Creating team members...");
    for (const member of teamMembers) {
      await storage.createTeamMember(member);
    }
    console.log(`✅ Created ${teamMembers.length} team members`);

    // Create services
    console.log("⚙️ Creating services...");
    for (const service of services) {
      await storage.createService(service);
    }
    console.log(`✅ Created ${services.length} services`);

    // Create journey milestones
    console.log("🗺️ Creating journey milestones...");
    for (const milestone of journeyMilestones) {
      await storage.createJourneyMilestone(milestone);
    }
    console.log(`✅ Created ${journeyMilestones.length} journey milestones`);

    // Create portfolio projects
    console.log("💼 Creating portfolio projects...");
    for (const project of portfolioProjects) {
      await storage.createPortfolioProject(project);
    }
    console.log(`✅ Created ${portfolioProjects.length} portfolio projects`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("🏁 Seeding script finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding script failed:", error);
      process.exit(1);
    });
}
