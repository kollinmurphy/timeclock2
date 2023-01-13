import OptionsMenu from "@components/OptionsMenu";
import CreateAccountFromAnonymous from "@components/screens/CreateAccountFromAnonymous";
import Dashboard from "@components/screens/Dashboard";
import History from "@components/screens/History";
import Home from "@components/screens/Home";
import SignIn from "@components/screens/SignIn";
import SignUp from "@components/screens/SignUp";
import useIsDarkMode from "@hooks/useIsDarkMode";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "native-base";

const Stack = createNativeStackNavigator();

export default function Router() {
  const dark = useIsDarkMode();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: dark ? theme.colors.dark[100] : "white",
        },
        headerTintColor: dark ? "white" : "black",
      }}
    >
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerTitle: "ClockWork",
        }}
      />
      <Stack.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          headerTitle: "ClockWork",
          headerRight: () => <OptionsMenu />,
        }}
      />
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{
          headerTitle: "Sign In",
        }}
      />
      <Stack.Screen
        name="signup"
        component={SignUp}
        options={{
          headerTitle: "ClockWork",
        }}
      />
      <Stack.Screen
        name="history"
        component={History}
        options={{
          headerTitle: "History",
        }}
      />
      <Stack.Screen
        name="anonymoussignup"
        component={CreateAccountFromAnonymous}
        options={{
          headerTitle: "Create Account",
        }}
      />
    </Stack.Navigator>
  );
}
