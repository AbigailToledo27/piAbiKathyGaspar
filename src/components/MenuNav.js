import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeMenu from './HomeMenu';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

function MenuNav() {
    return(
        <Tab.Navigator id="MainTabs">
            <Tab.Screen name="Inicio" component={HomeMenu} options={{ headerShown: false }} />
            <Tab.Screen name="Perfil" component={Profile} />
        </Tab.Navigator>

    )
}

export default MenuNav;
