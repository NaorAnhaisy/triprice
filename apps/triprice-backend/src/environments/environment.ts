export const environment = {
  production: false,
  BACKEND_URL:
    process.env['NODE_ENV'] === 'production'
      ? 'https://triprice.cs.colman.ac.il/api'
      : 'http://localhost:3333/api',
  AUTHORIZATION_KEY:
    '0mIjtuKxYr3U2rUNFtWAGnoJ6IzHqjIzXIymsnWoTql1fj7Qs7qUeg2b6UA6sWFP',
};