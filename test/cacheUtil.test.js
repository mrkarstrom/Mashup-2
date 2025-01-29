import NodeCache from 'node-cache';

jest.mock('node-cache');

import {
  setCache,
  getCache,
  clearCache,
  clearAllCache,
} from '../src/utils/CacheUtil.js';

describe('Cache utility functions', () => {
  let mockCacheInstance;

  beforeEach(() => {
    mockCacheInstance = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      flushAll: jest.fn(),
    };

    NodeCache.mockImplementation(() => mockCacheInstance);
  });

  it('setCache sets a value in the cache', () => {
    setCache('testKey', 'testValue', mockCacheInstance);

    expect(mockCacheInstance.set).toHaveBeenCalledWith('testKey', 'testValue');
  });

  it('getCache retrieves a value from the cache', () => {
    mockCacheInstance.get.mockReturnValue('testValue');

    const result = getCache('testKey', mockCacheInstance);

    expect(mockCacheInstance.get).toHaveBeenCalledWith('testKey');
    expect(result).toBe('testValue');
  });

  it('clearCache removes a specific key from the cache', () => {
    clearCache('testKey', mockCacheInstance);

    expect(mockCacheInstance.del).toHaveBeenCalledWith('testKey');
  });

  it('clearAllCache flushes all keys from the cache', () => {
    clearAllCache(mockCacheInstance);

    expect(mockCacheInstance.flushAll).toHaveBeenCalled();
  });
});
