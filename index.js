import "@bacons/expo-metro-runtime";
import "expo-router/entry";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core"
])
