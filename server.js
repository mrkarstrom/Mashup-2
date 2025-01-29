import express from 'express';
import { handleErrors } from './src/utils/ErrorHandler.js';
import artistRoutes from './src/routes/artistRoutes.js';
import rootRoutes from './src/routes/index.js';
import logger from './src/middleware/logger.js';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(logger);

app.use('/', rootRoutes);

app.use('/artist', artistRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(handleErrors);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export { app };
