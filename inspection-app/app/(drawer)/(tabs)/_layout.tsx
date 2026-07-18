import { Tabs, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { HapticTab } from '@/components/haptic-tab';
import { SurveyProvider } from '@/constants/SurveyContext';

export default function TabLayout() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SurveyProvider>
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerSafeArea}>
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.drawerToggleBtn}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <Ionicons name="menu" size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <Text style={styles.appTitle}>Smart Field Survey</Text>
                <Text style={styles.appSubtitle}>Inspection & Audit Suite</Text>
              </View>

              <TouchableOpacity style={styles.bellIcon}>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.modBadgeContainer}>
              <Text style={styles.modBadgeText}>Mod 1-8</Text>
            </View>
          </LinearGradient>
        </SafeAreaView>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#38bdf8',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              backgroundColor: '#0f172a',
              borderTopColor: '#334155',
              height: 56 + (insets.bottom > 0 ? insets.bottom : 10),
              paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
              paddingTop: 6,
            },
            headerShown: false,
            tabBarButton: HapticTab,
          }}
        >
          <Tabs.Screen
            name="module1"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="module2"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="module3"
            options={{
              title: 'Camera',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'camera' : 'camera-outline'} size={22} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="module4"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="module5"
            options={{
              title: 'Contacts',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'people' : 'people-outline'} size={22} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="module6"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="module7"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="module8"
            options={{
              title: 'History',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'time' : 'time-outline'} size={22} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </View>
    </SurveyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerSafeArea: {
    backgroundColor: '#3b82f6',
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 16,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerToggleBtn: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appSubtitle: {
    color: '#e2e8f0',
    fontSize: 12,
    marginTop: 2,
  },
  bellIcon: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  modBadgeContainer: {
    position: 'absolute',
    bottom: -12,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modBadgeText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
