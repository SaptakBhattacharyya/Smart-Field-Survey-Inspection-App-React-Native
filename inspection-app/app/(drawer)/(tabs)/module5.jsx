import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { useSurvey } from '@/constants/SurveyContext';

// Fallback dummy contacts if device contacts permission is denied or running on emulator with 0 contacts
const mockContacts = [
  { id: '1', name: 'Anish Sharma', phoneNumbers: [{ number: '+91 98765 43210' }] },
  { id: '2', name: 'Bhavna Kulkarni', phoneNumbers: [{ number: '+91 98123 45678' }] },
  { id: '3', name: 'Chirag Patel', phoneNumbers: [] }, // No number demo
  { id: '4', name: 'Devika Roy', phoneNumbers: [{ number: '+91 94321 87654' }] },
  { id: '5', name: 'Eshwar Naidu', phoneNumbers: [{ number: '+91 99887 76655' }] },
  { id: '6', name: 'Farhan Akhtar', phoneNumbers: [{ number: '+91 91122 33445' }] },
];

export default function Module5Screen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const { draftSurvey, setDraftContact } = useSurvey();

  const [hasPermission, setHasPermission] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
        setUsingMock(false);
      } else {
        // Fallback if device contacts list is empty
        setContacts(mockContacts);
        setUsingMock(true);
      }
    } catch (_error) {
      setContacts(mockContacts);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermissionAndFetch = useCallback(async () => {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        await loadContacts();
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Error checking contacts permission:', error);
    }
  }, [loadContacts]);

  useEffect(() => {
    checkPermissionAndFetch();
  }, [checkPermissionAndFetch]);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        Alert.alert('Permission Granted', 'Contacts permission granted!');
        await loadContacts();
      } else {
        setHasPermission(false);
        setUsingMock(true);
        setContacts(mockContacts);
        Alert.alert(
          'Permission Denied',
          'Using fallback mock contacts for demonstration.'
        );
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to request contacts permission.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (hasPermission) {
      await loadContacts();
    } else {
      setTimeout(() => setRefreshing(false), 800);
      return;
    }
    setRefreshing(false);
  };

  const copyContactNumber = async (name, number) => {
    if (!number) {
      Alert.alert('No Number', `${name} does not have a phone number saved.`);
      return;
    }

    await Clipboard.setStringAsync(number);
    Alert.alert('Copied!', `Phone number for ${name} (${number}) copied to clipboard.`);
  };

  const selectContactForSurvey = (contact) => {
    const number = contact.phoneNumbers?.[0]?.number || 'No Number';
    const contactObj = { name: contact.name, phoneNumber: number };
    setDraftContact(contactObj);
    Alert.alert(
      'Contact Selected!',
      `${contact.name} (${number}) attached to Active Survey (${draftSurvey.surveyId}).`
    );
  };

  const filteredContacts = contacts.filter((contact) => {
    const nameMatch = contact.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = contact.phoneNumbers?.some((p) =>
      p.number?.includes(searchQuery)
    );
    return nameMatch || phoneMatch;
  });

  const getInitial = (name) => {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = ['#0284c7', '#7c3aed', '#059669', '#d97706', '#db2777', '#2563eb'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderContactItem = ({ item }) => {
    const phoneNumber = item.phoneNumbers?.[0]?.number;

    return (
      <View style={styles.contactCard}>
        {/* Avatar Initial */}
        <View style={[styles.avatar, { backgroundColor: getRandomColor(item.name) }]}>
          <Text style={styles.avatarText}>{getInitial(item.name)}</Text>
        </View>

        {/* Contact Details */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          {phoneNumber ? (
            <Text style={styles.contactPhone}>{phoneNumber}</Text>
          ) : (
            <View style={styles.noNumberBadge}>
              <Text style={styles.noNumberText}>No Number</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {phoneNumber && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => copyContactNumber(item.name, phoneNumber)}
            >
              <Ionicons name="clipboard-outline" size={16} color="#38bdf8" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => selectContactForSurvey(item)}
          >
            <Text style={styles.selectBtnText}>+ Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Module 5 - Contacts</Text>
        <Text style={styles.headerSubtitle}>
          Inspection Personnel & Client Contacts
        </Text>
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerRow}>
          <Text style={styles.counterText}>
            Contacts: <Text style={styles.counterHighlight}>{filteredContacts.length}</Text> of{' '}
            {contacts.length}
          </Text>
          {usingMock && (
            <View style={styles.mockBadge}>
              <Text style={styles.mockBadgeText}>Demo Data</Text>
            </View>
          )}
        </View>

        {hasPermission !== true && (
          <TouchableOpacity
            style={styles.requestPermissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.requestPermissionText}>
              Grant Device Contact Access
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts by name or number..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Fetching contacts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#38bdf8"
              colors={['#38bdf8']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={44} color="#334155" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No Contacts Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No contact matches "${searchQuery}". Try a different term.`
                  : 'No contacts available on this device.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#334155' : '#ccc',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 13,
    color: isDark ? '#94a3b8' : '#64748b',
    marginTop: 2,
  },
  banner: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#334155' : '#ccc',
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  counterHighlight: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  mockBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  mockBadgeText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestPermissionBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  requestPermissionText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 12,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 24,
    top: 22,
  },
  clearSearchText: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  contactCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  contactPhone: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  noNumberBadge: {
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  noNumberText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
    padding: 8,
    borderRadius: 6,
  },
  iconBtnText: {
    fontSize: 14,
  },
  selectBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  selectBtnText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: isDark ? '#94a3b8' : '#64748b',
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
});
