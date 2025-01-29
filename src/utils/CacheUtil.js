import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export const setCache = (key, value, cacheInstance = cache) => {
  cacheInstance.set(key, value);
};

export const getCache = (key, cacheInstance = cache) => {
  return cacheInstance.get(key);
};

export const clearCache = (key, cacheInstance = cache) => {
  cacheInstance.del(key);
};

export const clearAllCache = (cacheInstance = cache) => {
  cacheInstance.flushAll();
};
