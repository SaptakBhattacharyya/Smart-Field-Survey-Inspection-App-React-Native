import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname.includes(route);
  };

  const menuItems = [
    { label: 'Dashboard', route: '/(drawer)/(tabs)/module1', icon: 'grid-outline', activeIcon: 'grid' },
    { label: 'New Survey', route: '/(drawer)/(tabs)/module2', icon: 'create-outline', activeIcon: 'create' },
    { label: 'Camera', route: '/(drawer)/(tabs)/module3', icon: 'camera-outline', activeIcon: 'camera' },
    { label: 'Location', route: '/(drawer)/(tabs)/module4', icon: 'location-outline', activeIcon: 'location' },
    { label: 'Contacts', route: '/(drawer)/(tabs)/module5', icon: 'people-outline', activeIcon: 'people' },
    { label: 'Clipboard', route: '/(drawer)/(tabs)/module6', icon: 'clipboard-outline', activeIcon: 'clipboard' },
    { label: 'Survey Preview', route: '/(drawer)/(tabs)/module7', icon: 'eye-outline', activeIcon: 'eye' },
    { label: 'Survey History', route: '/(drawer)/(tabs)/module8', icon: 'time-outline', activeIcon: 'time' },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: '#1e293b',
        flexGrow: 1,
      }}
    >
      <View style={styles.headerContainer}>
        <View style={styles.avatarWrapper}>
          <Ionicons name="briefcase" size={28} color="#ffffff" />
        </View>
        <Text style={styles.appName}>Field Survey App</Text>
        <Text style={styles.appSubtitle}>Inspection & Audit Suite v1.0</Text>
      </View>

      <View style={styles.itemsContainer}>
        {menuItems.map((item, idx) => {
          const active = isActive(item.route.split('/').pop() || '');
          return (
            <DrawerItem
              key={idx}
              label={item.label}
              labelStyle={{
                color: active ? '#ffffff' : '#94a3b8',
                fontWeight: active ? '700' : '500',
              }}
              style={[
                styles.drawerItem,
                active && { backgroundColor: '#0284c7' },
              ]}
              icon={({ size }) => (
                <Ionicons
                  name={(active ? item.activeIcon : item.icon) as any}
                  size={size}
                  color={active ? '#ffffff' : '#38bdf8'}
                />
              )}
              onPress={() => {
                props.navigation.closeDrawer();
                router.push(item.route as any);
              }}
            />
          );
        })}
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Smart Field Survey Inspection</Text>
        <Text style={styles.footerSubText}>Saptak Bhattacharyya • ID: 002</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  drawerItem: {
    borderRadius: 8,
    marginVertical: 3,
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  footerSubText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
