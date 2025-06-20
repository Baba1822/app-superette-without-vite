const { createProxyMiddleware } = require('http-proxy-middleware');

const filter = (pathname, req) => {
  // Proxy API calls and our specific WebSocket path
  return pathname.startsWith('/api');
};

module.exports = function(app) {
  app.use(
    '/', // Use a general path to catch all requests
    createProxyMiddleware(filter, { // Use the filter function
      target: 'http://localhost:5000',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
    })
  );
}; 