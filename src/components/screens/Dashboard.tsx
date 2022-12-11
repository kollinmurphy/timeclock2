import ClockInOutCard from "@components/ClockInOutCard";
import TimesheetCard from "@components/TimesheetCard";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAccount } from "@hooks/useAccount";
import useTimesheet from "@hooks/useTimesheet";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { Button, ScrollView, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Dashboard() {
  const account = useAccount();
  const navigation = useNavigation();
  const { timesheet } = useTimesheet();

  useEffect(() => {
    if (account.status === "loading") return;
    if (!account.user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "signin" as never }],
      });
    }
  }, [account]);

  return (
    <ScrollView p={3}>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: timesheet ? 1 : 0 }}
        transition={{
          type: "timing",
          duration: 350,
        }}
      >
        <View>
          {timesheet && (
            <VStack space={3}>
              <ClockInOutCard timesheet={timesheet} />
              <TimesheetCard timesheet={timesheet} />
              <Button
                variant="ghost"
                colorScheme="emerald"
                onPress={() => navigation.navigate("history" as never)}
                marginBottom={3}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5 name="history" size={14} color="green" />
                  <Text ml={2} color="emerald.700">
                    View History
                  </Text>
                </View>
              </Button>
            </VStack>
          )}
        </View>
      </MotiView>
      {!timesheet && <ActivityIndicator />}
    </ScrollView>
  );
}
