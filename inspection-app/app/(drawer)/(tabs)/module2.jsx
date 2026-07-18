import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {View,Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSurvey } from '@/constants/SurveyContext';

export default function Module2Screen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const { setDraftSurvey } = useSurvey();
  const studentDetails = {
    name: 'Saptak Bhattacharyya',
    studentId: '002',
    department: 'Field Inspection',
    session: '2025-2026',
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState(getTodayDate());

  const [errors, setErrors] = useState({});

  const [createdSurveys, setCreatedSurveys] = useState([
    {
      id: 'SRV-1045',
      siteName: 'Riverside Power Station',
      clientName: 'EcoPower Corp',
      description: 'Quarterly environmental compliance and safety audit.',
      priority: 'High',
      date: '2026-07-15',
    },
  ]);

  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  const validateForm = () => {
    const newErrors = {};

    if (!siteName.trim()) {
      newErrors.siteName = 'Site Name is required';
    }
    if (!clientName.trim()) {
      newErrors.clientName = 'Client Name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setSiteName('');
    setClientName('');
    setDescription('');
    setPriority('Medium');
    setDate(getTodayDate());
    setErrors({});
  };

  const handleCreateSurvey = () => {
    if (validateForm()) {
      const newSurvey = {
        id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        siteName: siteName.trim(),
        clientName: clientName.trim(),
        description: description.trim(),
        priority,
        date: date.trim(),
      };

      setCreatedSurveys([newSurvey, ...createdSurveys]);
      setDraftSurvey((prev) => ({
        ...prev,
        surveyId: newSurvey.id,
        siteName: newSurvey.siteName,
        clientName: newSurvey.clientName,
        description: newSurvey.description,
        priority: newSurvey.priority,
        date: newSurvey.date,
      }));

      Alert.alert(
        'Draft Created!',
        `Survey ${newSurvey.id} set as active draft. Continue to Module 3 (Photo), Module 4 (Location), Module 5 (Contact), Module 6 (Notes), or Module 7 (Preview).`
      );
      resetForm();
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
    }
  };

  const handleResetForm = () => {
    resetForm();
  };

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'Urgent':
        return styles.priorityUrgent;
      case 'High':
        return styles.priorityHigh;
      case 'Medium':
        return styles.priorityMedium;
      default:
        return styles.priorityLow;
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Field Survey</Text>
        <Text style={styles.headerStatus}>GPS: Active</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inspector: {studentDetails.name}</Text>
          <Text style={styles.text}>Student ID: {studentDetails.studentId}</Text>
          <Text style={styles.text}>Department: {studentDetails.department}</Text>
        </View>

        <Text style={styles.sectionHeader}>Module 2 - Create Survey</Text>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Site Name <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.siteName && styles.inputError]}
              placeholder="e.g. Sector 5 Tech Park"
              placeholderTextColor="#999"
              value={siteName}
              onChangeText={(text) => {
                setSiteName(text);
                if (errors.siteName) setErrors({ ...errors, siteName: null });
              }}
            />
            {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Client Name <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.clientName && styles.inputError]}
              placeholder="e.g. Techno Infra Corp"
              placeholderTextColor="#999"
              value={clientName}
              onChangeText={(text) => {
                setClientName(text);
                if (errors.clientName) setErrors({ ...errors, clientName: null });
              }}
            />
            {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Description <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              placeholder="Enter survey scope and site observations..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors({ ...errors, description: null });
              }}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Priority <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.priorityRow}>
              {priorityOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.priorityChip,
                    priority === opt && styles.priorityChipSelected,
                  ]}
                  onPress={() => {
                    setPriority(opt);
                    if (errors.priority) setErrors({ ...errors, priority: null });
                  }}
                >
                  <Text
                    style={[
                      styles.priorityChipText,
                      priority === opt && styles.priorityChipTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.dateLabelRow}>
              <Text style={styles.label}>
                Date (YYYY-MM-DD) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDate(getTodayDate());
                  if (errors.date) setErrors({ ...errors, date: null });
                }}
              >
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
              value={date}
              onChangeText={(text) => {
                setDate(text);
                if (errors.date) setErrors({ ...errors, date: null });
              }}
            />
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateSurvey}>
              <Text style={styles.submitBtnText}>Create Survey</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={handleResetForm}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Created Surveys ({createdSurveys.length})</Text>
        {createdSurveys.map((item) => (
          <View key={item.id} style={styles.surveyItem}>
            <View style={styles.surveyHeader}>
              <Text style={styles.surveyTitle}>{item.id} - {item.siteName}</Text>
              <View style={[styles.priorityBadge, getPriorityStyle(item.priority)]}>
                <Text style={styles.priorityBadgeText}>{item.priority}</Text>
              </View>
            </View>
            <Text style={styles.text}>Client: {item.clientName}</Text>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.descText}>Description: {item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: isDark ? '#0f172a' : '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: isDark ? '#334155' : '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    fontSize: 13,
    color: 'green',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
    borderRadius: 6,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: isDark ? '#cbd5e1' : '#333',
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    color: isDark ? '#94a3b8' : '#555',
    marginTop: 2,
    fontStyle: 'italic',
  },
  formCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
    borderRadius: 8,
    backgroundColor: isDark ? '#1e293b' : '#fafafa',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#cbd5e1' : '#333',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#d9534f',
  },
  input: {
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: isDark ? '#1e293b' : '#fff',
    color: isDark ? '#cbd5e1' : '#333',
  },
  textArea: {
    minHeight: 80,
  },
  inputError: {
    borderColor: '#d9534f',
    backgroundColor: '#fff0f0',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 12,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: isDark ? '#1e293b' : '#fff',
  },
  priorityChipSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  priorityChipText: {
    fontSize: 13,
    color: isDark ? '#cbd5e1' : '#333',
    fontWeight: '500',
  },
  priorityChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayBtnText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  surveyItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ddd',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: isDark ? '#1e293b' : '#fff',
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  surveyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  priorityUrgent: {
    backgroundColor: '#d9534f',
  },
  priorityHigh: {
    backgroundColor: '#f0ad4e',
  },
  priorityMedium: {
    backgroundColor: '#0275d8',
  },
  priorityLow: {
    backgroundColor: '#5cb85c',
  },
});
