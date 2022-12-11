import Dashboard from "@components/screens/dashboard";
import Home from "@components/screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name='dashboard' component={Dashboard} />
    </Stack.Navigator>
  );
}
