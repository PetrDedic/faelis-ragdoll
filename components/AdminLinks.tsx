import { Group, Button } from "@mantine/core";
import {
  IconDashboard,
  IconCat,
  IconMoodKid,
  IconPhoto,
  IconMedicalCross,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

export const AdminNav = ({ activePage = "dashboard" }) => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(`/admin/${path}`);
  };

  const navItems = [
    { id: "cats", label: "Kočky", icon: <IconCat size={18} />, path: "cats" },
    {
      id: "litters",
      label: "Vrhy",
      icon: <IconMoodKid size={18} />,
      path: "litters",
    },
    {
      id: "gallery",
      label: "Galerie",
      icon: <IconPhoto size={18} />,
      path: "gallery",
    },
    {
      id: "medical-tests",
      label: "Lékařské testy",
      icon: <IconMedicalCross size={18} />,
      path: "medical-tests",
    },
  ];

  return (
    <Group my={16}>
      {navItems.map((item) => (
        <Button
          color="black"
          key={item.id}
          leftSection={item.icon}
          variant={activePage === item.id ? "filled" : "light"}
          onClick={() => navigateTo(item.path)}
        >
          {item.label}
        </Button>
      ))}
    </Group>
  );
};
