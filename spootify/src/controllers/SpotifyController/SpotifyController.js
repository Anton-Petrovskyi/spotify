import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_ENTITIES = {
  NEW_RELEASES: ['new-releases', 'albums'],
  FEATURED_PLAYLISTS: ['featured-playlists', 'playlists'],
  CATEGORIES: ['categories', 'categories'],
}
const { REACT_APP_SPOTIFY_CLIENT_ID, REACT_APP_SPOTIFY_CLIENT_SECRET } = process.env;
const encodedToken = new Buffer(`${REACT_APP_SPOTIFY_CLIENT_ID}:${REACT_APP_SPOTIFY_CLIENT_SECRET}`).toString('base64');

let ACCESS_TOKEN;
let ACCESS_TOKEN_EXPIRATION_TIME;

const authOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${encodedToken}` 
  },
  params: {
    'grant_type': 'client_credentials'
  }
};

/**
 * Refresh ACCESS_TOKEN if it is empty or expired.
 */
async function refreshAccessToken() {
  const today = new Date().getTime();
  const isTokenExpired = ACCESS_TOKEN_EXPIRATION_TIME <= today;
  if (!ACCESS_TOKEN || !ACCESS_TOKEN_EXPIRATION_TIME || isTokenExpired) {
    const { data: { access_token, expires_in } } = await axios.post(
      SPOTIFY_AUTH_URL,
      null,
      authOptions
    );
    ACCESS_TOKEN = access_token;
    ACCESS_TOKEN_EXPIRATION_TIME = today + expires_in;
  }
}

/**
 * Request data from the Spotify API.
 */
async function requestData(path, field, locale = 'en_US') {
  const { data } = await axios.get(
    `${SPOTIFY_BASE_URL}/browse/${path}?locale=${locale}`,
    { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
  );
  return data;
}

async function getEntity([path, field]) {
  await refreshAccessToken();
  const data = await requestData(path, field);
  return data[field].items;
}

function getNewReleases() {
  return getEntity(SPOTIFY_ENTITIES.NEW_RELEASES);
}

function getFeaturedPlaylists() {
  return getEntity(SPOTIFY_ENTITIES.FEATURED_PLAYLISTS);
}

function getCategories() {
  return getEntity(SPOTIFY_ENTITIES.CATEGORIES);
}

export { getCategories, getFeaturedPlaylists, getNewReleases }