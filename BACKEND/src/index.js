// Script para registrar automáticamente los content types necesarios
// Ubicación: src/index.js o modificación del archivo existente

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 Iniciando bootstrap para content types...');
    
    try {
      // Verificar si los content types existen
      const contentTypes = strapi.contentTypes;
      
      if (!contentTypes['api::newsletter-subscriber.newsletter-subscriber']) {
        console.log('⚠️ Content type newsletter-subscriber no encontrado');
      } else {
        console.log('✅ Content type newsletter-subscriber encontrado');
      }
      
      if (!contentTypes['api::contact-message.contact-message']) {
        console.log('⚠️ Content type contact-message no encontrado');
      } else {
        console.log('✅ Content type contact-message encontrado');
      }
      
      // Configurar permisos automáticamente para role público
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });
      
      if (publicRole) {
        console.log('📋 Configurando permisos para role público...');
        
        const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: publicRole.id }
        });
        
        // Buscar y actualizar permisos para newsletter-subscriber
        const newsletterPermissions = permissions.filter(p => 
          p.action?.includes('newsletter-subscriber')
        );
        
        const contactPermissions = permissions.filter(p => 
          p.action?.includes('contact-message')
        );
        
        console.log(`📧 Newsletter permissions encontrados: ${newsletterPermissions.length}`);
        console.log(`📞 Contact permissions encontrados: ${contactPermissions.length}`);
      }
      
    } catch (error) {
      console.error('❌ Error en bootstrap:', error.message);
    }
  },
};
