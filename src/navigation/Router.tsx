import OptionsMenu from "@components/OptionsMenu";
import CreateAccountFromAnonymous from "@components/screens/CreateAccountFromAnonymous";
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
          headerTitle: "Timeclock",
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
