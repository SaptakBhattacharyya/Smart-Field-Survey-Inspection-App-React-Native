import { Drawer } from 'expo-router/drawer';
import React from 'react';
import CustomDrawerContent from './CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#1e293b',
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: 'Main App',
        }}
      />
    </Drawer>
  );
}
