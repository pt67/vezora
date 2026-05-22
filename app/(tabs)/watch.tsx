import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useStream } from '@/contexts/stream-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WatchScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { streams, refreshStreams, joinStream } = useStream();
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadStreams();
    }, [])
  );

  const loadStreams = async () => {
    setLoading(true);
    try {
      await refreshStreams();
    } catch (error) {
      Alert.alert('Error', 'Failed to load streams');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinStream = async (streamId: string) => {
    setJoining(streamId);
    try {
      await joinStream(streamId);
      router.push(`/watch/${streamId}`);
    } catch (error) {
      Alert.alert('Error', `Failed to join stream: ${error}`);
    } finally {
      setJoining(null);
    }
  };

  const renderStreamItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.streamCard,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        },
      ]}
      onPress={() => handleJoinStream(item.id)}
      disabled={joining === item.id}>
      <View style={styles.streamContent}>
        <ThemedText type="defaultSemiBold" style={styles.streamTitle}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.broadcasterName}>
          by {item.broadcasterName}
        </ThemedText>
        <View style={styles.streamFooter}>
          <ThemedText style={styles.viewerCount}>
            👁️ {item.viewerCount} watching
          </ThemedText>
          <ThemedText style={styles.timestamp}>
            {new Date(item.startedAt).toLocaleTimeString()}
          </ThemedText>
        </View>
      </View>
      {joining === item.id && (
        <ActivityIndicator
          color={Colors[colorScheme ?? 'light'].tint}
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Live Streams</ThemedText>
        <ThemedText style={styles.subtitle}>
          {streams.length} streams available
        </ThemedText>
      </View>

      {streams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {loading ? 'Loading streams...' : 'No active streams'}
          </ThemedText>
          {!loading && (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint },
              ]}
              onPress={loadStreams}>
              <ThemedText style={styles.buttonText}>Refresh</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={streams}
          renderItem={renderStreamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadStreams}
              tintColor={Colors[colorScheme ?? 'light'].tint}
            />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  streamCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 100,
  },
  streamContent: {
    flex: 1,
    gap: 4,
  },
  streamTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  broadcasterName: {
    fontSize: 13,
    opacity: 0.7,
  },
  streamFooter: {
    marginTop: 8,
    gap: 4,
  },
  viewerCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.6,
  },
  loader: {
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
