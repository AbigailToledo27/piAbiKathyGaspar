import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Profile';
import Comments from '../screens/Comments';

const Stack = createNativeStackNavigator();

function ProfileMenu() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Mi perfil', headerShown: false }}/>
      <Stack.Screen name="Comments" component={Comments} options={{ title: 'Comentarios' }}/>
    </Stack.Navigator>
  );
}

export default ProfileMenu;