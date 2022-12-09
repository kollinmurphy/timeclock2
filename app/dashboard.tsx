import ClockInOutCard from "@components/ClockInOutCard";
import TimesheetCard from "@components/TimesheetCard";
import { signOut } from "@data/auth";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useAccount } from "@hooks/useAccount";
import useTimesheet from "@hooks/useTimesheet";
import { Stack, useNavigation } from "expo-router";
import { Button, Menu, ScrollView, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

export default function Dashboard() {
  const account = useAccount();
  const navigation = useNavigation();
  const { timesheet, setTimesheet } = useTimesheet();

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
      <Stack.Screen
        options={{
          title: "Timeclock",
          headerRight: (props) => (
            <Menu
              {...props}
              w="190"
              trigger={(triggerProps) => (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                  style={({ pressed }) => [
                    triggerProps.style,
                    pressed ? { opacity: 0.4, backgroundColor: "gray" } : {},
                    {
                      padding: 4,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Entypo name="dots-three-horizontal" size={18} />
                </Pressable>
              )}
            >
              <Menu.Item onPress={signOut}>Sign Out</Menu.Item>
            </Menu>
          ),
        }}
      />
      {timesheet ? (
        <VStack space={3}>
          <ClockInOutCard timesheet={timesheet} setTimesheet={setTimesheet} />
          <TimesheetCard timesheet={timesheet} />
          <Button
            variant="ghost"
            colorScheme="emerald"
            onPress={() => navigation.navigate("history" as never)}
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
      ) : (
        <ActivityIndicator />
      )}
    </ScrollView>
  );
}
