// Configuration file for GoStreamer app
// Customize these settings for your deployment

export const CONFIG = {
  // Server Configuration
  SERVER: {
    // Backend server URL - Change this for production or mobile device testing
    URL: 'http://localhost:3000',
    
    // For Android Emulator, use: 'http://10.0.2.2:3000'
    // For physical device on same network, use: 'http://<YOUR_IP>:3000'
    
    // Socket.IO connection options
    SOCKET_OPTIONS: {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    },
  },

  // App Configuration
  APP: {
    // Default stream title
    DEFAULT_STREAM_TITLE: 'My Stream',
    
    // Default username prefix
    DEFAULT_USERNAME_PREFIX: 'User_',
    
    // Stream frame send interval (milliseconds)
    STREAM_FRAME_INTERVAL: 100,
    
    // Maximum stream title length
    MAX_STREAM_TITLE_LENGTH: 100,
  },

  // Feature Flags
  FEATURES: {
    // Enable chat in streams
    ENABLE_CHAT: true,
    
    // Show viewer count
    SHOW_VIEWER_COUNT: true,
    
    // Enable stream history
    ENABLE_HISTORY: false,
    
    // Enable advanced camera settings
    ENABLE_CAMERA_SETTINGS: false,
  },

  // UI Configuration
  UI: {
    // Auto-refresh streams interval (milliseconds)
    AUTO_REFRESH_INTERVAL: 30000,
    
    // Chat message auto-scroll
    AUTO_SCROLL_CHAT: true,
    
    // Show loading indicators
    SHOW_LOADERS: true,
  },

  // Cache Configuration
  CACHE: {
    // Cache duration (milliseconds)
    DURATION: 60000,
    
    // Clear cache on app launch
    CLEAR_ON_LAUNCH: false,
  },

  // API Timeouts
  TIMEOUTS: {
    // Socket connection timeout
    SOCKET_CONNECT: 10000,
    
    // Stream start/join timeout
    STREAM_OPERATION: 15000,
    
    // Stream list fetch timeout
    FETCH_STREAMS: 10000,
  },

  // Storage Keys
  STORAGE_KEYS: {
    USER_PREFERENCES: '@gostreamer_user_prefs',
    STREAM_HISTORY: '@gostreamer_stream_history',
    FAVORITE_STREAMS: '@gostreamer_favorites',
    APP_SETTINGS: '@gostreamer_settings',
  },

  // Error Messages
  ERRORS: {
    SOCKET_NOT_CONNECTED: 'Socket not connected to server',
    STREAM_NOT_FOUND: 'Stream not found',
    PERMISSION_DENIED: 'Permission denied',
    NETWORK_ERROR: 'Network error occurred',
    STREAM_ENDED: 'Stream has ended',
  },

  // Success Messages
  SUCCESS: {
    STREAM_STARTED: 'Stream started successfully',
    STREAM_ENDED: 'Stream ended',
    STREAM_JOINED: 'Successfully joined stream',
    MESSAGE_SENT: 'Message sent',
  },
};

// Override configuration for specific environments
export const getConfig = (environment: 'development' | 'staging' | 'production' = 'development') => {
  const baseConfig = { ...CONFIG };

  switch (environment) {
    case 'staging':
      baseConfig.SERVER.URL = 'http://staging-server:3000';
      break;
    case 'production':
      baseConfig.SERVER.URL = 'https://api.gostreamer.app';
      break;
    default:
      // development uses default config
      break;
  }

  return baseConfig;
};
