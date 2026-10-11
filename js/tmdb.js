/**
 * FOBS Subtitles - The Movie Database (TMDb) API Integration
 * Configured with User API Key & Read Access Token
 */

const TMDB_CONFIG = {
  apiKey: '6e766190399843a3e1d85b68eaa3de69',
  readAccessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTc2NjE5MDM5OTg0M2EzZTFkODViNjh1YWEzZGU2OSIsIm5iZiI6MTc5MTczNzg2Mi4wNjcwMDAyLCJzdWIiOiI2YWNiYmZlODMwZTB1M2R1NzhmMTEzYmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.40CASk-C-S_WDRNfAYa4tdk6VaIQ_mXcWc8fQpp8qI',
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p/'
};

/**
 * TMDb API Client Helper
 */
const TMDB = {
  /**
   * Search for movies and TV series by title query
   * @param {string} query 
   * @param {number} page 
   * @returns {Promise<Array>}
   */
  async searchMulti(query, page = 1) {
    if (!query || query.trim().length < 2) return { results: [] };
    try {
      const url = `${TMDB_CONFIG.baseUrl}/search/multi?api_key=${TMDB_CONFIG.apiKey}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('TMDB search error:', err);
      return { results: [] };
    }
  },

  /**
   * Get detailed information for a movie
   * @param {number|string} movieId 
   */
  async getMovie(movieId) {
    try {
      const url = `${TMDB_CONFIG.baseUrl}/movie/${movieId}?api_key=${TMDB_CONFIG.apiKey}&append_to_response=credits,videos`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`TMDB getMovie(${movieId}) error:`, err);
      return null;
    }
  },

  /**
   * Get detailed information for a TV show
   * @param {number|string} tvId 
   */
  async getTv(tvId) {
    try {
      const url = `${TMDB_CONFIG.baseUrl}/tv/${tvId}?api_key=${TMDB_CONFIG.apiKey}&append_to_response=credits,videos`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`TMDB getTv(${tvId}) error:`, err);
      return null;
    }
  },

  /**
   * Generate an image URL from TMDB path
   * @param {string} path 
   * @param {string} size e.g. 'w500', 'w1280', 'original'
   */
  getImageUrl(path, size = 'w500') {
    if (!path) return '';
    return `${TMDB_CONFIG.imageBaseUrl}${size}${path}`;
  }
};

// Expose globally
window.TMDB_CONFIG = TMDB_CONFIG;
window.TMDB = TMDB;
