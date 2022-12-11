import OptionsMenu from "@components/OptionsMenu";
import Dashboard from "@components/screens/Dashboard";
import History from "@components/screens/History";
import Home from "@components/screens/Home";
import SignIn from "@components/screens/SignIn";
import SignUp from "@components/screens/SignUp";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerTitle: "Timeclock",
        }}
      />
      <Stack.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          headerTitle: "Timeclock",
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
          headerTitle: "Sign Up",
        }}
      />
      <Stack.Screen
        name="history"
        component={History}
        options={{
          headerTitle: "History",
        }}
      />
    </Stack.Navigator>
  );
}
