import path from 'path';

export default ({ env }) => {
  // Desarrollo: SQLite
  if (env('NODE_ENV') === 'development') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      },
    };
  }

  // Producción: PostgreSQL (Railway)
  const databaseUrl = env('DATABASE_URL');
  
  // Debug: Mostrar información de la base de datos
  console.log('=== DATABASE CONFIG DEBUG ===');
  console.log('NODE_ENV:', env('NODE_ENV'));
  console.log('DATABASE_URL exists:', !!databaseUrl);
  console.log('DATABASE_URL length:', databaseUrl ? databaseUrl.length : 0);
  if (databaseUrl) {
    console.log('DATABASE_URL prefix:', databaseUrl.substring(0, 20) + '...');
  }
  console.log('All env vars with DATABASE:', Object.keys(process.env).filter(key => key.includes('DATABASE')));
  console.log('============================');
  
  // Durante el build, DATABASE_URL puede no estar disponible
  // En Railway, se configurará en runtime
  if (!databaseUrl) {
    console.warn('DATABASE_URL not found, using temporary config for build...');
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
          },
        },
        debug: false,
        pool: {
          min: 0,
          max: 10,
          acquireTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 100,
        },
      },
    };
  }

  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString: databaseUrl,
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        },
      },
      debug: false,
      pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
    },
  };
};
