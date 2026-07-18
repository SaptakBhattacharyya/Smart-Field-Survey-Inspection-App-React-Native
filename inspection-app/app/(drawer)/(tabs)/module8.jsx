import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {View,Text,StyleSheet,FlatList,TextInput,TouchableOpacity,Alert,Modal,Image,ScrollView,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSurvey } from '@/constants/SurveyContext';

export default function Module8Screen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const { submittedSurveys, deleteSurvey } = useSurvey();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const priorityFilters = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  const filteredSurveys = submittedSurveys.filter((survey) => {
    const matchesSearch =
      survey.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      selectedPriority === 'All' || survey.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const handleDelete = (id, siteName) => {
    Alert.alert(
      'Delete Survey Confirmation',
      `Are you sure you want to permanently delete survey report "${id}" (${siteName || 'Site'})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(id);
            if (selectedSurvey?.id === id) {
              setModalVisible(false);
            }
            Alert.alert('Deleted', `Survey ${id} has been removed.`);
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

  const openDetailsModal = (survey) => {
    setSelectedSurvey(survey);
    setModalVisible(true);
  };

  const renderSurveyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surveyCard}
      onPress={() => openDetailsModal(item)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.surveyId}>{item.id}</Text>
          <Text style={styles.siteName}>{item.siteName || 'Unnamed Site'}</Text>
        </View>

        <View
          style={[styles.priorityBadge, getPriorityStyle(item.priority)]}
        >
          <Text style={styles.priorityText}>{item.priority || 'Normal'}</Text>
        </View>
      </View>

      <Text style={styles.clientName}>Client: {item.clientName || 'N/A'}</Text>
      <Text style={styles.dateText}>Date: {item.date}</Text>

      {item.description ? (
        <Text style={styles.descSnippet} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>View Full Report</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id, item.siteName)}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Module 8 - Survey History</Text>
        <Text style={styles.headerSubtitle}>
          Submitted Field Inspection Records
        </Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search history by site, client, or ID..."
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

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {priorityFilters.map((pri) => (
            <TouchableOpacity
              key={pri}
              style={[
                styles.filterPill,
                selectedPriority === pri && styles.filterPillActive,
              ]}
              onPress={() => setSelectedPriority(pri)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedPriority === pri && styles.filterPillTextActive,
                ]}
              >
                {pri} {pri === 'All' ? `(${submittedSurveys.length})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={renderSurveyItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="time-outline" size={44} color="#334155" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Surveys Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedPriority !== 'All'
                ? 'No survey report matches your active filters.'
                : 'No submitted surveys in history yet.'}
            </Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedSurvey && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selectedSurvey.id}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedSurvey.siteName}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Priority:</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      getPriorityStyle(selectedSurvey.priority),
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {selectedSurvey.priority}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Client Name:</Text>
                  <Text style={styles.modalValue}>
                    {selectedSurvey.clientName}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Date:</Text>
                  <Text style={styles.modalValue}>{selectedSurvey.date}</Text>
                </View>

                <View style={styles.modalBlock}>
                  <Text style={styles.modalBlockLabel}>Description:</Text>
                  <Text style={styles.modalBlockText}>
                    {selectedSurvey.description || 'No description provided.'}
                  </Text>
                </View>

                {selectedSurvey.photoUri ? (
                  <View style={styles.modalBlock}>
                    <Text style={styles.modalBlockLabel}>Photo:</Text>
                    <Image
                      source={{ uri: selectedSurvey.photoUri }}
                      style={styles.modalPhoto}
                      resizeMode="cover"
                    />
                  </View>
                ) : null}

                {selectedSurvey.contact ? (
                  <View style={styles.modalBlock}>
                    <Text style={styles.modalBlockLabel}>Contact Personnel:</Text>
                    <Text style={styles.modalBlockText}>
                      {selectedSurvey.contact.name} (
                      {selectedSurvey.contact.phoneNumber})
                    </Text>
                  </View>
                ) : null}

                {selectedSurvey.location ? (
                  <View style={styles.modalBlock}>
                    <Text style={styles.modalBlockLabel}>GPS Location:</Text>
                    <Text style={styles.modalBlockText}>
                      Lat: {selectedSurvey.location.latitude}, Long:{' '}
                      {selectedSurvey.location.longitude} (±
                      {selectedSurvey.location.accuracy}m)
                    </Text>
                  </View>
                ) : null}

                <View style={styles.modalBlock}>
                  <Text style={styles.modalBlockLabel}>Inspection Notes:</Text>
                  <Text style={styles.modalBlockText}>
                    {selectedSurvey.notes || 'No inspection notes attached.'}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalDeleteBtn}
                  onPress={() =>
                    handleDelete(selectedSurvey.id, selectedSurvey.siteName)
                  }
                >
                  <Text style={styles.modalDeleteText}>
                    Delete Survey Record
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  searchBox: {
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
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  filterPill: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  filterPillActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  filterPillText: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  surveyCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  surveyId: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  siteName: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  clientName: {
    color: isDark ? '#cbd5e1' : '#555',
    fontSize: 13,
  },
  dateText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  descSnippet: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#334155' : '#ccc',
  },
  viewDetailsText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#ccc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#334155' : '#ccc',
    paddingBottom: 12,
    marginBottom: 12,
  },
  modalTitle: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 15,
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalText: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  modalLabel: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 14,
  },
  modalValue: {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBlock: {
    marginTop: 10,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    padding: 10,
    borderRadius: 8,
  },
  modalBlockLabel: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalBlockText: {
    color: isDark ? '#cbd5e1' : '#555',
    fontSize: 13,
  },
  modalPhoto: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    marginTop: 4,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: isDark ? '#334155' : '#ccc',
    paddingTop: 12,
  },
  modalDeleteBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalDeleteText: {
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
