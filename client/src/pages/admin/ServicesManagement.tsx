import { useState } from "react";
import { 
  Container, Title, Button, Group, Table, ActionIcon, Modal, 
  TextInput, Textarea, NumberInput, Stack, Text, Card 
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Settings } from "lucide-react";
import { 
  useServices, useCreateService, useUpdateService, useDeleteService 
} from "../../hooks/useAdminData";
import type { InsertService, Service } from "@shared/schema";

export default function ServicesManagement() {
  const [opened, setOpened] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const form = useForm<InsertService>({
    initialValues: {
      title: "",
      description: "",
      iconSvgPath: "",
      order: 0,
    },
    validate: {
      title: (value) => (value.length < 2 ? "Title must be at least 2 characters" : null),
      description: (value) => (value.length < 10 ? "Description must be at least 10 characters" : null),
    },
  });

  const handleSubmit = async (values: InsertService) => {
    try {
      if (editingService) {
        await updateService.mutateAsync({ id: editingService.id, service: values });
        notifications.show({
          title: "Success",
          message: "Service updated successfully!",
          color: "green",
        });
      } else {
        await createService.mutateAsync(values);
        notifications.show({
          title: "Success", 
          message: "Service created successfully!",
          color: "green",
        });
      }
      setOpened(false);
      setEditingService(null);
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save service. Please try again.",
        color: "red",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.setValues({
      title: service.title,
      description: service.description,
      iconSvgPath: service.iconSvgPath,
      order: service.order,
    });
    setOpened(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService.mutateAsync(id);
        notifications.show({
          title: "Success",
          message: "Service deleted successfully!",
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to delete service. Please try again.",
          color: "red",
        });
      }
    }
  };

  const handleNewService = () => {
    setEditingService(null);
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
          <Title order={1}>Services Management</Title>
        </Group>
        <Button leftSection={<Plus size={16} />} onClick={handleNewService} data-testid="button-add-service">
          Add Service
        </Button>
      </Group>

      {/* Services Table */}
      <Card withBorder>
        {services.length === 0 ? (
          <div className="text-center py-12">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <Text size="lg" fw={500} mb="xs">No services yet</Text>
            <Text c="dimmed" mb="lg">Add your first service to get started</Text>
            <Button leftSection={<Plus size={16} />} onClick={handleNewService}>
              Add Service
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Order</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {services.map((service) => (
                <Table.Tr key={service.id} data-testid={`service-row-${service.id}`}>
                  <Table.Td>
                    <Text fw={500}>{service.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text lineClamp={2} maw={400}>
                      {service.description}
                    </Text>
                  </Table.Td>
                  <Table.Td>{service.order}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(service)}
                        data-testid={`button-edit-${service.id}`}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(service.id)}
                        data-testid={`button-delete-${service.id}`}
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
          setEditingService(null);
          form.reset();
        }}
        title={editingService ? "Edit Service" : "Add Service"}
        size="lg"
        data-testid="service-modal"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Service name"
              required
              {...form.getInputProps("title")}
              data-testid="input-title"
            />
            <Textarea
              label="Description"
              placeholder="Brief description of the service"
              required
              minRows={3}
              {...form.getInputProps("description")}
              data-testid="input-description"
            />
            <TextInput
              label="Icon SVG Path"
              placeholder="SVG path or icon identifier"
              description="You can use FontAwesome class names (e.g., 'fas fa-code') or SVG paths"
              {...form.getInputProps("iconSvgPath")}
              data-testid="input-icon-path"
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
                  setEditingService(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createService.isPending || updateService.isPending}
                data-testid="button-save-service"
              >
                {editingService ? "Update" : "Create"} Service
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
