import React, { useState, useRef, useEffect } from 'react';
import { View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert,Image,ActivityIndicator,Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSurvey } from '@/constants/SurveyContext';

export default function Module3Screen() {
  const { setDraftPhoto } = useSurvey();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('back');
  const [cameraFlash, setCameraFlash] = useState('off');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const cameraRef = useRef(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.granted);

      try {
        const mediaStatus = await MediaLibrary.getPermissionsAsync();
        setHasMediaPermission(mediaStatus.granted);
      } catch (err) {
        console.warn('Media library permission check error:', err);
        setHasMediaPermission(false);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestPermissions = async () => {
    setLoading(true);
    setLoadingText('Requesting permissions...');
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.granted);

      let mediaGranted = false;
      try {
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        mediaGranted = mediaStatus.granted;
        setHasMediaPermission(mediaGranted);
      } catch (mediaErr) {
        console.warn('Expo Go media library restriction:', mediaErr);
        setHasMediaPermission(false);
      }

      if (!cameraStatus.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Camera permission is required to capture inspection photos.'
        );
      } else {
        Alert.alert('Permissions Granted', 'Camera and gallery permissions granted!');
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to request permissions.');
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  const handleOpenCamera = async () => {
    if (!hasCameraPermission) {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.granted);

      if (!cameraStatus.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to open camera.');
        return;
      }
    }

    if (hasMediaPermission === null) {
      try {
        const mediaStatus = await MediaLibrary.getPermissionsAsync();
        setHasMediaPermission(mediaStatus.granted);
      } catch (_err) {
        setHasMediaPermission(false);
      }
    }

    setLoading(true);
    setLoadingText('Opening Camera...');

    setTimeout(() => {
      setLoading(false);
      setLoadingText('');
      setIsCameraActive(true);
    }, 400);
  };

  const handleCapturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);
      setLoadingText('Capturing photo & saving to gallery...');

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      const captureTimestamp = new Date().toLocaleString();
      let isSaved = false;

      // Ensure gallery permission is checked/requested
      let mediaGranted = hasMediaPermission;
      if (!mediaGranted) {
        try {
          const mediaStatus = await MediaLibrary.requestPermissionsAsync();
          mediaGranted = mediaStatus.granted || mediaStatus.status === 'granted';
          setHasMediaPermission(mediaGranted);
        } catch (pErr) {
          console.warn('Error requesting media library permissions:', pErr);
        }
      }

      if (mediaGranted) {
        try {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          isSaved = true;
        } catch (saveError) {
          console.warn('saveToLibraryAsync failed, trying createAssetAsync:', saveError);
          try {
            await MediaLibrary.createAssetAsync(photo.uri);
            isSaved = true;
          } catch (e2) {
            console.warn('createAssetAsync failed:', e2);
          }
        }
      }

      setCapturedPhoto({
        uri: photo.uri,
        timestamp: captureTimestamp,
        savedToGallery: isSaved,
      });
      setDraftPhoto(photo.uri);

      setIsCameraActive(false);

      if (isSaved) {
        Alert.alert('Photo Saved to Gallery!', 'Your photo was successfully captured and saved to your device gallery.');
      } else {
        Alert.alert(
          'Photo Captured!',
          'Photo captured and stored in preview memory.'
        );
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Capture Failed', 'Could not capture photo. Please try again.');
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  const handleSaveToGallery = async () => {
    if (!capturedPhoto || !capturedPhoto.uri) return;

    try {
      setLoading(true);
      setLoadingText('Saving photo to gallery...');

      let mediaGranted = hasMediaPermission;
      if (!mediaGranted) {
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        mediaGranted = mediaStatus.granted || mediaStatus.status === 'granted';
        setHasMediaPermission(mediaGranted);
      }

      if (!mediaGranted) {
        Alert.alert('Permission Denied', 'Gallery access permission is required to save photos.');
        return;
      }

      let saved = false;
      try {
        await MediaLibrary.saveToLibraryAsync(capturedPhoto.uri);
        saved = true;
      } catch (_err) {
        try {
          await MediaLibrary.createAssetAsync(capturedPhoto.uri);
          saved = true;
        } catch (err2) {
          console.error('Save error:', err2);
        }
      }

      if (saved) {
        setCapturedPhoto((prev) => ({ ...prev, savedToGallery: true }));
        Alert.alert('Saved!', 'Photo has been saved to your device gallery.');
      } else {
        Alert.alert('Save Failed', 'Could not save photo to gallery.');
      }
    } catch (err) {
      console.error('Save to gallery error:', err);
      Alert.alert('Error', 'An error occurred while saving photo to gallery.');
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setDraftPhoto(null);
    handleOpenCamera();
  };

  const handleDeletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this captured photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCapturedPhoto(null);
            setDraftPhoto(null);
            Alert.alert('Deleted', 'The preview photo has been removed.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Field Survey</Text>
        <Text style={styles.headerBadge}>Module 3: Camera</Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>{loadingText || 'Please wait...'}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Module 3 - Inspection Camera</Text>
          <Text style={styles.text}>
            Capture field photos, view timestamps, preview images, and save captures.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Permissions Status</Text>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>Camera Access:</Text>
            <Text style={[styles.statusText, hasCameraPermission ? styles.grantedText : styles.deniedText]}>
              {hasCameraPermission === null ? 'Checking...' : hasCameraPermission ? 'Granted' : 'Denied'}
            </Text>
          </View>

          {!hasCameraPermission && (
            <TouchableOpacity style={styles.permissionBtn} onPress={requestPermissions}>
              <Text style={styles.permissionBtnText}>Request Camera Permission</Text>
            </TouchableOpacity>
          )}
        </View>

        {!capturedPhoto && !isCameraActive && (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Camera Controls</Text>
            <TouchableOpacity style={styles.openCameraBtn} onPress={handleOpenCamera}>
              <Text style={styles.openCameraBtnText}>Open Inspection Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {capturedPhoto && (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Captured Photo Preview</Text>

            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} resizeMode="cover" />

              {capturedPhoto.savedToGallery && (
                <View style={styles.galleryBadge}>
                  <Text style={styles.galleryBadgeText}>Saved to Gallery</Text>
                </View>
              )}
            </View>

            <View style={styles.timestampContainer}>
              <Text style={styles.timestampLabel}>Capture Date & Time:</Text>
              <Text style={styles.timestampValue}>{capturedPhoto.timestamp}</Text>
            </View>

            <View style={styles.actionsRow}>
              {!capturedPhoto.savedToGallery && (
                <TouchableOpacity style={styles.saveGalleryBtn} onPress={handleSaveToGallery}>
                  <Text style={styles.actionBtnText}>Save to Gallery</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.retakeBtn} onPress={handleRetakePhoto}>
                <Text style={styles.actionBtnText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeletePhoto}>
                <Text style={styles.actionBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={isCameraActive} animationType="slide" onRequestClose={() => setIsCameraActive(false)}>
        <View style={styles.cameraModalContainer}>
          {hasCameraPermission ? (
            <CameraView
              style={styles.cameraView}
              facing={cameraFacing}
              flash={cameraFlash}
              ref={cameraRef}
            >
              <View style={styles.cameraTopBar}>
                <TouchableOpacity
                  style={styles.cameraControlBtn}
                  onPress={() => setIsCameraActive(false)}
                >
                  <Text style={styles.cameraControlText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cameraControlBtn}
                  onPress={() => setCameraFlash((prev) => (prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'))}
                >
                  <Text style={styles.cameraControlText}>
                    Flash: {cameraFlash.toUpperCase()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cameraControlBtn}
                  onPress={() => setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
                >
                  <Text style={styles.cameraControlText}>
                    Flip
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cameraBottomBar}>
                <TouchableOpacity style={styles.shutterBtn} onPress={handleCapturePhoto}>
                  <View style={styles.shutterInner} />
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionFallback}>
              <Text style={styles.fallbackTitle}>Camera Permission Required</Text>
              <Text style={styles.fallbackText}>Please grant camera permission to use the scanner.</Text>
              <TouchableOpacity style={styles.permissionBtn} onPress={requestPermissions}>
                <Text style={styles.permissionBtnText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBadge: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '700',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  text: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  grantedText: {
    color: '#28a745',
  },
  deniedText: {
    color: '#dc3545',
  },
  permissionBtn: {
    marginTop: 12,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  permissionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  openCameraBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  openCameraBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 8,
  },
  galleryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(40, 167, 69, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  galleryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timestampContainer: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  timestampLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timestampValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  saveGalleryBtn: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  cameraModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  cameraControlBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraControlText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  cameraBottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  noticeCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffebaba0',
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#fff8e6',
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
});
