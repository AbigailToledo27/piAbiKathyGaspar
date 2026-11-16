import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import HomeMenu from './HomeMenu';
import Profile from '../screens/Profile';
import NewPost from '../screens/NewPost';

const Tab = createBottomTabNavigator();

function MenuNav() {
    return(
        <Tab.Navigator id="MainTabs" screenOptions = { { tabBarShowLabel: false, headerShown: false }}>
            <Tab.Screen name="Inicio" component={HomeMenu} options={ {tabBarIcon: () => <Entypo name="home" size={24} color="black" />}} />
            <Tab.Screen name="Nuevo Post" component={NewPost} options={ {tabBarIcon: () => <Entypo name="plus" size={24} color="black" />}}/>
            <Tab.Screen name="Perfil" component={Profile} options={ {tabBarIcon: () => <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />}}/>
        </Tab.Navigator>

    )
}

export default MenuNav;
