export default ({ env }) => {
  // Obtener el puerto de manera segura
  let port = 3000;
  try {
    const portEnv = env('PORT');
    if (portEnv) {
      const parsedPort = parseInt(portEnv, 10);
      if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
        port = parsedPort;
      }
    }
  } catch (error) {
    console.warn('Error parsing PORT, using default 3000:', error.message);
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: port,
  app: {
    keys: env.array('APP_KEYS', ['default-key-1', 'default-key-2']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  settings: {
    cors: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:1337',
        'http://localhost:3000',
        env('FRONTEND_URL', '*'),
      ],
    },
  },
};
};
