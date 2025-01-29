import axios from 'axios';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { getCache, setCache } from '../utils/CacheUtil.js';

export class ArtistService {
  async getArtistData(mbid) {
    if (!this.isValidMBID(mbid)) {
      throw new ErrorHandler(
        400,
        'This is not a correct MBID, it must be in the type of: xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-12) all digits or letters.'
      );
    }

    // First check for cached data to avoid excessive API calls.
    const cachedData = getCache(mbid);
    if (cachedData) {
      return cachedData;
    }

    try {
      const artistInfo = await this.fetchMusicBrainzData(mbid);
      const [description, albums] = await Promise.all([
        this.fetchWikipediaData(artistInfo.wikidataId).catch((error) => {
          return 'Description not available.';
        }),
        this.fetchAlbumsWithCovers(artistInfo.albums).catch((error) => {
          return [];
        }),
      ]);

      const artistData = {
        mbid,
        description,
        albums,
      };

      setCache(mbid, artistData);

      return artistData;
    } catch (error) {
      throw new ErrorHandler(400, 'Artist not found in MusicBrainz database');
    }
  }

  async fetchMusicBrainzData(mbid) {
    const url = `https://musicbrainz.org/ws/2/artist/${mbid}?&fmt=json&inc=url-rels+release-groups`;
    try {
      const { data } = await axios.get(url);

      if (!data || !data.relations) {
        throw new ErrorHandler(404, 'Artist not found in MusicBrainz database');
      }

      const wikidataId = this.extractWikidataId(data.relations);
      const albums = this.extractAlbums(data['release-groups']);

      return { wikidataId, albums };
    } catch (error) {
      throw new ErrorHandler(500, 'Artist not found in MusicBrainz database');
    }
  }

  async fetchWikipediaData(wikidataId) {
    const wikidataUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&props=sitelinks`;
    try {
      const { data } = await axios.get(wikidataUrl);
      const wikipediaTitle =
        data.entities[wikidataId]?.sitelinks?.enwiki?.title;
      if (!wikipediaTitle) {
        console.warn('Wikipedia title not found for Wikidata ID:', wikidataId);
        return 'Description not available.';
      }

      const wikipediaUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${encodeURIComponent(
        wikipediaTitle
      )}`;
      const wikiData = await axios.get(wikipediaUrl);
      const pages = wikiData.data.query.pages;
      const page = Object.values(pages)[0];

      return page?.extract || 'Description not available.';
    } catch (error) {
      throw new ErrorHandler(500, 'Failed to fetch data from Wikipedia');
    }
  }

  async fetchAlbumsWithCovers(albums) {
    const coverArtPromises = albums.map(async (album) => {
      const coverUrl = `https://coverartarchive.org/release-group/${album.id}`;
      try {
        const { data } = await axios.get(coverUrl);
        return {
          ...album,
          image: data.images[0]?.image || null,
        };
      } catch (error) {
        return { ...album, image: null };
      }
    });

    return Promise.all(coverArtPromises);
  }

  isValidMBID(mbid) {
    const regex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regex.test(mbid);
  }

  extractWikidataId(relations) {
    const wikidataRel = relations.find((rel) => rel.type === 'wikidata');
    return wikidataRel?.url?.resource?.split('/').pop();
  }

  extractAlbums(releaseGroups) {
    return releaseGroups.map((group) => ({
      title: group.title,
      id: group.id,
    }));
  }
}
