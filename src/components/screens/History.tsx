import AddHours from "@components/AddHours";
import HistoryCard from "@components/HistoryCard";
import { queryTimesheetsLive } from "@data/firestore";
import { useAccount } from "@hooks/useAccount";
import { DocumentSnapshot } from "firebase/firestore";
import { theme } from "native-base";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Timesheet } from "../../types/Timesheet";

export default function History() {
  const account = useAccount();

  const [pages, setPages] = useState<
    Map<number, Array<Timesheet & { snapshot: DocumentSnapshot }>>
  >(new Map());
  const unsubscribers = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (!account.user) return;
    for (const unsubscribe of unsubscribers.current) unsubscribe();
    unsubscribers.current = [];
    setPages(new Map());

    const unsubscribe = queryTimesheetsLive(account.user.uid, (data) => {
      setPages((p) => {
        const newPages = new Map(p);
        newPages.set(0, data);
        return newPages;
      });
    });
    unsubscribers.current.push(unsubscribe);

    return () => {
      for (const unsubscribe of unsubscribers.current) unsubscribe();
      unsubscribers.current = [];
    };
  }, [account.user]);

  const handleEndReached = useCallback(() => {
    const lastPage = pages.size - 1;
    const lastPageSize = pages.get(lastPage)?.length ?? 0;
    if (!account.user || lastPageSize < 10) return;

    const unsubscribe = queryTimesheetsLive(account.user.uid, (data) => {
      setPages((p) => {
        const newPages = new Map(p);
        newPages.set(lastPage + 1, data);
        return newPages;
      });
    });
    unsubscribers.current.push(unsubscribe);
  }, [account.user, pages]);

  const timesheets = useMemo(() => {
    const timesheets = [];
    for (const page of pages.values()) timesheets.push(...page);
    return timesheets;
  }, [pages]);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        marginBottom: theme.space[2],
      }}
    >
      <FlatList
        style={{ width: "100%" }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          width: "100%",
          padding: 12,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        data={timesheets}
        renderItem={({ item }) => <HistoryCard timesheet={item} />}
        ListEmptyComponent={<ActivityIndicator style={{ paddingTop: 24 }} />}
        ListHeaderComponent={<AddHours />}
      />
    </View>
  );
}
