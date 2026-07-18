import { Tabs, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HapticTab } from '@/components/haptic-tab';
import { SurveyProvider } from '@/constants/SurveyContext';

export default function TabLayout() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SurveyProvider>
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerSafeArea}>
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.drawerToggleBtn}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu" size={24} color="#38bdf8" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.appTitle}>Smart Field Survey</Text>
              <Text style={styles.appSubtitle}>Inspection & Audit Suite</Text>
            </View>

            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Mod 1-8</Text>
            </View>
          </View>
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
    backgroundColor: '#1e293b',
  },
  headerBar: {
    height: 56,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  drawerToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drawerIcon: {
    fontSize: 22,
    color: '#38bdf8',
  },
  titleContainer: {
    flex: 1,
  },
  appTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
  },
  badgeContainer: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
