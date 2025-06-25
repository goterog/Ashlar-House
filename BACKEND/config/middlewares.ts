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
        // En desarrollo
        if (process.env.NODE_ENV === 'development') {
          return ['http://localhost:*', 'http://127.0.0.1:*', 'https://*.vercel.app'];
        }
        // En producción
        return [
          'https://ashlar-house.vercel.app',
          'https://*.vercel.app',
          'https://ashlar-house-production.up.railway.app'
        ];
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
