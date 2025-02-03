import express from 'express';
import { ArtistService } from '../../../services/ArtistService.js';
import { wrapAsync } from '../../../utils/wrapAsync.js';
import sanitizeHtml from 'sanitize-html';
import { ErrorHandler } from '../../../utils/ErrorHandler.js';

const router = express.Router();
const artistService = new ArtistService();

const sanitizeOptions = {
  allowedTags: ['p', 'b', 'i', 'span', 'br', 'a'],
  allowedAttributes: {
    '*': ['class', 'style', 'href'],
  },
};

router.get(
  '/:mbid?',
  wrapAsync(async (req, res) => {
    const mbid = req.params.mbid;
    if (!mbid) {
      throw new ErrorHandler(400, 'MBID is required');
    }
    const artistData = await artistService.getArtistData(mbid);

    const sanitizedDescription = sanitizeHtml(
      artistData.description,
      sanitizeOptions
    );

    artistData.description = sanitizedDescription;

    res.status(200).json(artistData);
  })
);

export default router;
