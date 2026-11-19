import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import HomeMenu from './HomeMenu';
import NewPost from '../screens/NewPost';
import Login from '../screens/Login';
import ProfileMenu from './ProfileMenu';
import { auth } from '../firebase/config';

const Tab = createBottomTabNavigator();

function MenuNav(props) {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    if (!user) {
        return <Login navigation={props.navigation} />;
    }

    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
            <Tab.Screen name="Inicio" component={HomeMenu} options={{ tabBarIcon: () => <MaterialCommunityIcons name="home-outline" size={26} color="#0b6f91" /> }} />
            <Tab.Screen name="Nuevo Post" component={NewPost} options={{ tabBarIcon: () => <MaterialCommunityIcons name="plus-circle" size={34} color="#0b6f91" /> }} />
            <Tab.Screen name="Perfil" component={ProfileMenu} options={{ tabBarIcon: () => <MaterialCommunityIcons name="account-outline" size={26} color="#0b6f91" /> }} />
        </Tab.Navigator>

    );
}

export default MenuNav;
