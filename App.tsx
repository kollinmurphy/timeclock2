import { AuthProvider } from "@hooks/useAccount";
import { NavigationContainer } from "@react-navigation/native";
import { extendTheme, NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import Router from "src/navigation/Router";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core"]);

const theme = extendTheme({
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
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}