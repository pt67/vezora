# Quick Start Guide - GoStreamer

## Get Started in 5 Minutes

### Step 1: Start the Backend Server
```bash
cd server
npm install
npm start
```

You should see: `Server running on http://localhost:3000`

### Step 2: Start the Frontend App
In a new terminal (keep server running):
```bash
npm install
npm start
```

### Step 3: Choose Your Platform
```
i - iOS Simulator
a - Android Emulator  
w - Web Browser
s - Expo Go
```

### Step 4: Test the App

**To Broadcast:**
1. Tap "Go Live" on home screen
2. Enter a stream title (e.g., "My First Stream")
3. Tap "Go Live" button
4. Camera will activate
5. In another device/emulator, join the stream to test

**To Watch:**
1. On another device/window, navigate to Watch tab
2. Browse active streams
3. Tap stream to join
4. View and chat in real-time

## Common Commands

### Development
```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend (in project root)
npm start
```

### Production
```bash
# Build standalone APK (Android)
expo build:android

# Build IPA (iOS)
expo build:ios

# Deploy backend
npm run build
npm start
```

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend app loads successfully
- [ ] Can navigate between tabs
- [ ] Camera permission works
- [ ] Can start a stream
- [ ] Stream appears in watch list on another device
- [ ] Can join stream as viewer
- [ ] Chat messages send and receive
- [ ] Viewer count updates
- [ ] Can stop stream
- [ ] Stream disappears from list after stopping

## Environment Setup

### For Android Emulator
If connecting to localhost from emulator:
```
Change: http://localhost:3000
To: http://10.0.2.2:3000
```

### For Physical Devices
```
1. Get your computer's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
2. Update serverUrl in app/_layout.tsx:
   serverUrl="http://YOUR_IP:3000"
3. Ensure phone and computer on same Wi-Fi
```

## Debugging

### Backend Issues
```bash
# Check server status
curl http://localhost:3000/health

# View active streams
curl http://localhost:3000/streams
```

### Frontend Issues
Enable Expo dev tools: Press `Shift + M` in terminal

### Network Issues
- Clear app cache: Delete app and reinstall
- Check firewall
- Verify port 3000 is not blocked
- Try different network if available

## Next Steps

After successful setup:
1. Customize UI colors in `constants/theme.ts`
2. Add user authentication
3. Implement stream recording
4. Add database for persistence
5. Deploy to production

## Getting Help

Check the main `STREAMING_APP_README.md` for detailed documentation.

Enjoy streaming! 🎬📱
