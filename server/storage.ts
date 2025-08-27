import { 
  users, teamMembers, services, journeyMilestones, portfolioProjects, 
  contactInfo, contactSubmissions, siteTheme,
  type User, type InsertUser, type TeamMember, type InsertTeamMember,
  type Service, type InsertService, type JourneyMilestone, type InsertJourneyMilestone,
  type PortfolioProject, type InsertPortfolioProject, type ContactInfo, type UpdateContactInfo,
  type ContactSubmission, type InsertContactSubmission, type SiteTheme, type UpdateSiteTheme
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Public content
  getPublicContent(): Promise<{
    theme: SiteTheme;
    teamMembers: TeamMember[];
    services: Service[];
    journeyMilestones: JourneyMilestone[];
    portfolioProjects: PortfolioProject[];
    contactInfo: ContactInfo;
  }>;

  // Site Theme
  getSiteTheme(): Promise<SiteTheme>;
  updateSiteTheme(theme: UpdateSiteTheme): Promise<SiteTheme>;

  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<void>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Journey Milestones
  getJourneyMilestones(): Promise<JourneyMilestone[]>;
  getJourneyMilestone(id: string): Promise<JourneyMilestone | undefined>;
  createJourneyMilestone(milestone: InsertJourneyMilestone): Promise<JourneyMilestone>;
  updateJourneyMilestone(id: string, milestone: Partial<InsertJourneyMilestone>): Promise<JourneyMilestone>;
  deleteJourneyMilestone(id: string): Promise<void>;

  // Portfolio Projects
  getPortfolioProjects(): Promise<PortfolioProject[]>;
  getPortfolioProject(id: string): Promise<PortfolioProject | undefined>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: string): Promise<void>;

  // Contact Info
  getContactInfo(): Promise<ContactInfo>;
  updateContactInfo(info: UpdateContactInfo): Promise<ContactInfo>;

  // Contact Submissions
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  markContactSubmissionAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPublicContent() {
    const [theme, teamMembersList, servicesList, milestonesList, projectsList, contactInfoData] = await Promise.all([
      this.getSiteTheme(),
      this.getTeamMembers(),
      this.getServices(),
      this.getJourneyMilestones(),
      this.getPortfolioProjects(),
      this.getContactInfo(),
    ]);

    return {
      theme,
      teamMembers: teamMembersList,
      services: servicesList,
      journeyMilestones: milestonesList,
      portfolioProjects: projectsList,
      contactInfo: contactInfoData,
    };
  }

  async getSiteTheme(): Promise<SiteTheme> {
    const [theme] = await db.select().from(siteTheme).limit(1);
    if (!theme) {
      // Create default theme
      const [newTheme] = await db.insert(siteTheme).values({}).returning();
      return newTheme;
    }
    return theme;
  }

  async updateSiteTheme(themeUpdate: UpdateSiteTheme): Promise<SiteTheme> {
    const [theme] = await db.update(siteTheme).set({
      ...themeUpdate,
      updatedAt: new Date(),
    }).where(eq(siteTheme.id, 1)).returning();
    return theme;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers).orderBy(asc(teamMembers.order));
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member || undefined;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }

  async updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updatedMember] = await db.update(teamMembers).set({
      ...member,
      updatedAt: new Date(),
    }).where(eq(teamMembers.id, id)).returning();
    return updatedMember;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async getServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(asc(services.order));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db.update(services).set({
      ...service,
      updatedAt: new Date(),
    }).where(eq(services.id, id)).returning();
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getJourneyMilestones(): Promise<JourneyMilestone[]> {
    return db.select().from(journeyMilestones).orderBy(asc(journeyMilestones.order));
  }

  async getJourneyMilestone(id: string): Promise<JourneyMilestone | undefined> {
    const [milestone] = await db.select().from(journeyMilestones).where(eq(journeyMilestones.id, id));
    return milestone || undefined;
  }

  async createJourneyMilestone(milestone: InsertJourneyMilestone): Promise<JourneyMilestone> {
    const [newMilestone] = await db.insert(journeyMilestones).values(milestone).returning();
    return newMilestone;
  }

  async updateJourneyMilestone(id: string, milestone: Partial<InsertJourneyMilestone>): Promise<JourneyMilestone> {
    const [updatedMilestone] = await db.update(journeyMilestones).set({
      ...milestone,
      updatedAt: new Date(),
    }).where(eq(journeyMilestones.id, id)).returning();
    return updatedMilestone;
  }

  async deleteJourneyMilestone(id: string): Promise<void> {
    await db.delete(journeyMilestones).where(eq(journeyMilestones.id, id));
  }

  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    return db.select().from(portfolioProjects).orderBy(asc(portfolioProjects.order));
  }

  async getPortfolioProject(id: string): Promise<PortfolioProject | undefined> {
    const [project] = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id));
    return project || undefined;
  }

  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const [newProject] = await db.insert(portfolioProjects).values(project).returning();
    return newProject;
  }

  async updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const [updatedProject] = await db.update(portfolioProjects).set({
      ...project,
      updatedAt: new Date(),
    }).where(eq(portfolioProjects.id, id)).returning();
    return updatedProject;
  }

  async deletePortfolioProject(id: string): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }

  async getContactInfo(): Promise<ContactInfo> {
    const [info] = await db.select().from(contactInfo).limit(1);
    if (!info) {
      // Create default contact info
      const [newInfo] = await db.insert(contactInfo).values({}).returning();
      return newInfo;
    }
    return info;
  }

  async updateContactInfo(infoUpdate: UpdateContactInfo): Promise<ContactInfo> {
    const [info] = await db.update(contactInfo).set({
      ...infoUpdate,
      updatedAt: new Date(),
    }).where(eq(contactInfo.id, 1)).returning();
    return info;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(asc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  async markContactSubmissionAsRead(id: string): Promise<void> {
    await db.update(contactSubmissions).set({
      isRead: true,
      updatedAt: new Date(),
    }).where(eq(contactSubmissions.id, id));
  }
}

export const storage = new DatabaseStorage();
