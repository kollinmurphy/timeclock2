import "@bacons/expo-metro-runtime";
// import "expo-router/entry";
import { LogBox, Text, View } from "react-native";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core"
])

export default function AppTest() {
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
}