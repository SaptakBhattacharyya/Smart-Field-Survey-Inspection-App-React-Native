import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useSurvey } from '@/constants/SurveyContext';

export default function Module4Screen() {
  const { draftSurvey, setDraftLocation } = useSurvey();

  const [hasPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const fetchCurrentLocation = useCallback(async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude, accuracy } = currentLocation.coords;
      const locData = {
        latitude,
        longitude,
        accuracy: accuracy ? accuracy.toFixed(1) : 'Unknown',
        timestamp: new Date().toLocaleTimeString(),
      };

      setLocation(locData);
      setDraftLocation(locData);

      // Attempt reverse geocode for address display
      try {
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverse && reverse.length > 0) {
          const place = reverse[0];
          const formattedAddress = [place.name, place.street, place.city, place.region]
            .filter(Boolean)
            .join(', ');
          setAddress(formattedAddress || 'Location retrieved');
        }
      } catch (_err) {
        setAddress('Address lookup unavailable');
      }
    } catch (_error) {
      Alert.alert('Location Error', 'Unable to fetch current location. Check GPS settings.');
    } finally {
      setLoading(false);
    }
  }, [setDraftLocation]);

  const checkPermissionAndFetch = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        fetchCurrentLocation();
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  }, [fetchCurrentLocation]);

  useEffect(() => {
    checkPermissionAndFetch();
  }, [checkPermissionAndFetch]);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        Alert.alert('Permission Granted', 'Location permission granted successfully!');
        await fetchCurrentLocation();
      } else {
        setHasPermission(false);
        Alert.alert(
          'Permission Denied',
          'Location permission is required to detect GPS coordinates.'
        );
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to request location permission.');
    } finally {
      setLoading(false);
    }
  };

  const copyLocationToClipboard = async () => {
    if (!location) {
      Alert.alert('No Location', 'Please refresh or capture location before copying.');
      return;
    }

    const locationString = `Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)} (Accuracy: ±${location.accuracy}m)`;
    await Clipboard.setStringAsync(locationString);

    Alert.alert(
      'Location Copied!',
      `Current coordinates copied to clipboard:\n\n${locationString}`
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Module 4 - Location</Text>
        <Text style={styles.headerSubtitle}>GPS Coordinates & Geolocation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Permission Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Permission</Text>
          <View style={styles.permissionRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View
              style={[
                styles.badge,
                hasPermission === true
                  ? styles.badgeGranted
                  : hasPermission === false
                  ? styles.badgeDenied
                  : styles.badgePending,
              ]}
            >
              <Text style={styles.badgeText}>
                {hasPermission === true
                  ? 'Granted'
                  : hasPermission === false
                  ? 'Denied'
                  : 'Pending Check'}
              </Text>
            </View>
          </View>

          {hasPermission !== true && (
            <TouchableOpacity
              style={styles.requestBtn}
              onPress={requestPermission}
              disabled={loading}
            >
              <Text style={styles.btnText}>📍 Request Location Permission</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Location Display Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current GPS Coordinates</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0284c7" />
              <Text style={styles.loadingText}>Fetching GPS position...</Text>
            </View>
          ) : location ? (
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Latitude:</Text>
                <Text style={styles.detailValue}>{location.latitude.toFixed(6)}°</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Longitude:</Text>
                <Text style={styles.detailValue}>{location.longitude.toFixed(6)}°</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Accuracy:</Text>
                <Text style={styles.accuracyValue}>±{location.accuracy} meters</Text>
              </View>

              {address ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.addressValue}>{address}</Text>
                </View>
              ) : null}

              {location.timestamp && (
                <Text style={styles.timestampText}>Updated at: {location.timestamp}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>
              No location data available. Press Refresh Location to fetch coordinates.
            </Text>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.refreshBtn]}
              onPress={fetchCurrentLocation}
              disabled={loading}
            >
              <Text style={styles.btnText}>🔄 Refresh Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.copyBtn]}
              onPress={copyLocationToClipboard}
              disabled={!location}
            >
              <Text style={styles.btnText}>📋 Copy Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Survey Integration Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Attached to Active Survey Draft</Text>
          <Text style={styles.infoText}>
            Survey ID:{' '}
            <Text style={{ fontWeight: 'bold', color: '#0ea5e9' }}>
              {draftSurvey.surveyId}
            </Text>
          </Text>
          <Text style={styles.infoSubText}>
            Fetched coordinates are automatically saved to your draft inspection report for Module 7 preview.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    color: '#cbd5e1',
    fontSize: 15,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeGranted: {
    backgroundColor: '#059669',
  },
  badgeDenied: {
    backgroundColor: '#dc2626',
  },
  badgePending: {
    backgroundColor: '#d97706',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  requestBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 14,
  },
  detailsBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  accuracyValue: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  addressValue: {
    color: '#cbd5e1',
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  timestampText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'right',
  },
  noDataText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  refreshBtn: {
    backgroundColor: '#0284c7',
  },
  copyBtn: {
    backgroundColor: '#0d9488',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#0f2942',
    borderColor: '#0284c7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  infoTitle: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  infoSubText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
});
