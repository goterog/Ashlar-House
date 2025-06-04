// Simple test to verify if lifecycle hooks are working in Strapi v5
const lifecycleModule = require('../src/api/booking/content-types/booking/lifecycles.js');

console.log('🧪 TESTING LIFECYCLE HOOK');
console.log('==========================');

// Check if the module exports the correct structure
console.log('1. Module exports:', Object.keys(lifecycleModule));

// Test if afterCreate function exists
if (lifecycleModule.afterCreate) {
  console.log('✅ afterCreate function found');
  console.log('✅ Function type:', typeof lifecycleModule.afterCreate);
} else {
  console.log('❌ afterCreate function NOT found');
}

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

// Mock strapi.log for testing
global.strapi = {
  log: {
    info: (msg) => console.log('📝 [INFO]:', msg),
    error: (msg, err) => console.log('❌ [ERROR]:', msg, err),
    warn: (msg) => console.log('⚠️ [WARN]:', msg)
  }
};

console.log('\n2. Testing lifecycle function with mock data...');
console.log('Mock booking data:', JSON.stringify(mockEvent.result, null, 2));

// Test the function (but don't actually send WhatsApp messages)
async function testLifecycle() {
  try {
    // We'll modify the lifecycles temporarily to not send actual messages
    console.log('\n🔄 Executing afterCreate hook...');
    await lifecycleModule.afterCreate(mockEvent);
    console.log('✅ Lifecycle hook executed successfully');
  } catch (error) {
    console.log('❌ Error in lifecycle hook:', error.message);
  }
}

testLifecycle();
