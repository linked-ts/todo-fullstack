import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler';


const app = express();


const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
app.use(requestLogger); 


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TodoApp Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});


app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to TodoApp API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      tasks: {
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
        stats: 'GET /api/tasks/stats'
      }
    }
  });
});


app.use(notFoundHandler); 
app.use(errorHandler); 

export default app;
