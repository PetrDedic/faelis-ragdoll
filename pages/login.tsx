import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Button,
  TextInput,
  Paper,
  Container,
  Title,
  Alert,
  PasswordInput,
  Stack,
} from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/admin/cats";
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Login</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && <Alert color="red">{error}</Alert>}
        {message && <Alert color="green">{message}</Alert>}
        <Stack>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button fullWidth mt="md" onClick={handleLogin} loading={loading}>
            Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
