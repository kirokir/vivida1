import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { 
  SiteTheme, TeamMember, Service, JourneyMilestone, 
  PortfolioProject, ContactInfo, ContactSubmission,
  InsertTeamMember, InsertService, InsertJourneyMilestone,
  InsertPortfolioProject, UpdateSiteTheme, UpdateContactInfo
} from "@shared/schema";

// Auth header helper
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Site Theme
export function useSiteTheme() {
  return useQuery<SiteTheme>({
    queryKey: ["/api/admin/theme"],
    queryFn: async () => {
      const response = await fetch("/api/admin/theme", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch theme");
      return response.json();
    },
  });
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (theme: UpdateSiteTheme) => {
      const response = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(theme),
      });
      if (!response.ok) throw new Error("Failed to update theme");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/theme"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

// Team Members
export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: ["/api/admin/team-members"],
    queryFn: async () => {
      const response = await fetch("/api/admin/team-members", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch team members");
      return response.json();
    },
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (member: InsertTeamMember) => {
      const response = await fetch("/api/admin/team-members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(member),
      });
      if (!response.ok) throw new Error("Failed to create team member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, member }: { id: string; member: Partial<InsertTeamMember> }) => {
      const response = await fetch(`/api/admin/team-members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(member),
      });
      if (!response.ok) throw new Error("Failed to update team member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/team-members/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete team member");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

// Services
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/services", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: InsertService) => {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, service }: { id: string; service: Partial<InsertService> }) => {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete service");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

// Journey Milestones
export function useJourneyMilestones() {
  return useQuery<JourneyMilestone[]>({
    queryKey: ["/api/admin/journey"],
    queryFn: async () => {
      const response = await fetch("/api/admin/journey", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch journey milestones");
      return response.json();
    },
  });
}

export function useCreateJourneyMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (milestone: InsertJourneyMilestone) => {
      const response = await fetch("/api/admin/journey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(milestone),
      });
      if (!response.ok) throw new Error("Failed to create journey milestone");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/journey"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useUpdateJourneyMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, milestone }: { id: string; milestone: Partial<InsertJourneyMilestone> }) => {
      const response = await fetch(`/api/admin/journey/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(milestone),
      });
      if (!response.ok) throw new Error("Failed to update journey milestone");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/journey"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useDeleteJourneyMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/journey/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete journey milestone");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/journey"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

// Portfolio Projects
export function usePortfolioProjects() {
  return useQuery<PortfolioProject[]>({
    queryKey: ["/api/admin/work"],
    queryFn: async () => {
      const response = await fetch("/api/admin/work", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch portfolio projects");
      return response.json();
    },
  });
}

export function useCreatePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: InsertPortfolioProject) => {
      const response = await fetch("/api/admin/work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error("Failed to create portfolio project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useUpdatePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, project }: { id: string; project: Partial<InsertPortfolioProject> }) => {
      const response = await fetch(`/api/admin/work/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error("Failed to update portfolio project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

export function useDeletePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/work/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete portfolio project");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public-content"] });
    },
  });
}

// Contact Submissions
export function useContactSubmissions() {
  return useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"],
    queryFn: async () => {
      const response = await fetch("/api/admin/contact-submissions", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch contact submissions");
      return response.json();
    },
  });
}

export function useMarkSubmissionAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/contact-submissions/${id}/read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to mark submission as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions"] });
    },
  });
}
