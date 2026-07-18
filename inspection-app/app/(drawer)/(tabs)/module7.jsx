import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSurvey } from '@/constants/SurveyContext';

export default function Module7Screen() {
  const router = useRouter();
  const { draftSurvey, updateDraft, setDraftNotes, submitCurrentSurvey } = useSurvey();

  const [isEditing, setIsEditing] = useState(false);
  const [siteName, setSiteName] = useState(draftSurvey.siteName || '');
  const [clientName, setClientName] = useState(draftSurvey.clientName || '');
  const [priority, setPriority] = useState(draftSurvey.priority || 'Medium');
  const [description, setDescription] = useState(draftSurvey.description || '');
  const [notes, setNotes] = useState(draftSurvey.notes || '');

  const saveEdits = () => {
    updateDraft('siteName', siteName);
    updateDraft('clientName', clientName);
    updateDraft('priority', priority);
    updateDraft('description', description);
    setDraftNotes(notes);
    setIsEditing(false);
    Alert.alert('Survey Updated', 'Draft inspection details updated successfully!');
  };

  const handleSubmit = () => {
    if (!draftSurvey.siteName && !siteName) {
      Alert.alert('Validation Error', 'Please enter a Site Name before submitting.');
      return;
    }

    Alert.alert(
      'Submit Survey Inspection',
      'Are you sure you want to finalize and submit this survey report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Report',
          style: 'default',
          onPress: () => {
            const newId = submitCurrentSurvey();
            Alert.alert(
              'Survey Submitted!',
              `Survey report ${newId} has been successfully stored in Survey History.`,
              [
                {
                  text: 'View History',
                  onPress: () => router.push('/(tabs)/module8'),
                },
                { text: 'OK' },
              ]
            );
          },
        },
      ]
    );
  };

  const getPriorityStyle = (pri) => {
    switch (pri) {
      case 'Urgent':
        return { backgroundColor: '#dc2626', color: '#ffffff' };
      case 'High':
        return { backgroundColor: '#ea580c', color: '#ffffff' };
      case 'Medium':
        return { backgroundColor: '#d97706', color: '#ffffff' };
      case 'Low':
        return { backgroundColor: '#059669', color: '#ffffff' };
      default:
        return { backgroundColor: '#475569', color: '#ffffff' };
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Module 7 - Survey Preview</Text>
          <Text style={styles.headerSubtitle}>
            Inspection Summary & Final Submission
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.editHeaderBtn, isEditing ? styles.saveBtn : styles.editBtn]}
          onPress={isEditing ? saveEdits : () => setIsEditing(true)}
        >
          <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.idBanner}>
          <Text style={styles.idText}>ID: {draftSurvey.surveyId}</Text>
          <View style={styles.draftBadge}>
            <Text style={styles.draftBadgeText}>Draft Mode</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Site & Client Details</Text>

          {isEditing ? (
            <View style={styles.editForm}>
              <Text style={styles.inputLabel}>Site Name:</Text>
              <TextInput
                style={styles.input}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Enter Site Name"
                placeholderTextColor="#64748b"
              />

              <Text style={styles.inputLabel}>Client Name:</Text>
              <TextInput
                style={styles.input}
                value={clientName}
                onChangeText={setClientName}
                placeholder="Enter Client Name"
                placeholderTextColor="#64748b"
              />

              <Text style={styles.inputLabel}>Priority Level:</Text>
              <View style={styles.priorityRow}>
                {['Low', 'Medium', 'High', 'Urgent'].map((pri) => (
                  <TouchableOpacity
                    key={pri}
                    style={[
                      styles.priOption,
                      priority === pri && styles.priOptionActive,
                    ]}
                    onPress={() => setPriority(pri)}
                  >
                    <Text
                      style={[
                        styles.priOptionText,
                        priority === pri && styles.priOptionTextActive,
                      ]}
                    >
                      {pri}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Description:</Text>
              <TextInput
                style={[styles.input, { minHeight: 60 }]}
                multiline
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#64748b"
              />
            </View>
          ) : (
            <View style={styles.infoGroup}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Site Name:</Text>
                <Text style={styles.valueHighlight}>
                  {draftSurvey.siteName || 'Not specified'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Client Name:</Text>
                <Text style={styles.value}>
                  {draftSurvey.clientName || 'Not specified'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Priority:</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    getPriorityStyle(draftSurvey.priority),
                  ]}
                >
                  <Text style={styles.priorityText}>{draftSurvey.priority}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{draftSurvey.date}</Text>
              </View>

              <View style={styles.descBox}>
                <Text style={styles.descLabel}>Description:</Text>
                <Text style={styles.descText}>
                  {draftSurvey.description || 'No description provided.'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Captured Photo (Module 3)</Text>
          {draftSurvey.photoUri ? (
            <Image
              source={{ uri: draftSurvey.photoUri }}
              style={styles.photoPreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.placeholderText}>No Photo Captured</Text>
              <Text style={styles.placeholderSub}>
                Use Module 3 Camera to attach photo to survey draft.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Assigned Contact (Module 5)</Text>
          {draftSurvey.contact ? (
            <View style={styles.subDetailBox}>
              <Text style={styles.contactName}>{draftSurvey.contact.name}</Text>
              <Text style={styles.contactPhone}>{draftSurvey.contact.phoneNumber}</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>
              No contact assigned. Select contact from Module 5.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>GPS Location (Module 4)</Text>
          {draftSurvey.location ? (
            <View style={styles.subDetailBox}>
              <Text style={styles.locCoord}>
                Lat: {draftSurvey.location.latitude?.toFixed(6)}°, Long:{' '}
                {draftSurvey.location.longitude?.toFixed(6)}°
              </Text>
              <Text style={styles.locAccuracy}>
                Accuracy: ±{draftSurvey.location.accuracy} meters
              </Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>
              No location captured. Refresh location from Module 4.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Inspection Notes (Module 6)</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Inspection notes..."
              placeholderTextColor="#64748b"
            />
          ) : (
            <Text style={styles.notesValue}>
              {draftSurvey.notes || 'No inspection notes added.'}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Finalize & Submit Survey</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  editHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editBtn: {
    backgroundColor: '#0284c7',
  },
  saveBtn: {
    backgroundColor: '#059669',
  },
  editBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
  },
  idBanner: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  idText: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  draftBadge: {
    backgroundColor: '#d97706',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  draftBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  infoGroup: {},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
  },
  value: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  valueHighlight: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  descBox: {
    marginTop: 8,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 6,
  },
  descLabel: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 2,
  },
  descText: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  editForm: {
    gap: 8,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  priOption: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  priOptionActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  priOptionText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  priOptionTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  photoPlaceholder: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  subDetailBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
  },
  contactName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#38bdf8',
    fontSize: 13,
    marginTop: 2,
  },
  locCoord: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  locAccuracy: {
    color: '#4ade80',
    fontSize: 12,
    marginTop: 2,
  },
  noDataText: {
    color: '#64748b',
    fontStyle: 'italic',
    fontSize: 13,
  },
  notesValue: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
