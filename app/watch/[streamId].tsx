import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useStream } from '@/contexts/stream-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatMessage {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
}

export default function ViewStreamScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { streamId } = useLocalSearchParams();
  const { activeStream, leaveStream, sendChatMessage, socket } = useStream();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const chatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!socket || !streamId) return;

    const handleChatMessage = (data: any) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}_${Math.random()}`,
          userName: data.userName,
          message: data.message,
          timestamp: new Date(data.timestamp).toLocaleTimeString(),
        },
      ]);
    };

    const handleViewerJoined = (data: any) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}_${Math.random()}`,
          userName: 'System',
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    const handleViewerLeft = (data: any) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}_${Math.random()}`,
          userName: 'System',
          message: `Viewer left. Viewers: ${data.viewerCount}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    socket.on('stream:chatMessage', handleChatMessage);
    socket.on('stream:viewerJoined', handleViewerJoined);
    socket.on('stream:viewerLeft', handleViewerLeft);

    return () => {
      socket.off('stream:chatMessage', handleChatMessage);
      socket.off('stream:viewerJoined', handleViewerJoined);
      socket.off('stream:viewerLeft', handleViewerLeft);
    };
  }, [socket, streamId]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !streamId) return;

    sendChatMessage(streamId as string, messageText);
    setMessageText('');
  };

  const handleLeaveStream = async () => {
    if (!streamId) return;

    try {
      await leaveStream(streamId as string);
      router.back();
    } catch (error) {
      Alert.alert('Error', `Failed to leave stream: ${error}`);
    }
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.messageItem}>
      <View>
        <ThemedText style={styles.messageName}>
          {item.userName}
          <ThemedText style={styles.messageTime}> {item.timestamp}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.messageText}>{item.message}</ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Video Player Area */}
      <View
        style={[
          styles.videoContainer,
          { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault },
        ]}>
        <View style={styles.videoPlaceholder}>
          <ThemedText style={styles.videoText}>
            {activeStream ? activeStream.title : 'Loading...'}
          </ThemedText>
          {activeStream && (
            <ThemedText style={styles.viewerCountText}>
              👁️ {activeStream.viewerCount} watching
            </ThemedText>
          )}
        </View>
      </View>

      {/* Stream Info and Controls */}
      <View style={styles.infoContainer}>
        {activeStream && (
          <>
            <View style={styles.streamInfo}>
              <View style={styles.infoPart}>
                <ThemedText type="defaultSemiBold">{activeStream.title}</ThemedText>
                <ThemedText style={styles.broadcasterName}>
                  {activeStream.broadcasterName}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={handleLeaveStream}>
                <Ionicons name="close" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Chat Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}>
        <TouchableOpacity
          style={styles.chatToggle}
          onPress={() => setShowChat(!showChat)}>
          <Ionicons
            name={showChat ? 'chevron-down' : 'chatbubbles'}
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <ThemedText style={styles.chatToggleText}>
            {showChat ? 'Hide' : 'Show'} Chat
          </ThemedText>
        </TouchableOpacity>

        {showChat && (
          <>
            <FlatList
              ref={chatListRef}
              data={chatMessages}
              renderItem={renderChatMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatList}
              onContentSizeChange={() =>
                chatListRef.current?.scrollToEnd({ animated: true })
              }
              ListEmptyComponent={
                <View style={styles.emptyChatContainer}>
                  <ThemedText style={styles.emptyChatText}>
                    No messages yet. Be the first to chat!
                  </ThemedText>
                </View>
              }
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                  },
                ]}
                placeholder="Type a message..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}
                onPress={handleSendMessage}>
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  videoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewerCountText: {
    color: '#fff',
    fontSize: 14,
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  streamInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoPart: {
    flex: 1,
  },
  broadcasterName: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  exitButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  chatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatToggleText: {
    fontWeight: '600',
  },
  chatList: {
    padding: 12,
    gap: 12,
  },
  emptyChatContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  messageItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageName: {
    fontWeight: '600',
    fontSize: 13,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: 'normal',
    opacity: 0.6,
  },
  messageText: {
    marginTop: 4,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
