import ClockInOutCard from "@components/ClockInOutCard";
import TimesheetCard from "@components/TimesheetCard";
import { Entypo } from "@expo/vector-icons";
import useTimesheet from "@hooks/useTimesheet";
import { Stack } from "expo-router";
import { ScrollView, VStack } from "native-base";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Dashboard() {
  const { timesheet, setTimesheet } = useTimesheet();

  return (
    <ScrollView p={3}>
      <Stack.Screen
        options={{
          title: "Timeclock",
          headerRight: (props) => (
            <View {...props}>
              <Entypo name="dots-three-horizontal" size={18} />
            </View>
          ),
        }}
      />
      {timesheet ? (
        <VStack space={3}>
          <ClockInOutCard timesheet={timesheet} setTimesheet={setTimesheet} />
          <TimesheetCard timesheet={timesheet} />
        </VStack>
      ) : (
        <ActivityIndicator />
      )}
    </ScrollView>
  );
}
