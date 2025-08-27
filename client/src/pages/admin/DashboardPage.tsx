import { Container, Title, Grid, Card, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, Settings, Briefcase, MapPin, 
  MessageSquare, Palette, TrendingUp, Mail 
} from "lucide-react";
import { useContactSubmissions, useTeamMembers, useServices, usePortfolioProjects } from "../../hooks/useAdminData";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: submissions = [] } = useContactSubmissions();
  const { data: teamMembers = [] } = useTeamMembers();
  const { data: services = [] } = useServices();
  const { data: projects = [] } = usePortfolioProjects();

  const unreadSubmissions = submissions.filter(s => !s.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const stats = [
    { title: "Team Members", value: teamMembers.length, icon: Users, color: "blue" },
    { title: "Services", value: services.length, icon: Briefcase, color: "green" },
    { title: "Portfolio Projects", value: projects.length, icon: TrendingUp, color: "purple" },
    { title: "Unread Messages", value: unreadSubmissions, icon: MessageSquare, color: "red" },
  ];

  const quickActions = [
    { title: "Theme Settings", description: "Customize colors and styling", link: "/admin/theme", icon: Palette },
    { title: "Team Management", description: "Manage team members", link: "/admin/team", icon: Users },
    { title: "Services", description: "Edit service offerings", link: "/admin/services", icon: Settings },
    { title: "Journey Timeline", description: "Update company milestones", link: "/admin/journey", icon: MapPin },
    { title: "Portfolio", description: "Showcase your work", link: "/admin/work", icon: Briefcase },
    { title: "Contact Messages", description: "View customer inquiries", link: "/admin/contact-submissions", icon: Mail },
  ];

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} mb="xs">Welcome back, {user?.email}</Title>
          <Text c="dimmed">Manage your Vivida website content and settings</Text>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="logout-button">
          Logout
        </Button>
      </Group>

      {/* Stats Grid */}
      <Grid mb="xl">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="xl" radius="md" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      {stat.title}
                    </Text>
                    <Text fw={700} size="xl">
                      {stat.value}
                    </Text>
                  </div>
                  <Icon size={24} color={`var(--mantine-color-${stat.color}-6)`} />
                </Group>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>

      {/* Quick Actions */}
      <Title order={2} mb="md">Quick Actions</Title>
      <Grid>
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Card 
                withBorder 
                p="lg" 
                radius="md" 
                component={Link} 
                to={action.link}
                style={{ textDecoration: 'none', color: 'inherit' }}
                className="hover:shadow-md transition-shadow"
                data-testid={`action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Stack gap="md">
                  <Group>
                    <Icon size={24} color="var(--mantine-color-blue-6)" />
                    <Text fw={600}>{action.title}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {action.description}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
}
