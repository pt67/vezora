// Utility functions for stream management

export interface StreamError {
  code: string;
  message: string;
  timestamp: Date;
}

// Format time for display
export const formatTime = (date: Date | string): string => {
  const time = typeof date === 'string' ? new Date(date) : date;
  return time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Format duration
export const formatDuration = (startTime: Date | string): string => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

// Generate stream ID
export const generateStreamId = (): string => {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate user ID
export const generateUserId = (): string => {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate stream title
export const validateStreamTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.trim().length <= 100;
};

// Validate username
export const validateUsername = (username: string): boolean => {
  return username.trim().length > 0 && username.trim().length <= 50;
};

// Get viewer count display text
export const getViewerCountText = (count: number): string => {
  if (count === 0) return 'No viewers';
  if (count === 1) return '1 viewer';
  return `${count} viewers`;
};

// Check if stream is recent
export const isStreamRecent = (startTime: Date | string, minutes: number = 60): boolean => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const now = new Date();
  const diff = (now.getTime() - start.getTime()) / 1000 / 60;
  return diff < minutes;
};

// Sort streams by viewer count
export const sortStreamsByViewers = (streams: any[]): any[] => {
  return [...streams].sort((a, b) => b.viewerCount - a.viewerCount);
};

// Sort streams by start time (newest first)
export const sortStreamsByTime = (streams: any[]): any[] => {
  return [...streams].sort((a, b) => {
    const timeA = new Date(a.startedAt).getTime();
    const timeB = new Date(b.startedAt).getTime();
    return timeB - timeA;
  });
};

// Filter streams by broadcaster
export const filterStreamsByBroadcaster = (streams: any[], broadcasterName: string): any[] => {
  return streams.filter((s) =>
    s.broadcasterName.toLowerCase().includes(broadcasterName.toLowerCase())
  );
};

// Create error object
export const createStreamError = (code: string, message: string): StreamError => {
  return {
    code,
    message,
    timestamp: new Date(),
  };
};

// Log stream event
export const logStreamEvent = (event: string, data: any): void => {
  if (__DEV__) {
    console.log(`[Stream Event] ${event}:`, data);
  }
};

// Create stream metadata
export const createStreamMetadata = (title: string, broadcasterName: string) => {
  return {
    title,
    broadcasterName,
    startedAt: new Date().toISOString(),
    thumbnail: null,
    metadata: {
      platform: 'mobile',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  };
};

// Sanitize chat message
export const sanitizeChatMessage = (message: string): string => {
  return message
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 500); // Max 500 chars
};

// Check camera permission status
export const shouldRequestCameraPermission = (): boolean => {
  // This should be implemented based on platform
  return true;
};

// Get stream status
export const getStreamStatus = (startedAt: Date | string): 'active' | 'ending' | 'ended' => {
  const start = typeof startedAt === 'string' ? new Date(startedAt) : startedAt;
  const now = new Date();
  const diff = (now.getTime() - start.getTime()) / 1000 / 60; // in minutes

  if (diff > 480) return 'ended'; // 8 hours
  if (diff > 240) return 'ending'; // 4 hours
  return 'active';
};

// Export all utilities as object for easier usage
export const StreamUtils = {
  formatTime,
  formatDuration,
  generateStreamId,
  generateUserId,
  validateStreamTitle,
  validateUsername,
  getViewerCountText,
  isStreamRecent,
  sortStreamsByViewers,
  sortStreamsByTime,
  filterStreamsByBroadcaster,
  createStreamError,
  logStreamEvent,
  createStreamMetadata,
  sanitizeChatMessage,
  shouldRequestCameraPermission,
  getStreamStatus,
};
