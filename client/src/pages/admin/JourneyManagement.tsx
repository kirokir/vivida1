import { useState } from "react";
import { 
  Container, Title, Button, Group, Table, ActionIcon, Modal, 
  TextInput, Textarea, NumberInput, Stack, Text, Card 
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { 
  useJourneyMilestones, useCreateJourneyMilestone, useUpdateJourneyMilestone, useDeleteJourneyMilestone 
} from "../../hooks/useAdminData";
import type { InsertJourneyMilestone, JourneyMilestone } from "@shared/schema";

export default function JourneyManagement() {
  const [opened, setOpened] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<JourneyMilestone | null>(null);
  
  const { data: milestones = [], isLoading } = useJourneyMilestones();
  const createMilestone = useCreateJourneyMilestone();
  const updateMilestone = useUpdateJourneyMilestone();
  const deleteMilestone = useDeleteJourneyMilestone();

  const form = useForm<InsertJourneyMilestone>({
    initialValues: {
      year: "",
      title: "",
      caption: "",
      content: "",
      iconSvgPath: "",
      order: 0,
    },
    validate: {
      year: (value) => (value.length < 4 ? "Year must be at least 4 characters" : null),
      title: (value) => (value.length < 2 ? "Title must be at least 2 characters" : null),
      caption: (value) => (value.length < 10 ? "Caption must be at least 10 characters" : null),
      content: (value) => (value.length < 50 ? "Content must be at least 50 characters" : null),
    },
  });

  const handleSubmit = async (values: InsertJourneyMilestone) => {
    try {
      if (editingMilestone) {
        await updateMilestone.mutateAsync({ id: editingMilestone.id, milestone: values });
        notifications.show({
          title: "Success",
          message: "Journey milestone updated successfully!",
          color: "green",
        });
      } else {
        await createMilestone.mutateAsync(values);
        notifications.show({
          title: "Success", 
          message: "Journey milestone created successfully!",
          color: "green",
        });
      }
      setOpened(false);
      setEditingMilestone(null);
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save journey milestone. Please try again.",
        color: "red",
      });
    }
  };

  const handleEdit = (milestone: JourneyMilestone) => {
    setEditingMilestone(milestone);
    form.setValues({
      year: milestone.year,
      title: milestone.title,
      caption: milestone.caption,
      content: milestone.content,
      iconSvgPath: milestone.iconSvgPath,
      order: milestone.order,
    });
    setOpened(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this journey milestone?")) {
      try {
        await deleteMilestone.mutateAsync(id);
        notifications.show({
          title: "Success",
          message: "Journey milestone deleted successfully!",
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to delete journey milestone. Please try again.",
          color: "red",
        });
      }
    }
  };

  const handleNewMilestone = () => {
    setEditingMilestone(null);
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
          <Title order={1}>Journey Timeline</Title>
        </Group>
        <Button leftSection={<Plus size={16} />} onClick={handleNewMilestone} data-testid="button-add-milestone">
          Add Milestone
        </Button>
      </Group>

      {/* Milestones Table */}
      <Card withBorder>
        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <Text size="lg" fw={500} mb="xs">No journey milestones yet</Text>
            <Text c="dimmed" mb="lg">Add your first milestone to get started</Text>
            <Button leftSection={<Plus size={16} />} onClick={handleNewMilestone}>
              Add Milestone
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Year</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Caption</Table.Th>
                <Table.Th>Order</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {milestones.map((milestone) => (
                <Table.Tr key={milestone.id} data-testid={`milestone-row-${milestone.id}`}>
                  <Table.Td>
                    <Text fw={500}>{milestone.year}</Text>
                  </Table.Td>
                  <Table.Td>{milestone.title}</Table.Td>
                  <Table.Td>
                    <Text lineClamp={2} maw={300}>
                      {milestone.caption}
                    </Text>
                  </Table.Td>
                  <Table.Td>{milestone.order}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(milestone)}
                        data-testid={`button-edit-${milestone.id}`}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(milestone.id)}
                        data-testid={`button-delete-${milestone.id}`}
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
          setEditingMilestone(null);
          form.reset();
        }}
        title={editingMilestone ? "Edit Journey Milestone" : "Add Journey Milestone"}
        size="xl"
        data-testid="milestone-modal"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Year"
                placeholder="2025"
                required
                {...form.getInputProps("year")}
                data-testid="input-year"
              />
              <TextInput
                label="Title"
                placeholder="Milestone title"
                required
                {...form.getInputProps("title")}
                data-testid="input-title"
              />
            </Group>
            <Textarea
              label="Caption"
              placeholder="Brief description for the timeline"
              required
              minRows={2}
              {...form.getInputProps("caption")}
              data-testid="input-caption"
            />
            <Textarea
              label="Content"
              placeholder="Full blog post content (HTML supported)"
              description="This will be displayed on the detailed blog post page"
              required
              minRows={6}
              {...form.getInputProps("content")}
              data-testid="input-content"
            />
            <TextInput
              label="Icon SVG Path"
              placeholder="SVG path or icon identifier"
              description="You can use FontAwesome class names (e.g., 'fas fa-rocket') or SVG paths"
              {...form.getInputProps("iconSvgPath")}
              data-testid="input-icon-path"
            />
            <NumberInput
              label="Display Order"
              description="Lower numbers appear first in the timeline"
              min={0}
              {...form.getInputProps("order")}
              data-testid="input-order"
            />
            <Group justify="flex-end" gap="sm">
              <Button
                variant="subtle"
                onClick={() => {
                  setOpened(false);
                  setEditingMilestone(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMilestone.isPending || updateMilestone.isPending}
                data-testid="button-save-milestone"
              >
                {editingMilestone ? "Update" : "Create"} Milestone
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
