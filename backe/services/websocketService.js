const WebSocket = require('ws');

let wss;

const broadcast = (data) => {
  if (!wss) {
    console.error("WebSocket server (wss) is not initialized.");
    return;
  }

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error('Failed to send message to client:', error);
      }
    }
  });
};

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    ws.on('error', (error) => {
      console.error('WebSocket error on client:', error);
    });
  });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    
    if (url.pathname === '/api/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  console.log('WebSocket server initialized and attached to HTTP server.');
};

module.exports = { initializeWebSocket, broadcast }; 