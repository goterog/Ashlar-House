'use strict';

/**
 * `media-cors` middleware
 */

module.exports = (config, { strapi }) => {
  // Añadir cualquier lógica de inicialización aquí
  return async (ctx, next) => {
    await next();
    
    // Log temporal para diagnóstico
    if (ctx.url.includes('/uploads/')) {
      console.log('🎥 Media CORS middleware - URL:', ctx.url);
      console.log('🎥 Content-Type:', ctx.response.get('content-type'));
    }
    
    // Si es un archivo multimedia, añade headers específicos
    if (ctx.url.includes('/uploads/') && ctx.response.get('content-type')) {
      const contentType = ctx.response.get('content-type');
      
      if (contentType.includes('video/') || contentType.includes('audio/') || contentType.includes('image/')) {
        console.log('🎥 Adding CORS headers for media file:', ctx.url);
        
        // Headers para CORS específicos de multimedia
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        ctx.set('Access-Control-Allow-Headers', 'Range, Content-Range, Accept-Ranges');
        ctx.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
        
        // Headers para caching y streaming
        ctx.set('Accept-Ranges', 'bytes');
        ctx.set('Cache-Control', 'public, max-age=31536000');
        
        // Permite embedding en iframes cross-origin
        ctx.set('X-Frame-Options', 'ALLOWALL');
        
        console.log('🎥 CORS headers added successfully');
      }
    }
  };
};
