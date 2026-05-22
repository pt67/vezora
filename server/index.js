const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// In-memory storage
const streams = new Map();
const users = new Map();
const streamViewers = new Map();

// Rest API endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/streams', (req, res) => {
  const activeStreams = Array.from(streams.values()).map(stream => ({
    id: stream.id,
    title: stream.title,
    broadcasterName: stream.broadcasterName,
    viewerCount: streamViewers.get(stream.id)?.size || 0,
    startedAt: stream.startedAt,
    thumbnail: stream.thumbnail,
  }));
  res.json(activeStreams);
});

app.get('/streams/:streamId', (req, res) => {
  const stream = streams.get(req.params.streamId);
  if (!stream) {
    return res.status(404).json({ error: 'Stream not found' });
  }
  res.json({
    id: stream.id,
    title: stream.title,
    broadcasterName: stream.broadcasterName,
    broadcasterId: stream.broadcasterId,
    viewerCount: streamViewers.get(stream.id)?.size || 0,
    startedAt: stream.startedAt,
  });
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('user:join', (userData) => {
    const userId = userData.id || socket.id;
    users.set(socket.id, {
      id: userId,
      name: userData.name || `User ${userId.substring(0, 8)}`,
      socketId: socket.id,
    });
    console.log(`User ${userData.name} joined`);
  });

  // Broadcaster starts stream
  socket.on('stream:start', (streamData) => {
    const streamId = uuidv4();
    const broadcaster = users.get(socket.id);
    
    const newStream = {
      id: streamId,
      title: streamData.title || 'Untitled Stream',
      broadcasterName: broadcaster?.name || 'Anonymous',
      broadcasterId: socket.id,
      socketId: socket.id,
      startedAt: new Date().toISOString(),
      thumbnail: streamData.thumbnail || null,
    };

    streams.set(streamId, newStream);
    streamViewers.set(streamId, new Set());

    // Join broadcaster to their own room
    socket.join(`stream:${streamId}`);

    // Notify all clients about new stream
    io.emit('stream:created', {
      id: streamId,
      title: newStream.title,
      broadcasterName: newStream.broadcasterName,
      startedAt: newStream.startedAt,
    });

    socket.emit('stream:started', { streamId });
    console.log(`Stream started: ${streamId}`);
  });

  // Viewer joins stream
  socket.on('stream:join', (data) => {
    const { streamId } = data;
    const stream = streams.get(streamId);

    if (!stream) {
      socket.emit('stream:error', { error: 'Stream not found' });
      return;
    }

    socket.join(`stream:${streamId}`);
    const viewers = streamViewers.get(streamId);
    viewers.add(socket.id);

    io.to(`stream:${streamId}`).emit('stream:viewerJoined', {
      viewerCount: viewers.size,
      message: `${users.get(socket.id)?.name || 'Someone'} joined`,
    });

    socket.emit('stream:joined', { streamId });
    console.log(`Viewer joined stream ${streamId}. Total viewers: ${viewers.size}`);
  });

  // Broadcast video frame
  socket.on('stream:frame', (data) => {
    const { streamId, frame } = data;
    const stream = streams.get(streamId);

    if (stream && stream.socketId === socket.id) {
      io.to(`stream:${streamId}`).emit('stream:frame', { frame });
    }
  });

  // Chat message
  socket.on('stream:chat', (data) => {
    const { streamId, message } = data;
    const user = users.get(socket.id);

    io.to(`stream:${streamId}`).emit('stream:chatMessage', {
      userId: socket.id,
      userName: user?.name || 'Anonymous',
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Viewer leaves stream
  socket.on('stream:leave', (data) => {
    const { streamId } = data;
    socket.leave(`stream:${streamId}`);
    
    const viewers = streamViewers.get(streamId);
    if (viewers) {
      viewers.delete(socket.id);
      io.to(`stream:${streamId}`).emit('stream:viewerLeft', {
        viewerCount: viewers.size,
      });
    }

    console.log(`Viewer left stream ${streamId}`);
  });

  // Broadcaster ends stream
  socket.on('stream:end', (data) => {
    const { streamId } = data;
    const stream = streams.get(streamId);

    if (stream && stream.socketId === socket.id) {
      io.to(`stream:${streamId}`).emit('stream:ended', {
        streamId,
        message: 'Stream ended by broadcaster',
      });

      socket.leave(`stream:${streamId}`);
      streams.delete(streamId);
      streamViewers.delete(streamId);

      io.emit('stream:deleted', { streamId });
      console.log(`Stream ended: ${streamId}`);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    // Check if this user was a broadcaster
    for (const [streamId, stream] of streams.entries()) {
      if (stream.socketId === socket.id) {
        io.to(`stream:${streamId}`).emit('stream:ended', {
          streamId,
          message: 'Broadcaster disconnected',
        });
        streams.delete(streamId);
        streamViewers.delete(streamId);
        io.emit('stream:deleted', { streamId });
      }
    }

    users.delete(socket.id);
    console.log('User disconnected:', user?.name || socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
