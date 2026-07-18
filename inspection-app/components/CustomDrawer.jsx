import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomDrawer({ visible, onClose }) {
  const router = useRouter();

  const menuItems = [
    { title: 'Dashboard', route: '/(drawer)/(tabs)/module1', icon: 'grid-outline', desc: 'Overview & Stats' },
    { title: 'New Survey', route: '/(drawer)/(tabs)/module2', icon: 'create-outline', desc: 'Form Input & Data' },
    { title: 'Camera', route: '/(drawer)/(tabs)/module3', icon: 'camera-outline', desc: 'Capture Inspection Photo' },
    { title: 'Location', route: '/(drawer)/(tabs)/module4', icon: 'location-outline', desc: 'GPS Lat/Long & Copy' },
    { title: 'Contacts', route: '/(drawer)/(tabs)/module5', icon: 'people-outline', desc: 'Fetch & Search Contacts' },
    { title: 'Clipboard', route: '/(drawer)/(tabs)/module6', icon: 'clipboard-outline', desc: 'Copy & Paste Tools' },
    { title: 'Survey Preview', route: '/(drawer)/(tabs)/module7', icon: 'eye-outline', desc: 'Review & Submit' },
    { title: 'Survey History', route: '/(drawer)/(tabs)/module8', icon: 'time-outline', desc: 'FlatList & Filters' },
  ];

  const navigateTo = (route) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.drawerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Field Survey App</Text>
            <Text style={styles.headerSubtitle}>Navigation Menu</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color="#f87171" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigateTo(item.route)}
              >
                <Ionicons name={item.icon as any} size={20} color="#38bdf8" style={{ marginRight: 12 }} />
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Smart Field Survey Inspection v1.0</Text>
            <Text style={styles.footerSubText}>Saptak Bhattacharyya • ID: 002</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#1e293b',
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 16,
    marginBottom: 10,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#334155',
  },
  closeBtnText: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#0f172a',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },
  menuDesc: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  arrow: {
    color: '#475569',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 14,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  footerSubText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
});
