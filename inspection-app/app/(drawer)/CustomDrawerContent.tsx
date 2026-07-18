import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true); // Default as per image

  const isActive = (route: string) => {
    return pathname.includes(route);
  };

  const menuItems = [
    { label: 'Dashboard', route: '/(drawer)/(tabs)', icon: 'home-outline', activeIcon: 'home' },
    { label: 'New Survey', route: '/(drawer)/(tabs)/module2', icon: 'add-circle-outline', activeIcon: 'add-circle' },
    { label: 'Camera', route: '/(drawer)/(tabs)/module3', icon: 'camera-outline', activeIcon: 'camera' },
    { label: 'Location', route: '/(drawer)/(tabs)/module4', icon: 'location-outline', activeIcon: 'location' },
    { label: 'Contacts', route: '/(drawer)/(tabs)/module5', icon: 'people-outline', activeIcon: 'people' },
    { label: 'Clipboard', route: '/(drawer)/(tabs)/module6', icon: 'clipboard-outline', activeIcon: 'clipboard' },
    { label: 'Survey Preview', route: '/(drawer)/(tabs)/module7', icon: 'eye-outline', activeIcon: 'eye' },
    { label: 'Survey History', route: '/(drawer)/(tabs)/module8', icon: 'time-outline', activeIcon: 'time' },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 20,
        }}
        scrollEnabled={true}
      >
        {/* Close Button */}
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Top Gradient Card */}
        <LinearGradient
          colors={['#101d36', '#0d1830']}
          style={styles.topCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.topCardInner}>
            <LinearGradient colors={['#7e22ce', '#3b82f6']} style={styles.iconCircle}>
              <Ionicons name="briefcase" size={24} color="#ffffff" />
            </LinearGradient>
            <View style={styles.topCardTextContainer}>
              <Text style={styles.topCardTitle}>Smart Field Survey</Text>
              <Text style={styles.topCardSubtitle}>Inspection & Audit Suite</Text>
              <View style={styles.modBadge}>
                <Text style={styles.modBadgeText}>Mod 1-8</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>SB</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Saptak Bhattacharyya</Text>
            <Text style={styles.profileId}>Student ID: 002</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#94a3b8" />
        </View>

        {/* Menu Items */}
        <View style={styles.itemsContainer}>
          {menuItems.map((item, idx) => {
            const active = isActive(item.route.split('/').pop() || '') || (item.label === 'Dashboard' && (pathname === '/' || pathname === '/(drawer)/(tabs)'));
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.drawerItem,
                  active && styles.activeDrawerItem
                ]}
                onPress={() => {
                  props.navigation.closeDrawer();
                  router.push(item.route as any);
                }}
              >
                <Ionicons
                  name={(active ? item.activeIcon : item.icon) as any}
                  size={22}
                  color={active ? '#ffffff' : '#818cf8'}
                  style={styles.drawerItemIcon}
                />
                <Text style={[
                  styles.drawerItemLabel,
                  active && styles.activeDrawerItemLabel
                ]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.securityCard}>
          <View style={styles.securityIconContainer}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#38bdf8" />
          </View>
          <View>
            <Text style={styles.securityTitle}>Smart Field Survey Inspection</Text>
            <Text style={styles.securitySubtitle}>Saptak Bhattacharyya • ID: 002</Text>
          </View>
        </View>

        <View style={styles.darkModeContainer}>
          <View style={styles.darkModeLeft}>
            <Ionicons name="moon-outline" size={22} color="#818cf8" />
            <Text style={styles.darkModeText}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#334155', true: '#3b82f6' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712', // Very dark blue/black
  },
  closeButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  topCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  topCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topCardTextContainer: {
    flex: 1,
  },
  topCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topCardSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  modBadge: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  modBadgeText: {
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7e22ce', // Purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  profileId: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  itemsContainer: {
    paddingHorizontal: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeDrawerItem: {
    backgroundColor: '#1e3a8a', // Dark blue background for active state
  },
  drawerItemIcon: {
    marginRight: 16,
  },
  drawerItemLabel: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '500',
  },
  activeDrawerItemLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bottomSection: {
    padding: 20,
    paddingBottom: 40, // Extra padding for safe area
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  securityIconContainer: {
    marginRight: 12,
  },
  securityTitle: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  securitySubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  darkModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkModeText: {
    color: '#cbd5e1',
    fontSize: 15,
    marginLeft: 12,
  },
});
