import { useState } from "react";
import { 
  Container, Title, Button, Group, Table, ActionIcon, Modal, 
  TextInput, Textarea, NumberInput, Stack, Text, Card 
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Users } from "lucide-react";
import { 
  useTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember 
} from "../../hooks/useAdminData";
import type { InsertTeamMember, TeamMember } from "@shared/schema";

export default function TeamManagement() {
  const [opened, setOpened] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  const { data: members = [], isLoading } = useTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const form = useForm<InsertTeamMember>({
    initialValues: {
      name: "",
      title: "",
      bio: "",
      imageUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      order: 0,
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must be at least 2 characters" : null),
      title: (value) => (value.length < 2 ? "Title must be at least 2 characters" : null),
      bio: (value) => (value.length < 10 ? "Bio must be at least 10 characters" : null),
    },
  });

  const handleSubmit = async (values: InsertTeamMember) => {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember.id, member: values });
        notifications.show({
          title: "Success",
          message: "Team member updated successfully!",
          color: "green",
        });
      } else {
        await createMember.mutateAsync(values);
        notifications.show({
          title: "Success", 
          message: "Team member created successfully!",
          color: "green",
        });
      }
      setOpened(false);
      setEditingMember(null);
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save team member. Please try again.",
        color: "red",
      });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.setValues({
      name: member.name,
      title: member.title,
      bio: member.bio,
      imageUrl: member.imageUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      githubUrl: member.githubUrl || "",
      order: member.order,
    });
    setOpened(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteMember.mutateAsync(id);
        notifications.show({
          title: "Success",
          message: "Team member deleted successfully!",
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to delete team member. Please try again.",
          color: "red",
        });
      }
    }
  };

  const handleNewMember = () => {
    setEditingMember(null);
    form.reset();
    setOpened(true);
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Group>
          <Button component={Link} to="/admin/dashboard" variant="subtle" leftSection={<ArrowLeft size={16} />}>
            Back to Dashboard
          </Button>
          <Title order={1}>Team Management</Title>
        </Group>
        <Button leftSection={<Plus size={16} />} onClick={handleNewMember} data-testid="button-add-member">
          Add Team Member
        </Button>
      </Group>

      {/* Team Members Table */}
      <Card withBorder>
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <Text size="lg" fw={500} mb="xs">No team members yet</Text>
            <Text c="dimmed" mb="lg">Add your first team member to get started</Text>
            <Button leftSection={<Plus size={16} />} onClick={handleNewMember}>
              Add Team Member
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Bio</Table.Th>
                <Table.Th>Order</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {members.map((member) => (
                <Table.Tr key={member.id} data-testid={`member-row-${member.id}`}>
                  <Table.Td>
                    <Text fw={500}>{member.name}</Text>
                  </Table.Td>
                  <Table.Td>{member.title}</Table.Td>
                  <Table.Td>
                    <Text lineClamp={2} maw={300}>
                      {member.bio}
                    </Text>
                  </Table.Td>
                  <Table.Td>{member.order}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(member)}
                        data-testid={`button-edit-${member.id}`}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(member.id)}
                        data-testid={`button-delete-${member.id}`}
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setEditingMember(null);
          form.reset();
        }}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        size="lg"
        data-testid="team-member-modal"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Full name"
              required
              {...form.getInputProps("name")}
              data-testid="input-name"
            />
            <TextInput
              label="Title"
              placeholder="Job title or role"
              required
              {...form.getInputProps("title")}
              data-testid="input-title"
            />
            <Textarea
              label="Bio"
              placeholder="Brief description or biography"
              required
              minRows={3}
              {...form.getInputProps("bio")}
              data-testid="input-bio"
            />
            <TextInput
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              {...form.getInputProps("imageUrl")}
              data-testid="input-image-url"
            />
            <TextInput
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              {...form.getInputProps("linkedinUrl")}
              data-testid="input-linkedin-url"
            />
            <TextInput
              label="GitHub URL"
              placeholder="https://github.com/..."
              {...form.getInputProps("githubUrl")}
              data-testid="input-github-url"
            />
            <NumberInput
              label="Display Order"
              description="Lower numbers appear first"
              min={0}
              {...form.getInputProps("order")}
              data-testid="input-order"
            />
            <Group justify="flex-end" gap="sm">
              <Button
                variant="subtle"
                onClick={() => {
                  setOpened(false);
                  setEditingMember(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMember.isPending || updateMember.isPending}
                data-testid="button-save-member"
              >
                {editingMember ? "Update" : "Create"} Team Member
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
