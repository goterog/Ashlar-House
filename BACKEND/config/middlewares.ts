export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "'unsafe-inline'"],
          'script-src-attr': ["'unsafe-inline'"],
          'media-src': ["'self'", 'data:', 'https:', 'http:', 'blob:'],
          'img-src': ["'self'", 'data:', 'https:', 'http:', 'blob:'],
          'connect-src': ["'self'", 'https:', 'http:', 'data:', 'blob:'],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'frame-ancestors': ["'none'"]
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      headers: [
        'Content-Type',
        'Authorization', 
        'Origin',
        'Accept',
        'X-Requested-With',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Range',
        'Content-Range',
        'Accept-Ranges'
      ],
      origin: function(ctx) {
        const requestOrigin = ctx.request.header.origin;

        // Orígenes fijos permitidos
        const allowed = [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://ashlar-house.vercel.app',
          'https://ashlar-house-production.up.railway.app',
        ];

        // Previews de Vercel (ej. ashlar-house-git-branch.vercel.app)
        const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

        if (requestOrigin && (allowed.includes(requestOrigin) || vercelPreview.test(requestOrigin))) {
          return requestOrigin;
        }

        return false;
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: false,
      keepHeaderOnError: true,
      optionsSuccessStatus: 200
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
