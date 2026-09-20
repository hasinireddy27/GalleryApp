import React from 'react';

import { AuthProvider } from './src/context/AuthContext';
import { GalleryProvider } from './src/context/GalleryContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <GalleryProvider>
        <AppNavigator />
      </GalleryProvider>
    </AuthProvider>
  );
}