import useIsDarkMode from "@hooks/useIsDarkMode";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { extendTheme, NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import { LogBox } from "react-native";
import mobileAds from "react-native-google-mobile-ads";
import { AuthProvider } from "src/hooks/useAccount";
import Router from "src/navigation/Router";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native"]);

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
  },
  colors: {
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
  },
});

export default function App() {
  const dark = useIsDarkMode();

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <Router />
          <StatusBar style={dark ? "light" : "dark"} />
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
