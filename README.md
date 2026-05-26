# GoStreamer - Live Streaming App

A complete streaming application built with React Native (Expo) and Node.js that allows users to broadcast live video streams and watch streams from other users.

## Features

- **Live Broadcasting**: Start streaming video with a title and reach viewers in real-time
- **Stream Discovery**: Browse and join active streams from other broadcasters
- **Live Chat**: Real-time chat system for viewers and broadcasters to interact during streams
- **User Management**: Set up your profile with a custom username
- **Viewer Count**: See how many people are watching your stream in real-time
- **Stream Dashboard**: View all active streams with broadcaster info and viewer count
- **Camera Support**: Full camera integration for streaming

## Architecture

### Backend (Node.js + Socket.IO)
Located in `/server` directory:
- Express server for REST API endpoints
- Socket.IO for real-time communication
- In-memory stream and user management
- Stream room-based messaging system

### Frontend (React Native + Expo)
Main app components:
- **Home Screen**: Dashboard with user profile and quick actions
- **Stream Screen**: Start and manage live broadcasts
- **Watch Screen**: Browse and join active streams
- **Stream Viewer**: Watch streams with chat integration
- **Stream Context**: Global state management for streams and socket connections

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. In the project root, install dependencies:
```bash
npm install
```

2. Update the server URL in `app/_layout.tsx` if your backend is running on a different address:
```typescript
<StreamProvider serverUrl="http://YOUR_SERVER_ADDRESS:3000">
```

3. Start the Expo development server:
```bash
npm start
```

4. Choose your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Project Structure

```
gostreamer/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx             # Home/Dashboard screen
│   │   ├── stream.tsx            # Stream recording screen
│   │   ├── watch.tsx             # Stream discovery screen
│   │   └── explore.tsx           # Explore screen
│   ├── watch/
│   │   └── [streamId].tsx        # Stream viewer screen
│   ├── _layout.tsx               # Root layout with StreamProvider
│   └── modal.tsx
├── components/                   # Reusable UI components
├── contexts/
│   └── stream-context.tsx        # Stream management context
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-user-preferences.ts   # User profile management
│   └── use-theme-color.ts
├── constants/
│   └── theme.ts                  # Theme colors
├── server/
│   ├── package.json
│   └── index.js                  # Socket.IO backend server
└── package.json

## API Endpoints

### REST API
- `GET /health` - Server health check
- `GET /streams` - Get all active streams
- `GET /streams/:streamId` - Get specific stream details

### Socket.IO Events

**Broadcaster Events:**
- `stream:start` - Start a new stream
- `stream:end` - End the current stream
- `stream:frame` - Send video frame to viewers
- `stream:chat` - Send chat message

**Viewer Events:**
- `stream:join` - Join a stream
- `stream:leave` - Leave a stream
- `stream:chat` - Send chat message

**User Events:**
- `user:join` - User connects to the app

**Server Events (received by clients):**
- `stream:created` - Notified when new stream starts
- `stream:deleted` - Notified when stream ends
- `stream:joined` - Confirmation of joining a stream
- `stream:viewerJoined` - New viewer joined the stream
- `stream:viewerLeft` - Viewer left the stream
- `stream:chatMessage` - New chat message received
- `stream:frame` - Video frame for broadcasting
- `stream:ended` - Stream ended notification

## Usage

### For Broadcasters
1. Open the app and set your username from the home screen
2. Tap "Go Live" button on home screen or navigate to Stream tab
3. Enter your stream title
4. Press "Go Live" button
5. Camera will turn on and start broadcasting
6. View count shows in real-time
7. Stop stream when done

### For Viewers
1. Open the app and set your username
2. Tap "Watch Streams" button on home screen or navigate to Watch tab
3. Browse active streams
4. Tap on a stream to join
5. Chat with other viewers and the broadcaster
6. Leave when done

## Technologies Used

### Frontend
- React Native 0.81
- Expo 54
- Expo Router (Navigation)
- Expo Camera (Video capture)
- Socket.IO Client (Real-time communication)
- React Navigation (Tab navigation)
- AsyncStorage (Local persistence)
- TypeScript

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS
- UUID

## Future Enhancements

- [ ] Video recording and playback
- [ ] Stream history
- [ ] User authentication
- [ ] Stream permissions (private/public)
- [ ] Broadcaster monetization
- [ ] HD/Multiple quality streams
- [ ] Scheduled streams
- [ ] Stream moderation tools
- [ ] Viewer statistics
- [ ] Stream clips feature
- [ ] Social sharing
- [ ] Mobile notifications

## Configuration

### Server Configuration
Edit `server/index.js` to customize:
- `PORT`: Server port (default: 3000)
- CORS settings
- Stream storage strategy

### Frontend Configuration
Edit `app/_layout.tsx` to customize:
- `serverUrl`: Backend server address
- Provider configuration

## Troubleshooting

### Camera permissions not granted
Make sure to grant camera permissions when prompted. On Android, you may need to manually enable permissions in settings.

### Cannot connect to server
- Verify the server is running: `http://localhost:3000/health`
- Update `serverUrl` in `app/_layout.tsx` if running on different machine
- Check firewall settings
- For Android emulator: use `10.0.2.2` instead of `localhost`

### Streams not showing
- Refresh the watch screen
- Ensure broadcaster has started a stream
- Check server console for errors
- Verify Socket.IO connection is established

### Chat messages not appearing
- Check Socket.IO events in browser dev tools
- Verify you're in the correct stream room
- Restart the app if connection was lost

## Performance Tips

1. Use good Wi-Fi connection for broadcasting
2. Ensure device has sufficient battery
3. Close other apps to improve performance
4. Use good lighting for better video quality
5. Keep streams under 5 minutes initially while testing

## Security Considerations

- The current implementation uses in-memory storage (data lost on server restart)
- Add authentication before production deployment
- Implement stream encryption for sensitive content
- Add rate limiting to prevent abuse
- Sanitize all user inputs
- Use HTTPS in production

## License

MIT

## Support

For issues and feature requests, please open an issue in the repository.
