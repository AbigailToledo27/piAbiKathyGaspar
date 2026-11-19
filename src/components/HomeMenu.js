import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Comments from '../screens/Comments';

const Stack = createNativeStackNavigator();

function HomeMenu() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio', headerShown: false }} />
      <Stack.Screen name="Comments" component={Comments} options={{ title: 'Comentarios' }} />
    </Stack.Navigator>
  );
}

export default HomeMenu;
