import app from './app';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
  console.log('🚀 TodoApp Backend Server Started');
  console.log(`📍 Server running at: http://${HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📋 API endpoints: http://${HOST}:${PORT}/api/tasks`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('=====================================');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
