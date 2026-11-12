import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Comments from '../screens/Comments';

const Stack = createNativeStackNavigator();

export default function HomeMenu() {
  return (
    <Stack.Navigator id="HomeStack">
      <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Comments" component={Comments} options={{ title: 'Comentarios' }} />
    </Stack.Navigator>
  );
}
