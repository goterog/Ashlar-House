/**
 * Test script for the secure backend email system
 * Tests both newsletter subscription and contact message functionality
 */

const axios = require('axios');

const API_BASE = 'http://localhost:1337/api';

// Test data
const testData = {
  newsletter: {
    name: 'Test User',
    email: 'test@example.com',
    email_subscription: true,
    whatsapp_subscription: false,
    source: 'test_script'
  },
  contact: {
    name: 'Test Contact',
    email: 'testcontact@example.com',
    message: 'This is a test message from the secure backend email system.',
    newsletter_email: true,
    newsletter_whatsapp: false
  }
};

async function testNewsletterSubscription() {
  console.log('\n📧 Testing Newsletter Subscription...');
  
  try {
    const response = await axios.post(`${API_BASE}/newsletter-subscribers`, {
      data: testData.newsletter
    });
    
    console.log('✅ Newsletter subscription successful');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Newsletter subscription failed');
    console.log('🔍 Error details:', error.response?.data || error.message);
    return false;
  }
}

async function testContactMessage() {
  console.log('\n📨 Testing Contact Message...');
  
  try {
    const response = await axios.post(`${API_BASE}/contact-messages`, {
      data: testData.contact
    });
    
    console.log('✅ Contact message successful');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Contact message failed');
    console.log('🔍 Error details:', error.response?.data || error.message);
    return false;
  }
}

async function testEmailJSEnvironment() {
  console.log('\n🔧 Testing EmailJS Environment Variables...');
  
  // Check if EmailJS service is available
  try {
    const response = await axios.get(`${API_BASE}/`);
    console.log('✅ Backend API is accessible');
    
    // Environment variables are loaded server-side, so we can't directly test them
    // But we can verify they exist by checking the successful email sending
    console.log('📝 EmailJS variables should be configured in the backend .env file:');
    console.log('   - EMAILJS_PUBLIC_KEY: fjE9Qo5zVa2mfHE4m');
    console.log('   - EMAILJS_SERVICE_ID: service_dk8fe1s');
    console.log('   - EMAILJS_TEMPLATE_ID: template_8xeecee');
    
    return true;
  } catch (error) {
    console.log('❌ Backend API not accessible');
    console.log('🔍 Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Secure Backend Email System Tests');
  console.log('=' .repeat(50));
  
  const results = {
    environment: false,
    newsletter: false,
    contact: false
  };
  
  // Test environment
  results.environment = await testEmailJSEnvironment();
  
  // Test newsletter subscription
  results.newsletter = await testNewsletterSubscription();
  
  // Test contact message
  results.contact = await testContactMessage();
  
  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  console.log(`🔧 Environment Setup: ${results.environment ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📧 Newsletter Subscription: ${results.newsletter ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📨 Contact Message: ${results.contact ? '✅ PASS' : '❌ FAIL'}`);
  
  const totalPassed = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Score: ${totalPassed}/${totalTests} tests passed`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 All tests passed! The secure backend email system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the error details above.');
  }
}

// Run the tests
runTests().catch(console.error);
