// Simple test to verify if lifecycle hooks are working in Strapi v5
console.log('🧪 TESTING LIFECYCLE HOOK');
console.log('==========================');

try {
  const lifecycleModule = require('../src/api/booking/content-types/booking/lifecycles.js');
  
  // Check if the module exports the correct structure
  console.log('1. Module exports:', Object.keys(lifecycleModule));

  // Test if afterCreate function exists
  if (lifecycleModule.afterCreate) {
    console.log('✅ afterCreate function found');
    console.log('✅ Function type:', typeof lifecycleModule.afterCreate);
  } else {
    console.log('❌ afterCreate function NOT found');
  }

  // Mock strapi.log for testing
  global.strapi = {
    log: {
      info: (msg) => console.log('📝 [INFO]:', msg),
      error: (msg, err) => console.log('❌ [ERROR]:', msg, err),
      warn: (msg) => console.log('⚠️ [WARN]:', msg)
    }
  };

  // Create a mock event to test the function
  const mockEvent = {
    result: {
      id: 999,
      estado: 'Reservado',
      start: '2025-01-07',
      end: '2025-01-08',
      source: 'Test',
      name: 'Test User',
      email: 'test@test.com',
      phone: '1234567890',
      guest: '2',
      message: 'Test booking'
    }
  };

  console.log('\n2. Testing lifecycle function with mock data...');
  console.log('Mock booking data:', JSON.stringify(mockEvent.result, null, 2));

  // Test the function
  async function testLifecycle() {
    try {
      console.log('\n🔄 Executing afterCreate hook...');
      await lifecycleModule.afterCreate(mockEvent);
      console.log('✅ Lifecycle hook executed successfully');
    } catch (error) {
      console.log('❌ Error in lifecycle hook:', error.message);
      console.log('Error details:', error);
    }
  }

  testLifecycle();

} catch (error) {
  console.log('❌ Error loading lifecycle module:', error.message);
  console.log('Error details:', error);
}
