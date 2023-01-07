import AnonymousSignInCard from "@components/AnonymousSignInCard";
import BannerAd from "@components/BannerAd";
import ClockInOutCard from "@components/ClockInOutCard";
import Show from "@components/Show";
import TimesheetCard from "@components/TimesheetCard";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAccount } from "@hooks/useAccount";
import useTimesheet from "@hooks/useTimesheet";
import { useNavigation } from "@react-navigation/native";
import { Button, ScrollView, Text, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Dashboard() {
  const theme = useTheme();
  const account = useAccount();
  const navigation = useNavigation();
  const { timesheet } = useTimesheet();

  useEffect(() => {
    if (account.status === "loading") return;
    if (!account.user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "signup" as never }],
      });
    }
  }, [account]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Show
        when={timesheet}
        fallback={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator />
          </View>
        }
      >
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          <View>
            {timesheet && (
              <VStack space={3}>
                <AnonymousSignInCard />
                <ClockInOutCard timesheet={timesheet} />
                <TimesheetCard timesheet={timesheet} />
                <Button
                  variant="ghost"
                  colorScheme="emerald"
                  onPress={() => navigation.navigate("history" as never)}
                  marginBottom={3}
                  mx={3}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: theme.space[1],
                    }}
                  >
                    <FontAwesome5
                      name="history"
                      size={14}
                      color={theme.colors.emerald[700]}
                    />
                    <Text ml={2} color="emerald.700">
                      View History
                    </Text>
                  </View>
                </Button>
              </VStack>
            )}
          </View>
        </ScrollView>
      </Show>
      <BannerAd />
    </View>
  );
}
