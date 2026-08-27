// collaborationServer.js — sets up the WebSocket server that relays
// real-time document changes between connected users (via Yjs)
const { setupWSConnection } = require('y-websocket/bin/utils');

// This function is called once, when the main server starts.
// It attaches a WebSocket handler to the existing HTTP server.
const setupCollaboration = (httpServer) => {
  const { WebSocketServer } = require('ws');
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    // The document ID comes from the URL, e.g. ws://localhost:5000/document:abc123
    setupWSConnection(ws, req);
  });

  // Hook the WebSocket server into the existing HTTP server's "upgrade" event
  // (this is how a normal HTTP connection "upgrades" to a WebSocket connection)
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  console.log('Real-time collaboration server ready');
};

module.exports = setupCollaboration;
