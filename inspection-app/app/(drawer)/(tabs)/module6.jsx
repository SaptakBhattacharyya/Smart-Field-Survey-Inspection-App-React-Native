import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useSurvey } from '@/constants/SurveyContext';

export default function Module6Screen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const { draftSurvey, setDraftNotes } = useSurvey();

  const [clipboardContent, setClipboardContent] = useState('');
  const [localNotes, setLocalNotes] = useState(draftSurvey.notes || '');

  useEffect(() => {
    fetchCurrentClipboard();
  }, []);

  const fetchCurrentClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      setClipboardContent(text || '');
    } catch (err) {
      console.warn('Error reading clipboard:', err);
    }
  };

  const copySurveyId = async () => {
    const id = draftSurvey.surveyId || 'SRV-1046';
    await Clipboard.setStringAsync(id);
    await fetchCurrentClipboard();
    Alert.alert('Copied!', `Survey ID (${id}) copied to clipboard.`);
  };

  const copyContactNumber = async () => {
    const phone = draftSurvey.contact?.phoneNumber || '+91 98765 43210';
    await Clipboard.setStringAsync(phone);
    await fetchCurrentClipboard();
    Alert.alert('Copied!', `Contact Number (${phone}) copied to clipboard.`);
  };

  const copyLocation = async () => {
    let locStr = 'Lat: 22.572645, Long: 88.363892 (Accuracy: ±4.5m)';
    if (draftSurvey.location) {
      locStr = `Lat: ${draftSurvey.location.latitude.toFixed(6)}, Long: ${draftSurvey.location.longitude.toFixed(6)} (Accuracy: ±${draftSurvey.location.accuracy}m)`;
    }
    await Clipboard.setStringAsync(locStr);
    await fetchCurrentClipboard();
    Alert.alert('Copied!', `Location details copied to clipboard:\n\n${locStr}`);
  };

  const pasteIntoNotes = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Alert.alert('Empty Clipboard', 'There is no text currently copied in the clipboard.');
      return;
    }

    const updatedNotes = localNotes ? `${localNotes}\n${text}` : text;
    setLocalNotes(updatedNotes);
    setDraftNotes(updatedNotes);
    Alert.alert('Pasted!', 'Clipboard text successfully pasted into Notes field.');
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setClipboardContent('');
    Alert.alert('Clipboard Cleared', 'Clipboard buffer has been cleared.');
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Module 6 - Clipboard</Text>
        <Text style={styles.headerSubtitle}>
          Copy Inspection Details & Paste Notes
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clipboard Buffer Inspector</Text>
          <View style={styles.bufferBox}>
            <Text style={styles.bufferLabel}>Current Clipboard Content:</Text>
            <Text style={styles.bufferText}>
              {clipboardContent
                ? `"${clipboardContent}"`
                : '[ Clipboard is currently empty ]'}
            </Text>
          </View>

          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.smallBtn, styles.refreshBtn]}
              onPress={fetchCurrentClipboard}
            >
              <Text style={styles.smallBtnText}>Check Clipboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, styles.clearBtn]}
              onPress={clearClipboard}
            >
              <Text style={styles.smallBtnText}>Clear Clipboard</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Copy Tools</Text>

          <TouchableOpacity style={styles.copyActionRow} onPress={copySurveyId}>
            <View style={styles.copyInfo}>
              <Text style={styles.copyActionTitle}>Copy Survey ID</Text>
              <Text style={styles.copyActionValue}>
                {draftSurvey.surveyId || 'SRV-1046'}
              </Text>
            </View>
            <View style={styles.copyBadge}>
              <Text style={styles.copyBadgeText}>Copy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.copyActionRow} onPress={copyContactNumber}>
            <View style={styles.copyInfo}>
              <Text style={styles.copyActionTitle}>Copy Contact Number</Text>
              <Text style={styles.copyActionValue}>
                {draftSurvey.contact?.name
                  ? `${draftSurvey.contact.name} (${draftSurvey.contact.phoneNumber})`
                  : '+91 98765 43210'}
              </Text>
            </View>
            <View style={styles.copyBadge}>
              <Text style={styles.copyBadgeText}>Copy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.copyActionRow} onPress={copyLocation}>
            <View style={styles.copyInfo}>
              <Text style={styles.copyActionTitle}>Copy Current Location</Text>
              <Text style={styles.copyActionValue}>
                {draftSurvey.location
                  ? `Lat: ${draftSurvey.location.latitude.toFixed(4)}, Long: ${draftSurvey.location.longitude.toFixed(4)}`
                  : 'Lat: 22.5726, Long: 88.3639'}
              </Text>
            </View>
            <View style={styles.copyBadge}>
              <Text style={styles.copyBadgeText}>Copy</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.notesHeaderRow}>
            <Text style={styles.cardTitle}>Survey Notes Box</Text>
            <TouchableOpacity style={styles.pasteBtn} onPress={pasteIntoNotes}>
              <Text style={styles.pasteBtnText}>Paste Clipboard</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Type or paste inspection notes here..."
            placeholderTextColor="#64748b"
            value={localNotes}
            onChangeText={(text) => {
              setLocalNotes(text);
              setDraftNotes(text);
            }}
          />

          <Text style={styles.notesHelpText}>
            {`Tapping "Paste Clipboard" inserts whatever text is currently stored on your device's clipboard.`}
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#0f172a',
    marginBottom: 12,
  },
  bufferBox: {
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  bufferLabel: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 12,
    marginBottom: 4,
  },
  bufferText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshBtn: {
    backgroundColor: '#0284c7',
  },
  clearBtn: {
    backgroundColor: '#dc2626',
  },
  smallBtnText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 13,
    fontWeight: 'bold',
  },
  copyActionRow: {
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  copyInfo: {
    flex: 1,
    marginRight: 10,
  },
  copyActionTitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  copyActionValue: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  copyBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyBadgeText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pasteBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pasteBtnText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  notesHelpText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 8,
  },
});
