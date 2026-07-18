import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function DashboardScreen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <LinearGradient
        colors={['#3b82f6', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <DrawerToggleButton tintColor="#fff" />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Smart Field Survey</Text>
            <Text style={styles.headerSubtitle}>Inspection & Audit Suite</Text>
          </View>
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Mod Badge floating on header bottom edge */}
        <View style={styles.modBadgeContainer}>
          <Text style={styles.modBadgeText}>Mod 1-8</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Saptak Bhattacharyya 👋</Text>
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Ionicons name="person-outline" size={12} color="#4f46e5" />
                <Text style={styles.badgeText}>ID: 002</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="business-outline" size={12} color="#4f46e5" />
                <Text style={styles.badgeText}>Department: Field Inspection</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={12} color="#4f46e5" />
              <Text style={styles.badgeText}>Session: 2025-2026</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            {/* The avatar image from assets */}
            <Image 
              source={require('@/assets/images/avatar.png')} 
              style={styles.avatar3D} 
              resizeMode="contain"
            />
          </View>
        </View>

        {/* GPS Status Card */}
        <View style={styles.gpsCard}>
          <View style={styles.gpsIconCircle}>
            <Ionicons name="location-outline" size={20} color="#22c55e" />
          </View>
          <View style={styles.gpsTextContainer}>
            <Text style={styles.gpsTitle}>
              GPS Status: <Text style={styles.gpsActiveText}>Active</Text>
            </Text>
            <Text style={styles.gpsSubtitle}>Last synced: 3 mins ago</Text>
          </View>
          <Ionicons name="cellular-outline" size={24} color="#22c55e" />
        </View>

        {/* Today's Survey Count */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s Survey Count</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.countRow}>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>12</Text>
            <Text style={styles.countLabel}>Total</Text>
            <View style={[styles.countIconCircle, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
            </View>
          </View>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>8</Text>
            <Text style={styles.countLabel}>Completed</Text>
            <View style={[styles.countIconCircle, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            </View>
          </View>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>3</Text>
            <Text style={styles.countLabel}>Pending</Text>
            <View style={[styles.countIconCircle, { backgroundColor: '#fff7ed' }]}>
              <Ionicons name="time" size={20} color="#f97316" />
            </View>
          </View>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>1</Text>
            <Text style={styles.countLabel}>Flagged</Text>
            <View style={[styles.countIconCircle, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="flag" size={20} color="#ef4444" />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionWrapper}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.quickActionCard}>
              <Ionicons name="add" size={24} color="#fff" />
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>New Survey</Text>
                <Text style={styles.quickActionSubtitle}>Start new survey</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionWrapper}>
            <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.quickActionCard}>
              <Ionicons name="location-outline" size={24} color="#fff" />
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>Location</Text>
                <Text style={styles.quickActionSubtitle}>Mark location</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionWrapper}>
            <LinearGradient colors={['#14b8a6', '#0f766e']} style={styles.quickActionCard}>
              <Ionicons name="people-outline" size={24} color="#fff" />
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>Contacts</Text>
                <Text style={styles.quickActionSubtitle}>View contacts</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Survey Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Survey Summary</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentList}>
          {/* Survey 1 */}
          <TouchableOpacity style={styles.recentItem}>
            <Image source={require('@/assets/images/survey1.png')} style={styles.recentImage} />
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>SRV-1042 - Sector 5 Complex</Text>
              <View style={styles.recentLocationRow}>
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={styles.recentLocationText}>Kolkata</Text>
              </View>
              <View style={styles.recentStatusRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#22c55e" />
                <Text style={styles.statusTextCompleted}>Completed</Text>
              </View>
            </View>
            <View style={styles.recentRight}>
              <Ionicons name="chevron-forward" size={16} color="#94a3b8" style={{ alignSelf: 'flex-end', marginBottom: 20 }} />
              <Text style={styles.timeText}>2h ago</Text>
            </View>
          </TouchableOpacity>

          {/* Survey 2 */}
          <TouchableOpacity style={styles.recentItem}>
            <Image source={require('@/assets/images/survey2.png')} style={styles.recentImage} />
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>SRV-1043 - Lake View Block B</Text>
              <View style={styles.recentLocationRow}>
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={styles.recentLocationText}>Salt Lake</Text>
              </View>
              <View style={styles.recentStatusRow}>
                <Ionicons name="time-outline" size={14} color="#3b82f6" />
                <Text style={styles.statusTextInProgress}>In Progress</Text>
              </View>
            </View>
            <View style={styles.recentRight}>
              <Ionicons name="chevron-forward" size={16} color="#94a3b8" style={{ alignSelf: 'flex-end', marginBottom: 20 }} />
              <Text style={styles.timeText}>4h ago</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e2e8f0',
    fontSize: 12,
    marginTop: 2,
  },
  bellIcon: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  modBadgeContainer: {
    position: 'absolute',
    bottom: -12,
    right: 20,
    backgroundColor: isDark ? '#1e293b' : '#fff',
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  welcomeCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeText: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 14,
  },
  userName: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#4338ca',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '600',
  },
  avatarContainer: {
    width: 80,
    height: 100,
    justifyContent: 'flex-end',
  },
  avatar3D: {
    width: '100%',
    height: '100%',
  },
  gpsCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsTextContainer: {
    flex: 1,
  },
  gpsTitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  gpsActiveText: {
    color: '#22c55e',
  },
  gpsSubtitle: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '600',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  countCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    width: '23%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#0f172a',
  },
  countLabel: {
    fontSize: 11,
    color: isDark ? '#94a3b8' : '#64748b',
    marginTop: 4,
    marginBottom: 12,
  },
  countIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionWrapper: {
    width: '31%',
  },
  quickActionCard: {
    borderRadius: 16,
    padding: 12,
    height: 100,
    justifyContent: 'space-between',
  },
  quickActionTextContainer: {
    marginTop: 8,
  },
  quickActionTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  quickActionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  recentList: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentLocationText: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 12,
    marginLeft: 4,
  },
  recentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextCompleted: {
    color: '#22c55e',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  statusTextInProgress: {
    color: '#3b82f6',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  recentRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  timeText: {
    color: '#94a3b8',
    fontSize: 11,
  },
});
