import axios from 'axios';
import { ArtistService } from '../src/services/ArtistService.js';
import { getCache, setCache } from '../src/utils/CacheUtil.js';
import { ErrorHandler } from '../src/utils/ErrorHandler.js';

jest.mock('axios');
jest.mock('../src/utils/CacheUtil.js');

describe('ArtistService', () => {
  let artistService;

  beforeEach(() => {
    artistService = new ArtistService();
    jest.clearAllMocks();
  });

  it('should return cached data if available', async () => {
    const mockMBID = '0383dadf-2a4e-4d10-a46a-e9e041da8eb3';
    const cachedData = { mbid: mockMBID, description: 'Cached artist data' };

    getCache.mockReturnValue(cachedData);

    const result = await artistService.getArtistData(mockMBID);

    expect(getCache).toHaveBeenCalledWith(mockMBID);
    expect(result).toEqual(cachedData);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should throw an error for a malformed MBID', async () => {
    const malformedMBID = 'invalid-mbid';

    await expect(artistService.getArtistData(malformedMBID)).rejects.toThrow(
      new ErrorHandler(
        400,
        'This is not a correct MBID, it must be in the type of: xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-12) all digits or letters.'
      )
    );

    expect(getCache).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should fetch data from external services if not cached', async () => {
    const mockMBID = '0383dadf-2a4e-4d10-a46a-e9e041da8eb3';
    const mockMusicBrainzData = {
      relations: [
        {
          type: 'wikidata',
          url: { resource: 'https://www.wikidata.org/wiki/Q42' },
        },
      ],
      'release-groups': [{ title: 'Album 1', id: 'album-id-1' }],
    };
    const mockWikipediaData = {
      entities: {
        Q42: { sitelinks: { enwiki: { title: 'Sample Artist' } } },
      },
    };
    const mockWikiDescription = {
      query: {
        pages: {
          12345: { pageid: 12345, extract: 'Artist biography here.' },
        },
      },
    };
    const mockAlbumsWithCovers = [
      { title: 'Album 1', id: 'album-id-1', image: null },
    ];

    getCache.mockReturnValue(null);
    axios.get
      .mockResolvedValueOnce({ data: mockMusicBrainzData })
      .mockResolvedValueOnce({ data: mockWikipediaData })
      .mockResolvedValueOnce({ data: mockWikiDescription })
      .mockResolvedValueOnce({
        data: { images: [{ image: 'cover-image-url' }] },
      });

    const result = await artistService.getArtistData(mockMBID);

    expect(getCache).toHaveBeenCalledWith(mockMBID);
    expect(axios.get).toHaveBeenCalledTimes(4);
    expect(setCache).toHaveBeenCalledWith(mockMBID, {
      mbid: mockMBID,
      description: 'Description not available.',
      albums: mockAlbumsWithCovers,
    });
    expect(result).toEqual({
      mbid: mockMBID,
      description: 'Description not available.',
      albums: mockAlbumsWithCovers,
    });
  });

  it('should throw a 404 error if artist is not found in MusicBrainz database', async () => {
    const mockMBID = '0383dadf-2a4e-4d10-a46a-e9e041da8eb3';

    getCache.mockReturnValue(null);
    axios.get.mockResolvedValueOnce({ data: { relations: null } }); // No relations

    await expect(artistService.getArtistData(mockMBID)).rejects.toThrow(
      new ErrorHandler(404, 'Artist not found in MusicBrainz database')
    );

    expect(getCache).toHaveBeenCalledWith(mockMBID);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should handle errors from external services gracefully', async () => {
    const mockMBID = '0383dadf-2a4e-4d10-a46a-e9e041da8eb3';

    getCache.mockReturnValue(null);
    axios.get.mockRejectedValue(
      new Error('Failed to fetch artist data from MusicBrainz')
    );

    await expect(artistService.getArtistData(mockMBID)).rejects.toThrow(
      new ErrorHandler(400, 'Artist not found in MusicBrainz database')
    );

    expect(getCache).toHaveBeenCalledWith(mockMBID);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
