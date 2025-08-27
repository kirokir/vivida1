import type { 
  InsertTeamMember, InsertService, InsertJourneyMilestone, 
  InsertPortfolioProject, UpdateSiteTheme, UpdateContactInfo 
} from "@shared/schema";

export const defaultTheme: UpdateSiteTheme = {
  primaryColor: "#e11d48",
  buttonStyle: "rounded-lg",
  fontHeadline: "Anton",
  fontBody: "Inter",
};

export const defaultContactInfo: UpdateContactInfo = {
  email: "hello@vivida.tech",
  phone: "+1 (234) 567-8900",
  officeLocation: "San Francisco, California",
};

export const teamMembers: InsertTeamMember[] = [
  {
    name: "Arjun Jayesh",
    title: "Co-founder & CEO",
    bio: "Visionary leader with expertise in scaling technology companies. Passionate about creating products that make a real difference in people's lives. Previously led engineering teams at Fortune 500 companies.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    linkedinUrl: "https://linkedin.com/in/arjunjayesh",
    githubUrl: "https://github.com/arjunjayesh",
    order: 0,
  },
  {
    name: "Udith Sreejith",
    title: "Co-founder & CTO",
    bio: "Technical architect with deep expertise in modern web technologies and scalable systems. Committed to writing clean, efficient code and building robust technical foundations. Open source contributor and technology evangelist.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    linkedinUrl: "https://linkedin.com/in/udithsreejith",
    githubUrl: "https://github.com/udithsreejith",
    order: 1,
  },
];

export const services: InsertService[] = [
  {
    title: "Development",
    description: "Custom web applications built with modern technologies and best practices.",
    iconSvgPath: "fas fa-code",
    order: 0,
  },
  {
    title: "Design",
    description: "User-centered design solutions that create exceptional digital experiences.",
    iconSvgPath: "fas fa-palette",
    order: 1,
  },
  {
    title: "Mobile",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    iconSvgPath: "fas fa-mobile-alt",
    order: 2,
  },
  {
    title: "Cloud",
    description: "Scalable cloud infrastructure and deployment solutions for modern applications.",
    iconSvgPath: "fas fa-cloud",
    order: 3,
  },
  {
    title: "Analytics",
    description: "Data-driven insights and analytics to optimize your digital presence.",
    iconSvgPath: "fas fa-chart-line",
    order: 4,
  },
];

export const journeyMilestones: InsertJourneyMilestone[] = [
  {
    year: "2025",
    title: "Company Founded",
    caption: "The beginning of our technology journey",
    content: `
      <p>The beginning of our journey started with a simple yet powerful vision: to create technology solutions that make a real difference in how businesses operate and grow.</p>
      <p>Founded by Arjun Jayesh and Udith Sreejith, Vivida represents the culmination of years of experience in the technology sector, combined with a fresh perspective on what modern digital solutions should look like.</p>
      <h3>Our Founding Principles</h3>
      <ul>
        <li><strong>User-Centric Design:</strong> Every solution we create puts the end user at the center of the design process.</li>
        <li><strong>Technical Excellence:</strong> We believe in using the latest technologies and best practices to deliver robust, scalable solutions.</li>
        <li><strong>Collaborative Approach:</strong> We work closely with our clients as partners, not just service providers.</li>
      </ul>
      <p>As we embark on this exciting journey, we're committed to building not just a company, but a community of innovators, creators, and problem-solvers who share our passion for excellence.</p>
    `,
    iconSvgPath: "fas fa-rocket",
    order: 0,
  },
  {
    year: "Q2 2025",
    title: "First Client",
    caption: "Secured our inaugural project partnership",
    content: `
      <p>Securing our first client was a pivotal moment that validated our approach and set the foundation for everything that followed.</p>
      <p>This milestone represented more than just a business transaction—it was the beginning of a partnership that would help shape our service offerings and refine our delivery methodology.</p>
      <h3>Key Learnings</h3>
      <ul>
        <li><strong>Client Collaboration:</strong> Deep engagement with stakeholders leads to better outcomes</li>
        <li><strong>Agile Delivery:</strong> Iterative development ensures alignment with client expectations</li>
        <li><strong>Quality Focus:</strong> Attention to detail differentiates exceptional work from good work</li>
      </ul>
    `,
    iconSvgPath: "fas fa-users",
    order: 1,
  },
  {
    year: "Q4 2025",
    title: "Product Launch",
    caption: "Launched our flagship platform solution",
    content: `
      <p>The launch of our flagship platform marked a significant achievement in our technical capabilities and market positioning.</p>
      <p>This comprehensive solution demonstrated our ability to deliver complex, scalable applications that serve real business needs.</p>
      <h3>Platform Features</h3>
      <ul>
        <li><strong>Scalable Architecture:</strong> Built to handle growth and changing requirements</li>
        <li><strong>User Experience:</strong> Intuitive interface designed for maximum productivity</li>
        <li><strong>Integration Ready:</strong> Seamless connectivity with existing business systems</li>
      </ul>
    `,
    iconSvgPath: "fas fa-award",
    order: 2,
  },
  {
    year: "2026",
    title: "Scale & Growth",
    caption: "Expanding our team and market reach",
    content: `
      <p>Our growth phase focuses on expanding our team, capabilities, and market reach while maintaining the quality standards that define our brand.</p>
      <p>This expansion is strategic, driven by client demand and market opportunities that align with our core strengths.</p>
      <h3>Growth Strategy</h3>
      <ul>
        <li><strong>Team Expansion:</strong> Adding specialized talent to enhance our capabilities</li>
        <li><strong>Service Diversification:</strong> Exploring new technology domains and service offerings</li>
        <li><strong>Market Presence:</strong> Building relationships and establishing thought leadership</li>
      </ul>
    `,
    iconSvgPath: "fas fa-expand-arrows-alt",
    order: 3,
  },
];

export const portfolioProjects: InsertPortfolioProject[] = [
  {
    title: "SaaS Analytics Platform",
    description: "Comprehensive analytics dashboard for business intelligence and data visualization.",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    tags: ["React", "TypeScript", "Chart.js"],
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/vivida/analytics-platform",
    order: 0,
  },
  {
    title: "E-commerce Mobile App",
    description: "Modern shopping experience with seamless checkout and personalized recommendations.",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
    tags: ["React Native", "Node.js", "Stripe"],
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/vivida/ecommerce-app",
    order: 1,
  },
  {
    title: "AI-Powered CRM System",
    description: "Intelligent customer relationship management with predictive analytics.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350",
    tags: ["Python", "TensorFlow", "PostgreSQL"],
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/vivida/ai-crm",
    order: 2,
  },
  {
    title: "Project Management Platform",
    description: "Collaborative workspace for teams with advanced project tracking and reporting.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=450",
    tags: ["Vue.js", "Express", "MongoDB"],
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/vivida/project-manager",
    order: 3,
  },
  {
    title: "FinTech Trading Platform",
    description: "Real-time trading interface with advanced charting and portfolio management.",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=380",
    tags: ["Angular", "WebSocket", "D3.js"],
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/vivida/trading-platform",
    order: 4,
  },
  {
    title: "Healthcare Management System",
    description: "Comprehensive patient management with telemedicine capabilities and secure data handling.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    tags: ["React", "HIPAA", "AWS"],
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/vivida/healthcare-system",
    order: 5,
  },
];
