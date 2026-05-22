import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useStream } from '@/contexts/stream-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function StreamScreen() {
  const colorScheme = useColorScheme();
  const { startStream, endStream, isStreaming, activeStream, sendFrame } = useStream();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [streamTitle, setStreamTitle] = useState('My Stream');
  const [isStarting, setIsStarting] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (isStreaming && activeStream) {
      // Simulate sending frames every 100ms
      frameIntervalRef.current = setInterval(() => {
        if (cameraRef.current) {
          // In a real app, you'd capture actual camera frames here
          sendFrame(activeStream.id, {
            timestamp: Date.now(),
            data: 'frame_data', // Placeholder
          });
        }
      }, 100);
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
    };
  }, [isStreaming, activeStream, sendFrame]);

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      Alert.alert('Error', 'Please enter a stream title');
      return;
    }

    setIsStarting(true);
    try {
      await startStream(streamTitle);
    } catch (error) {
      Alert.alert('Error', `Failed to start stream: ${error}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopStream = async () => {
    if (!activeStream) return;

    Alert.alert('Stop Stream', 'Are you sure you want to stop the stream?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Stop',
        onPress: async () => {
          try {
            await endStream(activeStream.id);
            setStreamTitle('My Stream');
          } catch (error) {
            Alert.alert('Error', `Failed to stop stream: ${error}`);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading camera permissions...</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Camera Access Required</ThemedText>
        <ThemedText style={styles.description}>
          This app needs camera access to stream videos.
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {isStreaming && activeStream ? (
        <>
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} ref={cameraRef} />
            <View style={styles.streamInfoOverlay}>
              <ThemedText style={styles.streamTitle}>{activeStream.title}</ThemedText>
              <ThemedText style={styles.streamUrl}>
                Viewers: {activeStream.viewerCount || 0}
              </ThemedText>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStopStream}
              disabled={isStarting}>
              <ThemedText style={styles.buttonText}>Stop Stream</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.previewContainer}>
            <CameraView style={styles.camera} ref={cameraRef} />
          </View>

          <View style={styles.formContainer}>
            <ThemedText type="subtitle">Stream Title</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
              ]}
              placeholder="Enter stream title"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
              value={streamTitle}
              onChangeText={setStreamTitle}
              editable={!isStarting}
            />

            <TouchableOpacity
              style={[
                styles.button,
                styles.startButton,
                isStarting && styles.buttonDisabled,
              ]}
              onPress={handleStartStream}
              disabled={isStarting}>
              {isStarting ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.buttonText}>Go Live</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 0.6,
    backgroundColor: '#000',
  },
  streamInfoOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  streamTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streamUrl: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  formContainer: {
    flex: 0.4,
    padding: 16,
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    fontSize: 16,
  },
  controlsContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    marginVertical: 16,
    textAlign: 'center',
  },
});
