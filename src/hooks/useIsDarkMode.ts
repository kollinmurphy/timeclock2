import { useColorScheme } from "react-native";

export default function useIsDarkMode() {
  const scheme = useColorScheme();
  return scheme === "dark";
}
