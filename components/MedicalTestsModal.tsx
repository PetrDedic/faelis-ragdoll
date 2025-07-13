import {
  Modal,
  Stack,
  Text,
  Badge,
  Group,
  Title,
  Divider,
} from "@mantine/core";
import { formatDate } from "../utils/catTranslations";

interface MedicalTest {
  id: string;
  test_name: string;
  test_result: string;
  test_date: string;
  valid_from: string;
  valid_until: string | null;
  laboratory: string;
  certificate_number: string;
  notes: string;
}

interface MedicalTestsModalProps {
  opened: boolean;
  onClose: () => void;
  tests: MedicalTest[];
  catName: string;
  locale: string;
  translations: any;
}

export function MedicalTestsModal({
  opened,
  onClose,
  tests,
  catName,
  locale,
  translations,
}: MedicalTestsModalProps) {
  const getValidityBadge = (test: MedicalTest) => {
    if (!test.valid_until) {
      return (
        <Badge color="green">
          {translations.medicalTests?.permanent || "Permanent"}
        </Badge>
      );
    }

    const validUntil = new Date(test.valid_until);
    const now = new Date();

    if (validUntil > now) {
      return (
        <Badge color="blue">
          {translations.medicalTests?.valid || "Valid"}
        </Badge>
      );
    } else {
      return (
        <Badge color="red">
          {translations.medicalTests?.expired || "Expired"}
        </Badge>
      );
    }
  };

  const getDaysUntilExpiration = (test: MedicalTest) => {
    if (!test.valid_until) return null;

    const validUntil = new Date(test.valid_until);
    const now = new Date();
    const diffTime = validUntil.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`${
        translations.medicalTests?.heading || "Medical Tests"
      } - ${catName}`}
      size="lg"
    >
      <Stack gap="md">
        {tests.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {translations.medicalTests?.noTests ||
              "No medical tests available for this cat."}
          </Text>
        ) : (
          tests.map((test, index) => (
            <Stack key={test.id} gap="sm">
              {index > 0 && <Divider />}

              <Group justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Title order={4} size="h5">
                    {test.test_name}
                  </Title>

                  <Group gap="xs">
                    <Badge variant="light" color="blue">
                      {test.test_result}
                    </Badge>
                    {getValidityBadge(test)}
                  </Group>

                  <Text size="sm">
                    <strong>
                      {translations.medicalTests?.testDate || "Test Date"}:
                    </strong>{" "}
                    {formatDate(test.test_date, locale)}
                  </Text>

                  <Text size="sm">
                    <strong>
                      {translations.medicalTests?.validFrom || "Valid From"}:
                    </strong>{" "}
                    {formatDate(test.valid_from, locale)}
                  </Text>

                  {test.valid_until && (
                    <Text size="sm">
                      <strong>
                        {translations.medicalTests?.validUntil || "Valid Until"}
                        :
                      </strong>{" "}
                      {formatDate(test.valid_until, locale)}
                      {(() => {
                        const daysLeft = getDaysUntilExpiration(test);
                        if (daysLeft !== null) {
                          return (
                            <Text size="xs" c="dimmed" ml="xs">
                              (
                              {daysLeft > 0
                                ? `${daysLeft} ${
                                    translations.medicalTests?.daysLeft ||
                                    "days left"
                                  }`
                                : `${Math.abs(daysLeft)} ${
                                    translations.medicalTests?.daysExpired ||
                                    "days expired"
                                  }`}
                              )
                            </Text>
                          );
                        }
                        return null;
                      })()}
                    </Text>
                  )}

                  {test.laboratory && (
                    <Text size="sm">
                      <strong>
                        {translations.medicalTests?.laboratory || "Laboratory"}:
                      </strong>{" "}
                      {test.laboratory}
                    </Text>
                  )}

                  {test.certificate_number && (
                    <Text size="sm">
                      <strong>
                        {translations.medicalTests?.certificate ||
                          "Certificate"}
                        :
                      </strong>{" "}
                      {test.certificate_number}
                    </Text>
                  )}

                  {test.notes && (
                    <Text size="sm">
                      <strong>
                        {translations.medicalTests?.notes || "Notes"}:
                      </strong>{" "}
                      {test.notes}
                    </Text>
                  )}
                </Stack>
              </Group>
            </Stack>
          ))
        )}
      </Stack>
    </Modal>
  );
}
