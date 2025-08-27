import { useQuery } from "@tanstack/react-query";
import type { 
  SiteTheme, TeamMember, Service, JourneyMilestone, 
  PortfolioProject, ContactInfo 
} from "@shared/schema";

interface PublicContent {
  theme: SiteTheme;
  teamMembers: TeamMember[];
  services: Service[];
  journeyMilestones: JourneyMilestone[];
  portfolioProjects: PortfolioProject[];
  contactInfo: ContactInfo;
}

export function usePublicContent() {
  return useQuery<PublicContent>({
    queryKey: ["/api/public-content"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
