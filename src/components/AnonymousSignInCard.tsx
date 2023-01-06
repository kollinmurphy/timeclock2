import { useAccount } from "@hooks/useAccount";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "native-base";
import { useCallback } from "react";
import Show from "./Show";

export default function AnonymousSignInCard() {
  const account = useAccount();
  const navigation = useNavigation();

  const handleNavigate = useCallback(
    () => navigation.navigate("anonymoussignup" as never),
    [navigation]
  );

  return (
    <Show when={account.anonymous} fallback={<View mt={-2} />}>
      <View mx={3} mt={4} mb={-3} p={4} rounded="xl" bg="light.50" shadow="2">
        <Text
          style={{
            fontSize: 16,
            paddingBottom: 8,
          }}
        >
          You are signed in as a guest. For the best experience, please create
          an account.
        </Text>
        <Button size="lg" colorScheme="indigo" onPress={handleNavigate}>
          Create Account
        </Button>
      </View>
    </Show>
  );
}
