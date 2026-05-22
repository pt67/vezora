import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useStream } from '@/contexts/stream-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { userName, setUserName } = useStream();
  const { preferences, updateUserName } = useUserPreferences();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    if (preferences) {
      setUserName(preferences.userName);
      setTempName(preferences.userName);
    }
  }, [preferences, setUserName]);

  const handleSaveName = async () => {
    if (tempName.trim()) {
      await updateUserName(tempName);
      setUserName(tempName);
      setIsEditingName(false);
    } else {
      Alert.alert('Error', 'Please enter a valid name');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">GoStreamer</ThemedText>
          <ThemedText style={styles.subtitle}>Live streaming made simple</ThemedText>
        </View>

        {/* User Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault,
            },
          ]}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={48} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              {isEditingName ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    style={[
                      styles.nameInput,
                      {
                        color: '#000',
                        borderColor: Colors[colorScheme ?? 'light'].tint,
                      },
                    ]}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Your name"
                  />
                  <TouchableOpacity onPress={handleSaveName}>
                    <ThemedText style={styles.saveButton}>Save</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsEditingName(true)}>
                  <ThemedText type="defaultSemiBold" style={styles.userName}>
                    {tempName || 'Anonymous'}
                  </ThemedText>
                </TouchableOpacity>
              )}
              <ThemedText style={styles.userStatus}>Ready to stream</ThemedText>
            </View>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <ThemedText type="subtitle" style={styles.actionsTitle}>
            What would you like to do?
          </ThemedText>

          {/* Stream Action */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.streamCard,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: '#4CAF50',
              },
            ]}
            onPress={() => router.push('/(tabs)/stream')}>
            <View style={styles.actionIcon}>
              <Ionicons name="videocam" size={32} color="#4CAF50" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                Go Live
              </ThemedText>
              <ThemedText style={styles.actionDescription}>
                Start broadcasting to viewers
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>

          {/* Watch Action */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.watchCard,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: '#2196F3',
              },
            ]}
            onPress={() => router.push('/(tabs)/watch')}>
            <View style={styles.actionIcon}>
              <Ionicons name="play-circle" size={32} color="#2196F3" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                Watch Streams
              </ThemedText>
              <ThemedText style={styles.actionDescription}>
                Join and watch live streams
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <ThemedText type="subtitle" style={styles.tipsTitle}>
            Tips for Great Streams
          </ThemedText>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <ThemedText style={styles.tipText}>Check your internet connection</ThemedText>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <ThemedText style={styles.tipText}>Ensure good lighting for best quality</ThemedText>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <ThemedText style={styles.tipText}>Engage with your viewers in chat</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  profileCard: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: '#fff',
  },
  editNameContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveButton: {
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userStatus: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  actionsTitle: {
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    gap: 12,
  },
  streamCard: {
    borderColor: '#4CAF50',
  },
  watchCard: {
    borderColor: '#2196F3',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    opacity: 0.6,
  },
  tipsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  tipsTitle: {
    marginBottom: 12,
    color: '#4CAF50',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    flex: 1,
  },
});

