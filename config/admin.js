
const { createHmac } = require('node:crypto');

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },

  // Nature Health Tips article preview
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [
        env(
          'PREVIEW_URL',
          'https://preview.naturehealthtips.com'
        ),
      ],

      async handler(uid, { documentId }) {
        if (uid !== 'api::article.article') {
          return null;
        }

        const previewUrl = env('PREVIEW_URL');
        const secret = env('PREVIEW_SECRET');

        if (!previewUrl || !secret || !documentId) {
          return null;
        }

        // Signed preview links expire after five minutes.
        const expires = Math.floor(Date.now() / 1000) + 300;

        const signature = createHmac('sha256', secret)
          .update(`${documentId}:${expires}`)
          .digest('hex');

        const url = new URL('/preview/article', previewUrl);

        url.searchParams.set('documentId', documentId);
        url.searchParams.set('expires', String(expires));
        url.searchParams.set('signature', signature);

        return url.toString();
      },
    },
  },
});
