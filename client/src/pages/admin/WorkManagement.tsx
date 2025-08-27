import { useState } from "react";
import { 
  Container, Title, Button, Group, Table, ActionIcon, Modal, 
  TextInput, Textarea, NumberInput, Stack, Text, Card, TagsInput 
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { 
  usePortfolioProjects, useCreatePortfolioProject, useUpdatePortfolioProject, useDeletePortfolioProject 
} from "../../hooks/useAdminData";
import type { InsertPortfolioProject, PortfolioProject } from "@shared/schema";

export default function WorkManagement() {
  const [opened, setOpened] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  
  const { data: projects = [], isLoading } = usePortfolioProjects();
  const createProject = useCreatePortfolioProject();
  const updateProject = useUpdatePortfolioProject();
  const deleteProject = useDeletePortfolioProject();

  const form = useForm<InsertPortfolioProject>({
    initialValues: {
      title: "",
      description: "",
      imageUrl: "",
      tags: [],
      projectUrl: "",
      githubUrl: "",
      order: 0,
    },
    validate: {
      title: (value) => (value.length < 2 ? "Title must be at least 2 characters" : null),
      description: (value) => (value.length < 10 ? "Description must be at least 10 characters" : null),
      imageUrl: (value) => (value.length < 10 ? "Image URL is required" : null),
    },
  });

  const handleSubmit = async (values: InsertPortfolioProject) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, project: values });
        notifications.show({
          title: "Success",
          message: "Project updated successfully!",
          color: "green",
        });
      } else {
        await createProject.mutateAsync(values);
        notifications.show({
          title: "Success", 
          message: "Project created successfully!",
          color: "green",
        });
      }
      setOpened(false);
      setEditingProject(null);
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save project. Please try again.",
        color: "red",
      });
    }
  };

  const handleEdit = (project: PortfolioProject) => {
    setEditingProject(project);
    form.setValues({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      tags: project.tags,
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      order: project.order,
    });
    setOpened(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject.mutateAsync(id);
        notifications.show({
          title: "Success",
          message: "Project deleted successfully!",
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to delete project. Please try again.",
          color: "red",
        });
      }
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
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
          <Title order={1}>Portfolio Management</Title>
        </Group>
        <Button leftSection={<Plus size={16} />} onClick={handleNewProject} data-testid="button-add-project">
          Add Project
        </Button>
      </Group>

      {/* Projects Table */}
      <Card withBorder>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <Text size="lg" fw={500} mb="xs">No projects yet</Text>
            <Text c="dimmed" mb="lg">Add your first project to get started</Text>
            <Button leftSection={<Plus size={16} />} onClick={handleNewProject}>
              Add Project
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Tags</Table.Th>
                <Table.Th>Order</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {projects.map((project) => (
                <Table.Tr key={project.id} data-testid={`project-row-${project.id}`}>
                  <Table.Td>
                    <Text fw={500}>{project.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text lineClamp={2} maw={300}>
                      {project.description}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <Text key={index} size="xs" c="dimmed" style={{ 
                          backgroundColor: 'var(--mantine-color-gray-1)', 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          {tag}
                        </Text>
                      ))}
                      {project.tags.length > 3 && (
                        <Text size="xs" c="dimmed">+{project.tags.length - 3}</Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>{project.order}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(project)}
                        data-testid={`button-edit-${project.id}`}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(project.id)}
                        data-testid={`button-delete-${project.id}`}
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
          setEditingProject(null);
          form.reset();
        }}
        title={editingProject ? "Edit Project" : "Add Project"}
        size="xl"
        data-testid="project-modal"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Project name"
              required
              {...form.getInputProps("title")}
              data-testid="input-title"
            />
            <Textarea
              label="Description"
              placeholder="Brief description of the project"
              required
              minRows={3}
              {...form.getInputProps("description")}
              data-testid="input-description"
            />
            <TextInput
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              description="URL to the project preview image"
              required
              {...form.getInputProps("imageUrl")}
              data-testid="input-image-url"
            />
            <TagsInput
              label="Tags"
              placeholder="Add technology tags"
              description="Press Enter to add each tag"
              {...form.getInputProps("tags")}
              data-testid="input-tags"
            />
            <Group grow>
              <TextInput
                label="Project URL"
                placeholder="https://example.com"
                description="Link to the live project"
                {...form.getInputProps("projectUrl")}
                data-testid="input-project-url"
              />
              <TextInput
                label="GitHub URL"
                placeholder="https://github.com/..."
                description="Link to the source code"
                {...form.getInputProps("githubUrl")}
                data-testid="input-github-url"
              />
            </Group>
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
                  setEditingProject(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createProject.isPending || updateProject.isPending}
                data-testid="button-save-project"
              >
                {editingProject ? "Update" : "Create"} Project
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
