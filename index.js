import express from 'express';
import { handleErrors } from './src/utils/ErrorHandler.js';
import artistRoutes from './src/routes/artistRoutes.js';
import logger from './src/utils/logger.js';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(logger);

app.get('/', (req, res, next) => {
  res.type('text/html');
  res.send(
    `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #2c3e50;">Welcome to the Music Artist Finder API</h2>
    <p>
        Please enter the MBID (<span style="font-weight: bold;">:id</span>) after 
        <code style="background: #eee; padding: 2px 4px; border-radius: 4px; font-size: 1.2em;">localhost:3000/artist/:id</code> 
        (e.g., 
        <code style="background: #eee; padding: 2px 4px; border-radius: 4px; font-size: 1.2em;">0383dadf-2a4e-4d10-a46a-e9e041da8eb3</code>).
    </p>
    <p>You can try these links to get all albums for specific artists:</p>
    <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 8px;">
            <strong>Queen:</strong> 
            <a href="http://localhost:3000/artist/0383dadf-2a4e-4d10-a46a-e9e041da8eb3" 
               style="color: #0073e6; text-decoration: none;">http://localhost:3000/artist/0383dadf-2a4e-4d10-a46a-e9e041da8eb3</a>
        </li>
        <li>
            <strong>Bruno Mars:</strong> 
            <a href="http://localhost:3000/artist/afb680f2-b6eb-4cd7-a70b-a63b25c763d5" 
               style="color: #0073e6; text-decoration: none;">http://localhost:3000/artist/afb680f2-b6eb-4cd7-a70b-a63b25c763d5</a>
        </li>
    </ul>
</div>
`
  );
});

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
