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

export function Form() {
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
        Kontaktujte nás
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
              label="Jméno"
              placeholder="Vaše jméno a příjmení"
              name="name"
              variant="filled"
              {...form.getInputProps("name")}
            />
            <TextInput
              styles={{ input: { border: "#47a3ee 1px solid" } }}
              label="Email"
              placeholder="Váš email"
              name="email"
              variant="filled"
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <TextInput
            styles={{ input: { border: "#47a3ee 1px solid" } }}
            label="Předmět"
            placeholder="Předmět"
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps("subject")}
          />
          <Textarea
            styles={{ input: { border: "#47a3ee 1px solid" } }}
            mt="md"
            label="Vaše zpráva"
            placeholder="Napište nám zprávu"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps("message")}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" size="md">
              Odeslat formulář
            </Button>
          </Group>
        </form>
      </Card>
    </Stack>
  );
}
