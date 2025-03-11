import {
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/form.json";
import enTranslations from "../locales/en/form.json";
import deTranslations from "../locales/de/form.json";

export function Form() {
  const router = useRouter();
  const { locale } = router;

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  return (
    <Stack align="center" w="100%">
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        {t.title}
      </Title>
      <Card
        bg="#ebf1f7"
        padding="lg"
        radius="lg"
        style={{ border: "#47a3ee 3px solid" }}
        w="100%"
        maw={640}
      >
        <form onSubmit={form.onSubmit(() => {})}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <TextInput
              styles={{ input: { border: "#47a3ee 1px solid" } }}
              label={t.name.label}
              placeholder={t.name.placeholder}
              name="name"
              variant="filled"
              {...form.getInputProps("name")}
            />
            <TextInput
              styles={{ input: { border: "#47a3ee 1px solid" } }}
              label={t.email.label}
              placeholder={t.email.placeholder}
              name="email"
              variant="filled"
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <TextInput
            styles={{ input: { border: "#47a3ee 1px solid" } }}
            label={t.subject.label}
            placeholder={t.subject.placeholder}
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps("subject")}
          />
          <Textarea
            styles={{ input: { border: "#47a3ee 1px solid" } }}
            mt="md"
            label={t.message.label}
            placeholder={t.message.placeholder}
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps("message")}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" size="md">
              {t.submit}
            </Button>
          </Group>
        </form>
      </Card>
    </Stack>
  );
}
