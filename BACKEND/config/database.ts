import path from 'path';

export default ({ env }) => {
  // Determinar el cliente de base de datos
  const client = env('DATABASE_CLIENT', env('NODE_ENV') === 'development' ? 'sqlite' : 'postgres');
  
  console.log(`🗄️  Database: Using ${client} (NODE_ENV: ${env('NODE_ENV')})`);
  
  // Configuración SQLite para desarrollo
  if (client === 'sqlite' || env('NODE_ENV') === 'development') {
    // Usar ruta absoluta desde el directorio raíz del proyecto
    const dbPath = path.resolve(process.cwd(), env('DATABASE_FILENAME', '.tmp/data.db'));
    console.log(`📁 SQLite DB path: ${dbPath}`);
    
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: dbPath,
        },
        useNullAsDefault: true,
      },
    };
  }

  // Configuración PostgreSQL para producción
  const databaseUrl = env('DATABASE_URL');
  
  // Fallback para build sin DATABASE_URL
  if (!databaseUrl) {
    console.warn('⚠️  DATABASE_URL not found, using fallback config for build...');
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
