import React, { createContext, useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Stream {
  id: string;
  title: string;
  broadcasterName: string;
  broadcasterId?: string;
  viewerCount: number;
  startedAt: string;
  thumbnail?: string;
}

export interface StreamContextType {
  socket: Socket | null;
  userId: string;
  userName: string;
  setUserName: (name: string) => void;
  streams: Stream[];
  activeStream: Stream | null;
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  startStream: (title: string) => Promise<string>;
  joinStream: (streamId: string) => Promise<void>;
  leaveStream: (streamId: string) => Promise<void>;
  endStream: (streamId: string) => Promise<void>;
  sendChatMessage: (streamId: string, message: string) => void;
  sendFrame: (streamId: string, frame: any) => void;
  refreshStreams: () => Promise<void>;
}

export const StreamContext = createContext<StreamContextType | undefined>(undefined);

interface StreamProviderProps {
  children: React.ReactNode;
  serverUrl?: string;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ 
  children, 
  serverUrl = 'http://localhost:3000' 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [userName, setUserName] = useState('Anonymous');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('user:join', { id: userId, name: userName });
    });

    newSocket.on('stream:created', (stream) => {
      setStreams((prev) => [...prev, { ...stream, viewerCount: 0 }]);
    });

    newSocket.on('stream:deleted', (data) => {
      setStreams((prev) => prev.filter((s) => s.id !== data.streamId));
      if (activeStream?.id === data.streamId) {
        setActiveStream(null);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, userName, serverUrl]);

  const startStream = useCallback(
    (title: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'));
          return;
        }

        socket.emit('stream:start', { title });
        
        socket.once('stream:started', (data) => {
          setIsStreaming(true);
          const newStream: Stream = {
            id: data.streamId,
            title,
            broadcasterName: userName,
            viewerCount: 0,
            startedAt: new Date().toISOString(),
          };
          setActiveStream(newStream);
          resolve(data.streamId);
        });

        socket.once('stream:error', (data) => {
          reject(new Error(data.error));
        });
      });
    },
    [socket, userName]
  );

  const joinStream = useCallback(
    (streamId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'));
          return;
        }

        socket.emit('stream:join', { streamId });

        socket.once('stream:joined', () => {
          // Fetch stream details
          fetch(`http://localhost:3000/streams/${streamId}`)
            .then((res) => res.json())
            .then((stream) => {
              setActiveStream({
                ...stream,
                viewerCount: stream.viewerCount || 0,
              });
              resolve();
            })
            .catch(reject);
        });

        socket.once('stream:error', (data) => {
          reject(new Error(data.error));
        });
      });
    },
    [socket]
  );

  const leaveStream = useCallback(
    (streamId: string): Promise<void> => {
      return new Promise((resolve) => {
        if (socket) {
          socket.emit('stream:leave', { streamId });
        }
        setActiveStream(null);
        resolve();
      });
    },
    [socket]
  );

  const endStream = useCallback(
    (streamId: string): Promise<void> => {
      return new Promise((resolve) => {
        if (socket) {
          socket.emit('stream:end', { streamId });
        }
        setIsStreaming(false);
        setActiveStream(null);
        resolve();
      });
    },
    [socket]
  );

  const sendChatMessage = useCallback(
    (streamId: string, message: string) => {
      if (socket) {
        socket.emit('stream:chat', { streamId, message });
      }
    },
    [socket]
  );

  const sendFrame = useCallback(
    (streamId: string, frame: any) => {
      if (socket) {
        socket.emit('stream:frame', { streamId, frame });
      }
    },
    [socket]
  );

  const refreshStreams = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/streams');
      const data = await response.json();
      setStreams(data);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
    }
  }, []);

  const value: StreamContextType = {
    socket,
    userId,
    userName,
    setUserName,
    streams,
    activeStream,
    isStreaming,
    setIsStreaming,
    startStream,
    joinStream,
    leaveStream,
    endStream,
    sendChatMessage,
    sendFrame,
    refreshStreams,
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = React.useContext(StreamContext);
  if (context === undefined) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
