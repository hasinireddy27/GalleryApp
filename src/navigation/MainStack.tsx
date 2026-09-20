import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import ImageDetailsScreen from '../screens/ImageDetailsScreen';

type MainStackParamList = {
  MainTabs: undefined;
  ImageDetails: {
    image: {
      id: string;
      author: string;
      width: number;
      height: number;
      url: string;
      download_url: string;
    };
  };
};

const Stack =
  createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
      />

      <Stack.Screen
        name="ImageDetails"
        component={ImageDetailsScreen}
      />
    </Stack.Navigator>
  );
}