/**
 * Safe local storage manager with memory fallback
 */

const memoryStorage = {};

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
    }
  },

  set: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      memoryStorage[key] = value;
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
      memoryStorage[key] = value;
    }
  },

  remove: (key) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      delete memoryStorage[key];
    } catch (e) {
      console.warn(`Error deleting localStorage key "${key}":`, e);
      delete memoryStorage[key];
    }
  },

  clearAll: () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
      for (const k in memoryStorage) delete memoryStorage[k];
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  }
};
