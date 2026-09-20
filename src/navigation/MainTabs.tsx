import React from 'react';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  useColorScheme,
} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
  Gallery: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: isDark
          ? '#60A5FA'
          : '#007AFF',

        tabBarInactiveTintColor: isDark
          ? '#94A3B8'
          : '#777777',

        tabBarStyle: {
          backgroundColor: isDark
            ? '#1E293B'
            : '#FFFFFF',

          borderTopColor: isDark
            ? '#334155'
            : '#E5E7EB',
        },
      }}
    >
      <Tab.Screen
        name="Gallery"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Gallery',
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

