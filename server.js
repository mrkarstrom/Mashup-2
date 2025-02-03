import express from 'express';
import { handleErrors } from './src/utils/ErrorHandler.js';
import artistRoutes from './src/api/v1/routes/artistRoutes.js';
import rootRoute from './src/api/v1/routes/index.js';
import logger from './src/middleware/logger.js';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(logger);

app.use('/', rootRoute);

app.use('/artist', artistRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(handleErrors);

if (process.env.NODE_ENV !== 'test') {
  const HOST = process.env.HOST || 'localhost';
  const PROTOCOL = process.env.PROTOCOL || 'http';
  app.listen(PORT, () => {
    console.log(`Server running on ${PROTOCOL}://${HOST}:${PORT}`);
  });
}
export { app };
