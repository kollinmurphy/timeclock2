import HistoryCard from "@components/HistoryCard";
import { queryTimesheets } from "@data/firestore";
import { Timesheet } from "@datatypes/Timesheet";
import { useAccount } from "@hooks/useAccount";
import { Stack } from "expo-router";
import { DocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function History() {
  const account = useAccount();
  const [timesheets, setTimesheets] = useState<
    Array<Timesheet & { snapshot: DocumentSnapshot }>
  >([]);

  useEffect(() => {
    if (!account.user) return;
    (async () => {
      const data = await queryTimesheets(account.user.uid);
      console.log("firstpage", data);
      setTimesheets(data as any);
    })();
  }, [account.user]);

  const handleEndReached = useCallback(() => {
    if (!account.user || timesheets.length === 0) return;
    (async () => {
      console.log(timesheets.at(-1).snapshot);
      const data: any = await queryTimesheets(
        account.user.uid,
        timesheets.at(-1).snapshot
      );
      console.log("nextpage", data);
      setTimesheets((t) => [...t, ...data]);
    })();
  }, [account.user, timesheets]);

  return (
    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
      <Stack.Screen options={{ title: "History" }} />
      <FlatList
        style={{ width: "100%" }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          width: "100%",
          flex: 1,
          padding: 12,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        data={timesheets}
        renderItem={({ item }) => <HistoryCard timesheet={item} />}
        ListEmptyComponent={<ActivityIndicator style={{ paddingTop: 24 }} />}
      />
    </View>
  );
}
