import { Container, Title, Card, Button, Group, Stack, TextInput, Select, ColorInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useSiteTheme, useUpdateTheme } from "../../hooks/useAdminData";
import type { UpdateSiteTheme } from "@shared/schema";

export default function ThemeEditor() {
  const { data: theme, isLoading } = useSiteTheme();
  const updateTheme = useUpdateTheme();

  const form = useForm<UpdateSiteTheme>({
    initialValues: {
      primaryColor: theme?.primaryColor || "#e11d48",
      buttonStyle: theme?.buttonStyle || "rounded-lg",
      fontHeadline: theme?.fontHeadline || "Anton",
      fontBody: theme?.fontBody || "Inter",
    },
  });

  // Update form when theme data loads
  if (theme && !form.isDirty()) {
    form.setValues({
      primaryColor: theme.primaryColor,
      buttonStyle: theme.buttonStyle,
      fontHeadline: theme.fontHeadline,
      fontBody: theme.fontBody,
    });
  }

  const handleSubmit = async (values: UpdateSiteTheme) => {
    try {
      await updateTheme.mutateAsync(values);
      notifications.show({
        title: "Success",
        message: "Theme settings updated successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update theme settings. Please try again.",
        color: "red",
      });
    }
  };

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Group mb="xl">
        <Button component={Link} to="/admin/dashboard" variant="subtle" leftSection={<ArrowLeft size={16} />}>
          Back to Dashboard
        </Button>
      </Group>

      <Title order={1} mb="xl">Theme Settings</Title>

      <Card withBorder p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* Primary Color */}
            <div>
              <Text fw={500} mb="xs">Primary Color</Text>
              <Text size="xs" c="dimmed" mb="sm">
                This color is used for buttons, links, and accent elements throughout the site
              </Text>
              <ColorInput
                placeholder="Pick a color"
                format="hex"
                swatches={[
                  '#e11d48', '#dc2626', '#ea580c', '#ca8a04',
                  '#65a30d', '#16a34a', '#059669', '#0891b2',
                  '#0284c7', '#2563eb', '#7c3aed', '#c026d3'
                ]}
                {...form.getInputProps('primaryColor')}
                data-testid="color-picker-primary"
              />
            </div>

            {/* Button Style */}
            <div>
              <Text fw={500} mb="xs">Button Style</Text>
              <Text size="xs" c="dimmed" mb="sm">
                Choose the default border radius for buttons across the site
              </Text>
              <Select
                placeholder="Select button style"
                data={[
                  { value: 'rounded-lg', label: 'Rounded (8px radius)' },
                  { value: 'rounded-full', label: 'Pill-shaped (fully rounded)' },
                  { value: 'square', label: 'Square (no border radius)' },
                ]}
                {...form.getInputProps('buttonStyle')}
                data-testid="select-button-style"
              />
            </div>

            {/* Headline Font */}
            <div>
              <Text fw={500} mb="xs">Headline Font</Text>
              <Text size="xs" c="dimmed" mb="sm">
                Font used for major headings and titles
              </Text>
              <TextInput
                placeholder="Font family name"
                {...form.getInputProps('fontHeadline')}
                data-testid="input-font-headline"
              />
            </div>

            {/* Body Font */}
            <div>
              <Text fw={500} mb="xs">Body Font</Text>
              <Text size="xs" c="dimmed" mb="sm">
                Font used for paragraphs, navigation, and general text
              </Text>
              <TextInput
                placeholder="Font family name"
                {...form.getInputProps('fontBody')}
                data-testid="input-font-body"
              />
            </div>

            {/* Preview Section */}
            <div>
              <Text fw={500} mb="sm">Preview</Text>
              <Card withBorder p="md" bg="gray.0">
                <Stack gap="sm">
                  <div style={{ fontFamily: form.values.fontHeadline, fontSize: '24px', fontWeight: 'bold' }}>
                    Sample Headline Text
                  </div>
                  <div style={{ fontFamily: form.values.fontBody }}>
                    This is how body text will appear with your selected font settings.
                  </div>
                  <Button
                    style={{
                      backgroundColor: form.values.primaryColor,
                      borderRadius: 
                        form.values.buttonStyle === 'rounded-full' ? '9999px' :
                        form.values.buttonStyle === 'square' ? '0' : '8px'
                    }}
                  >
                    Sample Button
                  </Button>
                </Stack>
              </Card>
            </div>

            {/* Submit Button */}
            <Group justify="flex-end">
              <Button
                type="submit"
                loading={updateTheme.isPending}
                leftSection={<Save size={16} />}
                data-testid="button-save-theme"
              >
                Save Theme Settings
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
