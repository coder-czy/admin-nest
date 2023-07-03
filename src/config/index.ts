export default () => ({
  jwt: {
    secretkey: 'zANDwNQVFzxlfG9myPxVWAkq4iXJEPhI',
    expiresin: '2592000s',
    refreshExpiresIn: '2595000s',
  },
  app: {
    prefix: '/api',
    port: 3000,
  },
});
